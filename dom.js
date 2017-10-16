chrome.extension.onMessage
	.addListener(
		function(request, sender, sendResponse) {
			searchLoan(doTheRest);
		}
	)	

function doTheRest() {
	closeLoan();
	openLoan();
}

function closeLoan() {
	document.querySelector('.mcancel').dispatchEvent(new MouseEvent('click'));
	killSaveListener();
}

function searchLoan(cb, timeout) {
	if (typeof timeout === 'undefined') {
		timeout = 1500;
	}

	var b = document.getElementById('ddbv2-scan-query-start-button');
	b.click()

	setTimeout(cb, timeout);
}

function openLoan() {
	var a = document.querySelectorAll('#ddbv2-items-view table tr td a');
	a[7].click();
	listenForSave();
}

function listenForSave() {
	$('#cmn-confirm-btn')
		.on('click', function() {
			searchLoan(openLoan);
		});
}

function killSaveListener() {
	$('#cmn-confirm-btn').off('click');
}

//handle enter key for search
$(document)
	.on('keydown', function(e) {
		if (e.keyCode === 13) {
			searchLoan(searchLoan.bind(null, openLoan));
		}
	});