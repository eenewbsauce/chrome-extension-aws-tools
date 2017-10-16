var settings;

window.addEventListener('load', function (evt) {
  settings = getInitialSettings(true);

  for(var key in settings) {
    $(`#${key}-checkbox`).on('click', toggle);
  }

  $('#all').on('click', resetSettings);
  $('#none').on('click', clearSettings);
});

setupOptions(true);

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

function resetSettings() {
  chrome.storage.sync.clear();
  setupOptions(true);
}

function clearSettings() {
  chrome.storage.sync.clear();
  setupOptions(false);
}

function toggle() {
  var $elem = $(this);
  var selector = $elem.attr('data-selector');
  var isChecked = $elem.prop('checked');

  sendToggleMessage({
    name: $elem.attr('name'),
    isChecked: isChecked,
    selector: selector
  }, true);
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

function createMessageFromStorage(storageItem) {
  return { isChecked: storageItem.isChecked, selector: storageItem.selector };
}
