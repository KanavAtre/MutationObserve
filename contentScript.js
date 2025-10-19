//Responsible for data collection from the webpage 
(() => {
    let currPost = "";
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const {postId, title, subreddit, text} = obj;
    });
})();

