function zeroPad(num, places) {
    // Copy from internet (http://stackoverflow.com/questions/2998784/how-to-output-integers-with-leading-zeros-in-javascript). Seems to work...
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}
function dateFormat(seconds) {
    /* Converts time in seconds to a formated string */
    var dateString = '';
    if (!isNaN(seconds)) {
        var dateObj = new Date(seconds);
        dateString = dateObj.getFullYear() + "-" + zeroPad((dateObj.getMonth() + 1), 2) + "-" + zeroPad(dateObj.getDate(), 2);
    }
    return dateString;
}
function encodHtml(encodedStr) {
    let parser = new DOMParser;
    let dom = parser.parseFromString(
        '<!doctype html><body>' + encodedStr,
        'text/html');
    let decodedString = dom.body.textContent;
    return decodedString
    //console.log(decodedString);
}

function encodeXml(xml) {
    return (xml
        .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
        .replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/\t/g, '&#x9;').replace(/\n/g, '&#xA;').replace(/\r/g, '&#xD;')
    );
}
function encodeXml2(xml) {
    return (xml
        .replace('&amp;', '&' ).replace( '&quot;', '"').replace('&apos;', '/')
        .replace('&lt;' , '<' ).replace('&gt;', '>')
        .replace( '&#x9;', 't').replace('&#xA;' , 'n').replace('&#xD;' ,'r')
    );
}
 function objectFromXmlText (xmlText) {
    let dom = parseXml(xmlText);
    let json = xml2json(dom).replace('undefined', '');
    return JSON.parse(json);
}
function parseXml(xml) {
    var dom = null;
    if (window.DOMParser) {
        try {
            dom = (new DOMParser()).parseFromString(xml, "text/xml");
        }
        catch (e) { dom = null; }
    }
    else if (window.ActiveXObject) {
        try {
            dom = new ActiveXObject('Microsoft.XMLDOM');
            dom.async = false;
            if (!dom.loadXML(xml)) // parse error ..

                window.alert(dom.parseError.reason + dom.parseError.srcText);
        }
        catch (e) { dom = null; }
    }
    else
        alert("cannot parse xml string!");
    return dom;
}
 function jsonObjToXmlTest(obj) {
     let jsonText = JSON.stringify(obj);
	return  json2xml(jsonText);
	
	
      
}

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
function imageTitleRoot(index) {
    var imageDesignatorTxt = "Fig. ";
    var imageIndexLength = 3;
    index++;
    return imageDesignatorTxt + Array(Math.max(imageIndexLength - String(index).length + 1, 0)).join(0) + index + " ";
}
function getUserFullname(index) {

    let getUser = getUserFName().userfullname;
    for (var z = 0; z < getUser.length; z++) {
        if (getUser[z]["@index"] == index) {
            return getUser[z];
        }
    }
}


function canApproveParagraph() {
    let readData = appContext.model.readData;
    let boolAuth = false;
    // Checking doc state
    try {
        let nodeInfo = readData.procSpec.info;
        let exNodeValue = nodeInfo.ex;
        var isExDoc = (exNodeValue == 'true') ? true : false;
    }
    catch (e) { var isExDoc = false; }
    // Checking user authority
    var canApproveValue = "<?php echo UserState::CanApprovePS(); ?>";
    var canApprove = canApproveValue ? true : false;
    var canApproveExValue = "<?php echo UserState::CanApproveExPS(); ?>";
    var canApproveEx = canApproveExValue ? true : false;
    // Evaluate user privileges
    if (isExDoc) { boolAuth = canApproveEx; }
    else { boolAuth = canApprove; };
    return boolAuth;
}
function canEditParagraph() {
    let readData = appContext.model.readData;
    let boolAuth = false;
    // Checking doc state
    try {
        let nodeInfo = readData.procSpec.info;
        let exNodeValue = nodeInfo.ex;
        var isExDoc = (exNodeValue == 'true') ? true : false;
    }
    catch (e) { var isExDoc = false; }
    // Checking user authority
    let canEditValue = "<?php echo UserState::CanEditPS(); ?>";
    let canEdit = canEditValue ? true : false;
    let canEditExValue = "<?php echo UserState::CanEditExPS(); ?>";
    let canEditEx = canEditExValue ? true : false;
    // Evaluate user privileges
    if (isExDoc) { boolAuth = canEditEx; }
    else { boolAuth = canEdit; };
    return boolAuth;
}

function getProcSpec() {
    return appContext.model.document['exist:result'].process_specification;
}

function getUserFName() {
    const userName = appContext.model.userName;
    return userName["exist:result"].users;
}


function checkDocNode() {
	var documentsNode = document.getElementById('paragraphs');
	if (!documentsNode.hasChildNodes()) {
		document.getElementById('paragraph_new_button').style.display = "";
	}
}
function getRemoveParIndexId() {
	return document.getElementById('remove_para_index').innerHTML;
}
function getTimestamp () {
	var dateObj = new Date();
	var timestamp = dateObj.getTime();
	return timestamp;
}