//Runs outside the webpage
// Acts as the brain and message hub

chrome.tabs.onUpdated.addListener((tabId, tab) => {
    if (tab.url && tab.url.includes("reddit.com/")){
        const queryParams = tab.url.split("?")[1];
        const urlParams = new URLSearchParams(queryParams);
        console.log(urlParams);
    }
})

chrome.extensions.onMessage.addListener(
    function (request, sender, response) {
        console.log(request.content)
    }
);
