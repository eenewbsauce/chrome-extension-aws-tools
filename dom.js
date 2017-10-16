chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.isChecked) {
      $(request.selector).show();
    } else {
      $(request.selector).hide();
    }

    sendResponse({farewell: 'foo'})
});
