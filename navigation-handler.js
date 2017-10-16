$('body').css('background-image', '')
$('body').css('background-color', '#444')
// $('.list-card-details').css('margin-top', 'initial')

setupOptions(true)

function setupOptions(isChecked) {
  chrome.storage.sync.get(function(options) {
    if (Object.keys(options).length === 0) {
      options = getInitialSettings(isChecked);
      chrome.storage.sync.set(options, () => {})
    }

    for (var key in options) {
      $(`#${key}-checkbox`).prop('checked', options[key].isChecked);
      sendToggleMessage(createMessageFromStorage(options[key]), false);
    }
  });
}

function getInitialSettings(isChecked) {
  var baseSettings = {
    members: {
      selector: '.list-card-members'
    },
    labels: {
      selector: '.list-card-labels'
    },
    stickers: {
      selector: '.list-card-stickers-area'
    },
    badges: {
      selector: '.badges'
    },
    "cover-images": {
      selector: '.list-card-cover'
    }
  }

  for(var key in baseSettings) {
    var setting = baseSettings[key];
    setting.isChecked = isChecked;
  }

  return baseSettings;
}

function sendToggleMessage(message, saveToStorage) {
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendMessage(tab.id, message, function(response) {
      if (saveToStorage) {
        chrome.storage.sync.set({
          [message.name]: {
            isChecked: message.isChecked,
            selector: message.selector
          }
        }, function() {});
      }
    });
  });
}

function createMessageFromStorage(storageItem) {
  return { isChecked: storageItem.isChecked, selector: storageItem.selector };
}
