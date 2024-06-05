function pushOutputButton() {
    let textBoxValue = document.querySelector('.textarea').value;
    let url = "https://example.com/?text=" + encodeURIComponent(textBoxValue);
    let link = "<a href='" + url + "' target='_blank'>" + url + "</a>";
    document.getElementById('output_text').innerHTML = link; // リンクタグに変更
}

function showURL() {
    let textBoxValue = document.querySelector('.textarea').value;
    let url = "https://example.com/?text=" + encodeURIComponent(textBoxValue);
    let link = "<a href='" + url + "' target='_blank'>" + url + "</a>";
    document.getElementById('output_text').innerHTML = link;
}

function clearOutput() {
    document.getElementById('output_text').innerHTML = "";
}