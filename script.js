window.addEventListener('load', function (evt) {
	var actions = {
		query: 'query',
		save: 'save',
		refresh: 'refresh',
		noop: 'noop'
	};

	var mode = {
		lastAction: actions.noop
	}

	// chrome.runtime.onMessage
	// 	.addListener(refreshHandler);

	//handle enter key for search
	document.addEventListener('keypress', function (e) {
	    var key = e.which || e.keyCode;

	    if (key === 13) {
	    	if (mode.lastAction === actions.noop) {
				mode.lastAction = actions.query;
	    	} else {
	    		queryRecord();
	    	}
	    }
	});	

	spyOnXHR();

	function refreshHandler() {
		queryRecord(actions.refresh);
	}
	
	function spyOnXHR() {
		var nativeSend = window.XMLHttpRequest.prototype.send;
	    window.XMLHttpRequest.prototype.send = function() {		
	        this.addEventListener('load', function() {
	        	let response = {};

	        	try {
	        		response = JSON.parse(this.response);
	        	} catch (e) {}

	        	if (isQueryRequest(response)) {

	        		switch (mode.lastAction) {
	        			case actions.save:
	        			case actions.query:
	        				openRecord();
	        				break;    				
						case actions.refresh:
							refreshRecord();
							break;
						default:
							break;
	        		}

	        	} else if (isUpdateRequest(response)) {
	    			queryRecord(actions.save);
	        	}
	        });
	        nativeSend.apply(this, arguments);
	    };
	}

	function isUpdateRequest(response) {
		var action = response && response.actionResponses
			? response.actionResponses[0].action
			: '';

		return action === 'com.amazonaws.console.dynamodbv2.shared.DynamoDBItemsRequestContext.updateItem'
	}

	function isQueryRequest(response) {
		var action = response && response.actionResponses 
			? response.actionResponses[0].action
			: "";

		return action === 'com.amazonaws.console.dynamodbv2.shared.DynamoDBItemsRequestContext.queryTable';
	}

	function refreshRecord() {
		closeRecord();
		setTimeout(openRecord, 200);
	}

	function closeRecord() {
		document.querySelector('.mcancel').dispatchEvent(new MouseEvent('click'));
	}

	function queryRecord(nextAction) {
		mode.lastAction = nextAction || actions.query;

		var b = document.getElementById('ddbv2-scan-query-start-button');
		b.click()
	}

	function openRecord() {
		var a = document.querySelectorAll('#ddbv2-items-view table tr td a');
		a[7].click();
	}
});
