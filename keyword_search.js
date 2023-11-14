"use strict";

var tagCandidate = [];
var textCandidate = [];
var input_text = [];
var resultIndex = [];

/* テキストボックスが変更されたときに走る処理 */
function inputTextChangeProcess(e) {
    /* 入力文字の取得 */
    input_text = $("#keyword_input").val();

    /* 小文字&半角に統一したあと、スペースで区切る */
    var lower_input_text = normalizeWord(input_text);

    var separatorString = /\s+/;
    var separatedStrings = lower_input_text.split(separatorString);
    var textCandidateBase = [];
    /* データベースに検索キーワードあるかどうかチェック */
    Object.keys(database_list).forEach(function (_ref) {
        if (
            separatedStrings.every(function (word) {
                return database_list[_ref]["comparison"].indexOf(word) != -1;
            })
        ) {
            textCandidateBase.push(_ref);
        }
        return textCandidateBase;
    });
    textCandidate = textCandidateBase;

    /* テーブル表示を更新。レスポンス向上のため非同期処理で回す。 */
    resultIndex = mergeTable(tagCandidate, textCandidate);
    refreshTag(tagFilter(resultIndex));
    setTimeout(function () {
        createTable();
        showSearchWord(), 0;
    });
}

var selectedTag = [];
/* tagチェックボックスで選択された結果 */
function tagChangeProcess() {
    selectedTag = [];
    var tagCandidateBase = [];

    /* チェックされているcheckboxを取得 */
    $('input:checkbox[name="tag_item"]:checked').each(function () {
        selectedTag.push($(this).val());
    });

    /* データベースにタグあるかどうかチェック */
    Object.keys(database_list).forEach(function (_ref) {
        if (
            selectedTag.every(function (word) {
                return database_list[_ref]["tag"].indexOf(word) != -1;
            })
        ) {
            tagCandidateBase.push(_ref);
        }
        return tagCandidateBase;
    });
    tagCandidate = tagCandidateBase;

    /* テーブル表示を更新。レスポンス向上のため非同期処理で回す。 */
    resultIndex = mergeTable(tagCandidate, textCandidate);
    refreshTag(tagFilter(resultIndex));
    setTimeout(function () {
        createTable();
        showSearchWord(), 0;
    });
}

/* テキストとタグのANDを取る */
var mergedCandidate = [];
function mergeTable(arr01, arr02) {
    var concatArr = arr01.concat(arr02);
    var result = concatArr.filter(function (value, index, array) {
        /* インデックス番号を比較して重複データのみ排除 */
        return array.indexOf(value) !== index;
    });
    return result;
}

/* タグ選択後、他に選択可能なタグを抽出 */
function tagFilter(index) {
    var remainedTag = [];
    index.forEach(function (value) {
        var separatedTag = database_list[value]["tag"].split(/,+/);
        separatedTag.forEach(function (_ref) {
            if (remainedTag.indexOf(_ref) == -1) {
                remainedTag.push(_ref);
            }
        });
    });
    return remainedTag;
}

/* 候補が０になってしまうタグを押せないようにする */
function refreshTag(remainedTag) {
    $('input:checkbox[name="tag_item"]').each(function () {
        if (remainedTag.indexOf($(this).val()) == -1) {
            $(this).prop("disabled", true);
        } else {
            $(this).prop("disabled", false);
        }
    });
}

/* 選択状態やテキストボックスをクリア */
function clearStatus() {
    tagCandidate = [];
    textCandidate = [];
    mergedCandidate = [];
    selectedTag = [];

    $("#keyword_input").val("");
    input_text = "";

    /* checkboxの状態を初期化 */
    $('input:checkbox[name="tag_item"]').each(function () {
        $(this).prop("disabled", false);
        $(this).prop("checked", false);
    });

    /* 全件表示表示する（ToDo：関数化） */
    Object.keys(database_list).forEach(function (_ref) {
        tagCandidate.push(_ref);
        textCandidate.push(_ref);
    });
    resultIndex = mergeTable(tagCandidate, textCandidate);
    createTable();
    showSearchWord();
}

/* データベースファイルの読み込み */
var json_data = [];
var database_list = [];
var tag_list = "";
var setting_list = [];
var style_list = [];
function readTextFile(file) {
    json_data = tag_database;
    database_list = json_data["database"];
    tag_list = json_data["tag"];
    setting_list = json_data["setting"];
    style_list = json_data["style"];

    // キーワード検索用に、小文字大文字・半角全角化したオブジェクト(comparison)を作成
    Object.keys(database_list).forEach(function (_ref) {
        database_list[_ref]["comparison"] = "";
        Object.keys(database_list[_ref]["contents"]).forEach(function (_col) {
            database_list[_ref]["comparison"] += normalizeWord(
                database_list[_ref]["contents"][_col]
            );
        });
        database_list[_ref]["comparison"] += normalizeWord(
            database_list[_ref]["keywords"]
        );
    });
}

/* 小文字かつ半角に変換 */
function normalizeWord(word) {
    var lowerCase = word.toLowerCase();
    return lowerCase.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
    });
}

/* タグ選択のチェックボックスを作成する */
function createTagList(tag_list) {
    var indexCount = 0;
    tag_list.forEach(function (_ref, _index) {
        // タグカテゴリ
        $("<p>", {
            class: "tag_category",
        })
            .text(_ref.category)
            .appendTo($("#select_tag"));

        var divTag = $("<div>", {
            class: "tagDiv",
        });

        _ref.tagName.forEach(function (_val, _tagIndex) {
            var tagId = String(indexCount);

            $("<input>", {
                id: tagId,
                type: "checkbox",
                name: "tag_item",
                class: "tag_item",
                value: _val,
            }).appendTo(divTag);

            $("<label>", {
                class: "tag_label",
                for: tagId,
            })
                .text(_val)
                .appendTo(divTag);

            indexCount++;
        });
        divTag.appendTo($("#select_tag"));
    });
}
// 検索ワードを表示
function showSearchWord() {
    if (selectedTag.length || input_text.length) {
        $("#msg_searchword").show();
        $("#msg_guidance").hide();

        var convertTag = selectedTag.map(function (x) {
            return "<b><i>『" + x + "』</b><i>" + " ";
        });
        $("#search_tag").html(convertTag);

        var convertInputText = "";
        if (input_text.length) {
            convertInputText = '<b><i>"' + input_text + '"</i></b>';
        } else {
            convertInputText = "";
        }

        $("#search_word").html(convertInputText);
        $("#search_count").html(mergedCandidate.length);
    } else {
        $("#msg_searchword").hide();
        $("#msg_guidance").show();
        $("#total_count").html(mergedCandidate.length);
    }
}

/* 絞り込み結果テーブルを作成    */
function createTable() {
    mergedCandidate = [];
    let convertCandidate = [];
    resultIndex.forEach(function (value) {
        mergedCandidate.push(database_list[value]);
    });

    convertCandidate = addHrefTag(mergedCandidate);

    /* 検索結果が０件のときは表示を切り替える */
    if (mergedCandidate.length) {
        $("#result_list").css("display", "table");
        $("#result_none").css("display", "none");
    } else {
        $("#result_list").css("display", "none");
        $("#result_none").css("display", "table");
    }

    // テーブル作成
    $("#result_tbody").text("");

    for (let i = 0; i < mergedCandidate.length; i++) {
        var trTag = document.createElement("tr");

        trTag.className = "result_item";
        Object.keys(mergedCandidate[i]["contents"]).forEach(function (_ref) {
            $("<td>", {
                class: "t_body " + _ref,
            })
                .html(mergedCandidate[i]["contents"][_ref])
                .appendTo(trTag);
        });
        $("#result_tbody").append(trTag);

        // ToDo:設定ファイル化
        if (i >= 500 - 1) {
            $("#result_over").css("display", "block");
            break;
        } else {
            $("#result_over").css("display", "none");
        }
    }
}

// http:から始まる行には、<a href>タグを付与する
function addHrefTag(val) {
    Object.keys(val).forEach(function (_ref) {
        Object.keys(val[_ref].contents).forEach(function (_col) {
            val[_ref].contents[_col] = convertLinkRows(
                val[_ref].contents[_col]
            );
        });
    });
    return val;
}

// 各行がhttp:から始まっていれば<a href=を追加。メールアドレスだったらmailtoも追加
function convertLinkRows(row) {
    let sentences = row.split("<BR>");
    const regex_url = /^(https?)(:\/\/[\w\/:%#\$&\?\(\)~\.=\+\-]+)/;
    const regex_mail =
        /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;

    sentences.map(function (value, index, array) {
        if (regex_url.test(value)) {
            array[index] =
                "<a href=" +
                value +
                " target=_blank rel='noopener noreferrer'>" +
                "リンク" +
                "</a>";
        } else if (regex_mail.test(value)) {
            array[index] = "<a href=mailto:" + value + ">" + value + "</a>";
        }
    });
    return sentences.join("<br>");
}

/* お問合せ先 */
function createFooter() {
    let mail_prefix = "";
    let mail_contents = "";
    // 問い合わせ先リンクがメアドかどうか判定
    const regex =
        /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;
    if (regex.test(setting_list["link_addr"])) {
        mail_prefix = "mailto:";
        mail_contents =
            "?subject=" +
            setting_list["mail_title"] +
            "&" +
            "body=" +
            setting_list["mail_body"];
    }
    $("#contact").text(setting_list["contact"]);
    $("#notes").text(setting_list["notes"]);
    $("<a>", {
        href: mail_prefix + setting_list["link_addr"] + mail_contents,
    })
        .text(setting_list["link_text"])
        .appendTo("#mail");
}

/* URLパラメータ取得 */
function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/* ESCキーを押されたとき */
$(document).keyup(function (e) {
    if (e.keyCode === 27) {
        // escape key maps to keycode `27`
        clearStatus();
    }
});

///////////////////////////////////////////
/* テキストが変更された時の処理 */
$("#keyword_input").keyup(inputTextChangeProcess);

/* チェックが変更された時の処理 */
$("#select_tag").change(tagChangeProcess);

/* クリアボタンを押されたとき */
$("#clear_button").on("click", clearStatus);
///////////////////////////////////////////
/*本処理はここから */

/* データベースファイルの読み込み */
$(document).ready(function () {
    readTextFile();
    /* タグ選択のチェックボックスを表示する */
    createTagList(tag_list);

    /* 初回表示時にQAを全部表示する */
    Object.keys(database_list).forEach(function (_ref) {
        tagCandidate.push(_ref);
        textCandidate.push(_ref);
    });

    resultIndex = mergeTable(tagCandidate, textCandidate);
    refreshTag(tagFilter(resultIndex));
    createTable();
    showSearchWord();
    createFooter();

    /* タイトル登録 */
    console.log(database_list[1]["note1"]);

    $("#note1").html(database_list[1]["note1"]);
    $("title").html(setting_list["title"]);
    $("#page_title").html(setting_list["title"]);
    $("#copyright").html(setting_list["copyright"]);
    $("#keyword_input").attr("placeholder", setting_list["placeholder"]);

    // テーブルのヘッダを作成
    Object.keys(setting_list["table_header"]).forEach(function (_ref) {
        $("<th>", {
            class: "t_header",
            id: _ref,
        })
            .html(setting_list["table_header"][_ref])
            .appendTo($("#result_title"));
    });

    /* 検索語一覧を非表示に*/
    document.getElementById("msg_searchword").style.display = "none";

    /* URLパラメータからタグをクリック */
    var tagLabels = getParam("param");
    //パラメータが有る場合
    if (tagLabels !== null) {
        tagLabels.split(",").forEach(function (tagLabel) {
            $(".tag_item[value=" + tagLabel + "]").click();
        });
    }

    /*テキストボックスにフォーカスを当てる*/
    $("#keyword_input").focus();
});
