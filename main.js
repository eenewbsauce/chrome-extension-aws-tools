chrome.webNavigation.onCompleted.addListener(function(details) {
    chrome.tabs.executeScript(details.tabId, {
        file: 'navigation-handler.js'
    });
}, {
    url: [{
        hostContains: '.trello.'
    }],
});
