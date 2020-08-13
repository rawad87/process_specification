function readCommonAjaxXML($searchtype, $criteria, $mode)
/* jQuery method $.post used for AJAX */
{
	var jqxhr = $.post("/TronDOC2/include/common_db_queries/common_queries_ajax_server.php",
		{
		searchtype:$searchtype,
		criteria:$criteria,                                            
		mode:$mode
		},
	function(data,status){
		returnData = data;
	});
	return jqxhr;
}

// Functio to read units that share serial number range
function sharedRangeUnits(partnum, callback){
	var reportObject = readCommonAjaxXML('sharedSerial', partnum);
	reportObject.done(function() {
		console.log("Unit search: ", reportObject.responseText);
		var parser = new DOMParser();
		unitsDoc = parser.parseFromString(reportObject.responseText, "text/xml");
		var codesNodeList = unitsDoc.getElementsByTagName("code");
		array = [];
		for (var i=0; i < codesNodeList.length; i++) {
			var number = codesNodeList[i].getElementsByTagName("number")[0].firstChild.nodeValue;
			console.log("Unit: ", number);
			array.push(number);
		}
		// Return array with part numbers
		callback(array);
	});
}



