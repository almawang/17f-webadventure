/* eslint no-undef: "off" */
chrome.browserAction.onClicked.addListener((tab) => {
  chrome.tabs.executeScript(tab.ib, {
    file: 'build/inject.js',
  });
});
