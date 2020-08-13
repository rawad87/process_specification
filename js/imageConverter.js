/*function readUserFullnames () {
  	var userObject = readAjaxXML('usersFullName', '', '')
	userObject.done(function() {
		//alert(userObject.responseText);
		var parser = new DOMParser();
		userFullnamesDoc = parser.parseFromString(userObject.responseText, "text/xml");
		usersNodeList = userFullnamesDoc.getElementsByTagName("userfullname");
	})
}*/

function readImagesList() {
  	var jqObject = readAjaxXML('readImageList', '', '')
	jqObject.done(function() {
		//alert(jqObject.responseText);
		var parser = new DOMParser();
		imageListObj = parser.parseFromString(jqObject.responseText, "text/xml");
		buildImageTable()
	})
}

function buildImageTable()
{
	var rows = "";
	imageNodeList = imageListObj.getElementsByTagName("path");
	//alert(psNodeList.length);
	for (var i=0; i < imageNodeList.length; i++) {
		try { var path = imageNodeList[i].firstChild.nodeValue;}
		catch (e) {var path = "";}
		path = path.substr(3);
		path = path.replace(/\\/g,'/');
		rows = rows
		 + "<tr>"
		 	+"<td><a href='http://trondoc.jotron.local/" + path + "' target='_blank'>" + path + "</a></td>"
		 + "</tr>";
	};
	document.getElementById("psTableBody").innerHTML = rows;
}

function convertImages()
{
	
	newnameNodeList = imageListObj.getElementsByTagName("new_name");
	//alert(newnameNodeList.length);
	//var imagePath = imageNodeList[0].firstChild.nodeValue;
	var imagePath = "";
	//SpsNum = imagePath.substr((imagePath.indexOf('PS') +2 ), 5);
	//alert(imagePath); 
	for (var i=0; i < imageNodeList.length; i++) {
		imagePath = imageNodeList[i].firstChild.nodeValue;
		newname = newnameNodeList[i].firstChild.nodeValue;
		//alert(imagePath + " - " + newname);
		var jqObject = readAjaxXML('convertImages', newname, imagePath)
		jqObject.done(function() {
			//alert(jqObject.responseText);
			
			//var parser = new DOMParser();
			//imageListObj = parser.parseFromString(jqObject.responseText, "text/xml");
		})
	}
	alert('DONE');
}
