let isChatNameEnabled = false;
let isUserIdEnabled = false;

function clearPasteArea() {
    const pasteArea = document.getElementById("pasteArea");
    pasteArea.value = "";

    const outputArea = document.getElementById("output");
    outputArea.style.display = "none";

    const linkElement = document.getElementById("generatedLink");
    linkElement.style.display = "none";

    const copyLinkBtn = document.getElementById("copyLinkBtn");
    if (copyLinkBtn) {
        copyLinkBtn.style.display = "none";
    }

    const errorMessage = document.getElementById("error-message");
    errorMessage.style.display = "none";

    const warningMessage = document.getElementById("warning-message");
    warningMessage.style.display = "none";
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
    isUserIdEnabled = !isUserIdEnabled;
}

function processTable() {
    const pasteArea = document.getElementById("pasteArea");
    const chatName = document.getElementById("chatName").value;
    const text = pasteArea.value.trim();

    const errorMessage = document.getElementById("error-message");
    const warningMessage = document.getElementById("warning-message");

    if (text) {
        errorMessage.style.display = "none";
        const rows = text.split("\n");

        if (rows.length > 59) {
            warningMessage.style.display = "block";
            const outputArea = document.getElementById("output");
            outputArea.style.display = "none";
            return;
        }

        warningMessage.style.display = "none";
        const delimiter = isUserIdEnabled ? ";" : ",";
        const emailSuffix = isUserIdEnabled ? "" : "@tmc.twfr.toyota.co.jp";

        const concatenatedText = rows
            .map((row) => row.trim() + emailSuffix)
            .join(delimiter);
        let finalUrl = `msteams:/l/chat/0/0?users=${encodeURIComponent(
            concatenatedText
        )}`;

        if (isChatNameEnabled && chatName) {
            finalUrl += `&topicName=${encodeURIComponent(chatName)}`;
        }
        console.log(finalUrl);

        const linkElement = document.getElementById("generatedLink");
        linkElement.href = finalUrl;
        linkElement.textContent = "Teamsでグルチャを開始";
        linkElement.style.display = "inline-block";

        const outputArea = document.getElementById("output");
        outputArea.style.display = "block";
    } else {
        errorMessage.style.display = "block";
    }
}
