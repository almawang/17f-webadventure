/* eslint no-undef: "off" */

let updatePage = false;
let leaderboard;

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'complete' && updatePage) {
    updatePage = false;
    chrome.tabs.executeScript(tabId, {
      file: 'dist/bundle.js',
    });

    console.log('printing new leaderboard scores');
    console.log(leaderboard.players[0]);

    // send current game info to redirected tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, leaderboard, function(response) {
        console.log("in query sendmessage of background.js");
        // console.log(response.farewell);
      });
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender) => {
  // save current game info in curGame
  leaderboard = request;

  // redirect to new url
  chrome.tabs.update(sender.tab.id, { url: request.url });
  updatePage = true;
});

chrome.browserAction.onClicked.addListener((tab) => {
  chrome.tabs.executeScript(tab.ib, {
    file: 'dist/bundle.js',
  });
});
