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
    return xml
        .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
        .replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/\t/g, '&#x9;').replace(/\n/g, '&#xA;').replace(/\r/g, '&#xD;');
}
function encodeXml2(xml) {
    return (xml
        .replace('&amp;', '&').replace('&quot;', '"').replace('&apos;', '/')
        .replace('&lt;', '<').replace('&gt;', '>')
        .replace('&#x9;', 't').replace('&#xA;', 'n').replace('&#xD;', 'r')
    );
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
function getTimestamp() {
    var dateObj = new Date();
    var timestamp = dateObj.getTime();
    return timestamp;
}
function getLanguageString(language) {
    var languagesNameArray = { en: 'English', no: 'Norwegian', lt: 'Lithuanian' };
    switch (language) {
        case 'no':
            langTag = languagesNameArray.no;
            break;
        case 'lt':
            langTag = languagesNameArray.lt;
            break;
        default:
            langTag = languagesNameArray.en;
    }
    return langTag;
}
function GetToolTip() {
    $(document).ready(function () {
        $("body").tooltip({ selector: '[data-toggle=tooltip]' });
    });
}
function workingGalleryHTML(workRevision) {
    var galleryTableCols = 2;
    var j = 0;

    if (workRevision == null || workRevision == '') {
        workRevision = {}
        workRevision.image = [];

    }

    let result = `<div id='workingGallery'>
    <table border='1' frame='void' rules='all' > 
    <tr><td  id='dropZoneContainer'class='galleryEditorImageContainer'><div id='dropZoneDiv'onclick='addImage();' class='paraimageEdit uploadDropZone'>Add image file</div></td>`;
    imageNodeList = workRevision.image;
    imageNodeList = checkIfNotArrayMakeArray(imageNodeList)
    while (j < imageNodeList.length) {
        let imageNode = imageNodeList[j];
        // imageFilename = imageNode.firstChild.nodeValue;
        if (j % galleryTableCols == 0) {
            result += "<tr>";
        }

        let imagerepo1 = `http://trondoc.jotron.inet/ps_images/${imageNode}`;
        result += `<td  class='galleryEditorImageContainer'>
       <img ondragstart='dragStartImageEditor(event)' ondragover='imageEditorAllowDrop(event)' ondrop='dropImageEditor(event)'  draggable='true'  title='${imageTitleRoot(j)}' 
        id='ImgIndex:${j}' src='${imagerepo1}'  alt='' class='paraimageEdit' />
       <span class='galleryEditorControls'>
       <button title='Delete image'  onClick='removeImage(imageNodeList[${j}])' type='button' class='btn btn-danger btn-xs'>
       <span class='glyphicon glyphicon-trash' aria-hidden='true'></span></button>
       <button title='Replace image' onClick='replaceImage(imageNodeList[${j}]);' type='button' class='btn btn-primary btn-xs'>
       <span class='glyphicon glyphicon-import' aria-hidden='true'></span></button>
       </span>
       </td>`;
        j++;
        if (j % galleryTableCols == 0) {
            result += "</tr>";
        }
    }
    result += `</table></div>`;
    return result;
}

function checkIfNotArrayMakeArray(ElemetnToCheck) {
    if (!Array.isArray(ElemetnToCheck)) {
        let arr = [];
        arr.push(ElemetnToCheck);
        ElemetnToCheck = arr;
    }
    return ElemetnToCheck;
}
function chceckNullValue(val){
    if(val == null){
        val = ''
    }
    return val
    }
