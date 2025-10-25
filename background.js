// Runs outside the webpage
// Acts as the brain and message hub

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url && tab.url.includes("reddit.com/")) {
        const queryParams = tab.url.split("?")[1];
        const urlParams = new URLSearchParams(queryParams);
        console.log(urlParams);

        chrome.tabs.sendMessage(tabId, {
            type: "TOP",
            postId: urlParams.get("v")
        });
    }
});

chrome.runtime.onMessage.addListener(function (request, sender, response) {
    console.log(request.content);
});
