<!DOCTYPE html>
<html lang="ja">
    <head>
        <meta charset="UTF-8" />
        <title>かんたんグルチャ！</title>
        <link rel="apple-touch-icon" href="favicon-180×180.png" />
        <link rel="icon" type="image/png" href="favicon-256×256.png" />
        <link rel="shortcut icon" href="favicon.ico" />
        <link rel="stylesheet" href="style.css" />
        <meta http-equiv="Content-type" content="text/html;charset=utf-8" />
    </head>
    <body>
        <div class="header-area">
            <img src="appName.png" id="img" alt="Image" />
        </div>
        <div class="control-area">
            <div class="flexbox-container">
                <aside class="leftSide">チャット名なし<br /></aside>
                <label class="switch">
                    <input
                        type="checkbox"
                        id="toggleChatNameBtn"
                        onclick="toggleChatName()"
                    />
                    <span class="slider"></span>
                </label>
                <aside class="rightSide">チャット名つける<br /></aside>
            </div>
            <br />
            <div class="flexbox-container">
                <aside class="leftSide">従業員コードのみ<br /></aside>
                <label class="switch">
                    <input
                        type="checkbox"
                        id="toggleDelimiterBtn"
                        onclick="toggleDelimiter()"
                    />
                    <span class="slider"></span>
                </label>
                <aside class="rightSide">[@tmc.twfr～] あり<br /></aside>
            </div>
        </div>
        <div class="input-area">
            <div class="input-group">
                <label for="chatName" style="display: none">チャット名</label>
                <input
                    type="text"
                    class="chatName"
                    id="chatName"
                    placeholder="チャット名は？"
                    style="display: none"
                />
            </div>
            <div class="input-group">
                <textarea
                    id="pasteArea"
                    class="pasteArea"
                    placeholder="・エクセルリストから簡単にグルチャを作成！&#13;・列を shift + ctrl + v で値貼付けしてね"
                ></textarea>
            </div>
            <div class="button-group">
                <button id="output_btn" onclick="processTable();">
                    リンク生成
                </button>
                <button
                    class="clear-button"
                    id="clear_btn"
                    onclick="clearPasteArea();"
                >
                    クリア
                </button>
            </div>
            <p id="error-message" class="error-message">
                テキストが入力されてません
            </p>
            <p id="warning-message" class="error-message" style="display: none">
                60行を超えました。60名以上は手動追加してください。
            </p>
        </div>
        <div class="output-area">
            <div id="output">
                <a
                    href="#"
                    id="generatedLink"
                    class="button-link"
                    style="display: none"
                    target="_blank"
                    onclick="clearPasteArea();"
                    >リンク</a
                >
            </div>
        </div>
        <script src="script.js"></script>
    </body>
</html>
