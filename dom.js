chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
	//refresh loan
	var b = document.getElementById('ddbv2-scan-query-start-button');

	b.click()

	setTimeout(doTheRest, 1500);

	function doTheRest() {
		//close modal
		document.querySelector('.mcancel').dispatchEvent(new MouseEvent('click'));

		//open modal again
		var a = document.querySelectorAll('#ddbv2-items-view table tr td a');

		a[7].click();

    	sendResponse({ success: true });
	}
});
