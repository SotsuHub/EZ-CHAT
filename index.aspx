<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>かんたんグルチャ</title>
        <meta http-equiv="Content-type" content="text/html;charset=utf-8" />
    </head>
    <body>
        <h1>かんたんグルチャ -web版-</h1>
        <div
            contenteditable="true"
            id="pasteArea"
            style="border: 1px solid black; min-height: 20px; padding: 10px"
            onclick="clearInitialText()"
        >
            ここにExcelからコピーしたテーブルをペーストしてください。
        </div>
        <input type="text" id="chatName" placeholder="チャット名を入力" />
        <button onclick="processTable()">リンク生成</button>
        <div id="output">
            <a href="#" id="generatedLink">生成されたリンクはこちら</a>
        </div>

        <script src="script.js"></script>
    </body>
</html>
