document.addEventListener('DOMContentLoaded', function() {
  // Get elements
  const currentPostElement = document.getElementById('current-post');
  const credibilityScoreElement = document.getElementById('credibility-score');
  const checkButton = document.getElementById('check-button');
  
  // Get the current tab info
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const currentTab = tabs[0];
    
    // Check if we're on a Reddit page
    if (currentTab.url && currentTab.url.includes('reddit.com')) {
      // Extract post info from URL
      const urlParts = currentTab.url.split('/');
      const commentsIndex = urlParts.indexOf('comments');
      
      if (commentsIndex !== -1 && commentsIndex + 1 < urlParts.length) {
        const postId = urlParts[commentsIndex + 1];
        const subreddit = urlParts[commentsIndex - 1];
        
        currentPostElement.textContent = `r/${subreddit} - Post ID: ${postId}`;
        
        // Enable the check button
        checkButton.disabled = false;
      } else {
        currentPostElement.textContent = "Not viewing a specific Reddit post";
        checkButton.disabled = true;
      }
    } else {
      currentPostElement.textContent = "Not on Reddit";
      checkButton.disabled = true;
    }
  });
  
  // Handle check button click
  checkButton.addEventListener('click', function() {
    credibilityScoreElement.textContent = "Analyzing post...";
    
    // Send message to background script to analyze the current post
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.runtime.sendMessage(
        { 
          action: "checkPost", 
          tabId: tabs[0].id 
        },
        function(response) {
          // Handle the response
          if (response && response.score) {
            credibilityScoreElement.textContent = `Score: ${response.score}/10`;
          } else {
            credibilityScoreElement.textContent = "Unable to analyze post";
          }
        }
      );
    });
  });
});
