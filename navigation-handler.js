chrome.browserAction.onClicked.addListener(function(tab) { 
  chrome.tabs.sendMessage(tab.id, 'refresh', function(response) {
    if (response.success) {
      console.log('record was refreshed by AWS Tools extension');
    }
  });
});

