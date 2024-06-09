let isChatNameEnabled = false;
let isDelimiterEnabled = false;

function clearPasteArea() {
    const pasteArea = document.getElementById("pasteArea");
    pasteArea.value = "";
    const outputArea = document.getElementById("output");
    outputArea.style.display = "none";
}

function toggleChatName() {
    isChatNameEnabled = !isChatNameEnabled;
    const chatNameInput = document.getElementById("chatName");
    if (isChatNameEnabled) {
        chatNameInput.style.display = "inline";
    } else {
        chatNameInput.style.display = "none";
        chatNameInput.value = "";
    }
}

function toggleDelimiter() {
    isDelimiterEnabled = !isDelimiterEnabled;
}

function processTable() {
    const pasteArea = document.getElementById("pasteArea");
    const chatName = document.getElementById("chatName").value;
    const text = pasteArea.value.trim();

    if (text) {
        const delimiter = isDelimiterEnabled ? ";" : ",";
        const rows = text.split("\n");
        const emailSuffix = isDelimiterEnabled ? "" : "@tmc.twfr.toyota.co.jp";

        const concatenatedText = rows.map((row) => row.trim() + emailSuffix).join(delimiter);
        let finalUrl = `https://teams.microsoft.com/l/chat/0/0?users=${encodeURIComponent(
            concatenatedText
        )}`;

        if (isChatNameEnabled && chatName) {
            finalUrl += `&topicName=${encodeURIComponent(chatName)}`;
        }

        const linkElement = document.getElementById("generatedLink");
        linkElement.href = finalUrl;
        linkElement.textContent = "Teamsでグルチャを開始";
        linkElement.style.display = "inline-block";
    } else {
        const linkElement = document.getElementById("generatedLink");
        linkElement.style.display = "none";
    }
}
