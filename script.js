function clearInitialText() {
    var pasteArea = document.getElementById("pasteArea");
    if (
        pasteArea.innerText ===
        "ここにExcelからコピーしたテーブルをペーストしてください。"
    ) {
        pasteArea.innerText = "";
    }
}

function processTable() {
    var pasteArea = document.getElementById("pasteArea");
    var table = pasteArea.querySelector("table"); // ペーストされたテーブル要素を取得
    var chatName = document.getElementById("chatName").value; // チャット名を取得

    if (table) {
        var concatenatedText = ""; // 連結するための空の文字列を初期化
        for (var i = 0; i < table.rows.length; i++) {
            if (table.rows[i].cells.length > 1) {
                // 2列目が存在するか確認
                var secondCell = table.rows[i].cells[1]; // 各行の2列目のセルを取得
                var cellText = secondCell.textContent.trim(); // セルのテキストから不要な空白を削除
                concatenatedText += cellText + "@tmc.twfr.toyota.co.jp"; // 2列目のセルのテキストを連結
                if (i < table.rows.length - 1) {
                    concatenatedText += ","; // 最後のセル以外の後ろにカンマを追加
                }
            }
        }

        // URLプレフィックスとサフィックスを追加
        var finalUrl =
            "https://teams.microsoft.com/l/chat/0/0?users=" +
            encodeURIComponent(concatenatedText) +
            "&topicName=" +
            encodeURIComponent(chatName);

        // 連結したURLをリンクとして表示
        var linkElement = document.getElementById("generatedLink");
        linkElement.href = finalUrl;
        linkElement.textContent = "Microsoft Teamsでチャットを開始"; // または他の適切なテキスト
    }
}
