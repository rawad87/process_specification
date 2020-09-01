
async function moveParagraph(where, paraIndex) {
	let paragraphsNodeList = getProcSpec().content.paragraph;

	let index = paragraphsNodeList.findIndex(p => p['@para_index'] == paraIndex);

	let el = paragraphsNodeList[index];
	//const newIndex = where == 'down' ? index + 1 : index - 1;
	if (where == 'down' && index !== -1 && paragraphsNodeList.length - 1) {
		paragraphsNodeList[index] = paragraphsNodeList[index + 1];
		paragraphsNodeList[index + 1] = el;
	}
	if (where == 'up' && index > 0) {
		paragraphsNodeList[index] = paragraphsNodeList[index - 1];
		paragraphsNodeList[index - 1] = el;
	}
	await convertDataAndSendToDataBase();
	updateViewProcessSpecification();
}

async function convertDataAndSendToDataBase() {
	let theContent = getProcSpec().content;
	let contentResult = await convertObjToXml(theContent);
	await dataAccess.savePSContent(docNum(), contentResult);
}

async function convertObjToXml(theContent) {
	let xmlDOM = await appContext.services.dataAccess.jsonObjToXml(theContent);
	let encode = encodeXml(xmlDOM);
	let contentResult = decodeHtml(`<content>${encode}</content>`);
	return contentResult;
}
async function convertObjToXmlInfo(theContent) {
	let xmlDOM = await appContext.services.dataAccess.jsonObjToXml(theContent);
	let encode = encodeXml(xmlDOM);
	let contentResult = decodeHtml(encode);
	return contentResult;
}
async function convertObjToXmlInfoForChangeProp(theContent) {
	let xmlDOM = await appContext.services.dataAccess.jsonObjToXml(theContent);
	let encode = encodeXml(xmlDOM);
	let contentResult = decodeHtml(`<info>${encode}</info>`);
	return contentResult;
}

function docNum() {
	return getProcSpec().biblioid.docnum;
}

function getContent() {
	return getProcSpec().content;
}

async function removeParagraph() {
	$('#confirmRemoveModal').modal('hide');
	let paragraphsNodeList = getProcSpec().content.paragraph;
	var paraIndex = getRemoveParIndexId();
	for (var j = 0; j < paragraphsNodeList.length; j++) {
		if (paragraphsNodeList[j]['@para_index'] == paraIndex) {
			paragraphsNodeList[j]['@state'] = 'passive';
		}
	}
	viewParagraphs();
	await convertDataAndSendToDataBase();
	checkDocNode();
}

function getParagraphTemplate() {
	return appContext.model.readParagraphTemplate["exist:result"].content;
}
function getPsTemplate() {
	return appContext.model.readPsTemp["exist:result"].process_specification;
}

function createParagraph(where, para_index) {
	let paragraphsNodeList = getProcSpec().content.paragraph;

	paragraphNode = getParagraphTemplate().paragraph;

	var timestamp = getTimestamp();
	let returnTimeTostr = timestamp.toString();
	paragraphNode['@para_index'] = returnTimeTostr;

	revisionNode = getParagraphTemplate().paragraph.revision;
	timestamp = 1 + getTimestamp();
	revisionNode['@rev_index'] = returnTimeTostr;

	let copyParagraphNode = { ...paragraphNode };
	copyParagraphNode.revision = checkIfNotArrayMakeArray(copyParagraphNode.revision)
	copyParagraphNode.revision['@rev_index'] = returnTimeTostr

	for (let i = 0; i < paragraphsNodeList.length; i++) {

		if (paragraphsNodeList[i]['@para_index'] == para_index) {
			if (where == 'after') {
				paragraphsNodeList.splice(i + 1, 0, copyParagraphNode);
			}
			if (where == 'before') {
				paragraphsNodeList.splice(i - 0, 0, copyParagraphNode)
			}
			break;
		}
	}
	updateViewProcessSpecification();
	document.getElementById('paragraph_new_button').style.display = "none";

}
function approveParagraph(para_index) {
	var displayApprBtn = canApproveParagraph() ? "" : "none";
	document.getElementById("paraApprovalBtn").style.display = displayApprBtn;
	document.getElementById('approval_para_index').innerHTML = para_index;
	$('#revisionsModal').modal('show');
}
async function approvalConfirmed() {
	let paragraphsNodeList = getProcSpec().content.paragraph;
	$('#revisionsModal').modal('hide');
	var para_index = document.getElementById('approval_para_index').innerHTML;
	var changelog = document.getElementById('approval_changelog').value;
	var rev_index = "";

	for (var j = 0; j < paragraphsNodeList.length; j++) {
		/* Findinf the paragraph in node list */
		if (paragraphsNodeList[j]['@para_index'] == para_index) {
			revisionsNodeList = paragraphsNodeList[j]['revision'];
			//console.log(revisionsNodeList)
			var draftNodeIndex = '0';
			var approvedNodeIndex = '0';
			/* Finding the revisions for 'draft' and 'approved' */
			for (var r = 0; r < revisionsNodeList.length; r++) {
				if (revisionsNodeList[r]['@state'] == 'draft') { draftNodeIndex = r; }
				if (revisionsNodeList[r]['@state'] == 'approved') { approvedNodeIndex = r; }
			}
			/* Updating nodes */
			revisionsNodeList[approvedNodeIndex]['@state'] = 'deprecated';
			revisionsNodeList[draftNodeIndex]['@state'] = 'approved';

			rev_index = revisionsNodeList[draftNodeIndex]['@rev_index'];
			var dateObj = new Date();
			revisionsNodeList[draftNodeIndex]['@approval_time'] = dateObj.getTime();
			revisionsNodeList[draftNodeIndex]['@approver'] = userIndex;
			revisionsNodeList[draftNodeIndex].changelog = changelog;

			var nodeInfo = getProcSpec().info;
			if (nodeInfo.document_edition != null) {
				nodeInfo.document_edition = parseInt(nodeInfo.document_edition) + 1
			}
			if (nodeInfo.document_edition == null) {
				nodeInfo.document_edition = '1';
			}

		}
	}
	updateParagraph(para_index, rev_index);
	saveUpdatedPsContent();
	saveAndSendPsInfo(nodeInfo);
	viewParagraphs();
}
async function saveAndSendPsInfo(nodeInfo) {
	let docNum = getProcSpec().biblioid.docnum;
	let contentResult = await convertObjToXmlInfoForChangeProp(nodeInfo);
	await dataAccess.savePSInfoTest(docNum, contentResult);
}

async function saveUpdatedPsContent() {
	await convertDataAndSendToDataBase();

}

function updateParagraph(para_index, rev_index) {
	/* Changing content of paragraph on screen */
	let paragraphsNodeList = getProcSpec().content.paragraph;

	paraid = "paraindex_" + para_index;
	parimages = "paraimages_" + para_index;   /* for identifying gallery target on the HTML rendition */
	var j;
	for (j = 0; j < paragraphsNodeList.length; j++) {
		if (paragraphsNodeList[j]['@para_index'] == para_index) {
			break;
		}
	}

	revisionsNodeList = paragraphsNodeList[j]['revision'];
	var r;
	for (r = 0; r < revisionsNodeList.length; r++) {
		if (revisionsNodeList[r]['@rev_index'] == rev_index) {
			break;
		}
	}
	var revisionNode = revisionsNodeList[r];
	for (var i = 0; i < revisionNode["para"].length; i++) {
		let docLanguages = getLanguage();

		var paraNode = revisionNode["para"];
		var thelanguage = paraNode[i]["@language"];
		getName(thelanguage, docLanguages, paraNode, i);
		var newContent = paraNode[i]['text'];
		var newHeading = paraNode[i]['heading'];

		var divParagraph = document.getElementById(paraid);
		finParagraph(thelanguage, newContent, para_index, divParagraph)
		/* update the gallery */
		var galleryNode = document.getElementById(parimages);
		galleryNode.innerHTML = galleryHTML(revisionNode);
		/* Then update the heading */
		domNodeId = "heading_" + thelanguage;
		var p = divParagraph.getElementsByTagName("p");
		for (var j = 0; j < p.length; j++) {
			if (p[j]['@id'] == domNodeId) {
				p[j].innerHTML = newHeading;
				break;
			}
		}
	}
	var tablebody = revisionTableBody(para_index, rev_index);
	var revTableId = `revisionTableBody_ ${para_index}`;
	document.getElementById(revTableId).innerHTML = tablebody;
}

function getName(thelanguage, docLanguages, paraNode, i) {
	if (thelanguage == docLanguages[0]) {
		var newAuthor = paraNode[i]["@author"];
		newAuthor = isNumber(newAuthor) ? getUserFullname(newAuthor) : newAuthor;
		newAuthor = "Author: " + newAuthor;
	}
	else {
		var newAuthor = paraNode[i]["@translator"];
		newAuthor = isNumber(newAuthor) ? getUserFullname(newAuthor) : newAuthor;
		newAuthor = "Translator: " + newAuthor;
	}
}

function finParagraph(thelanguage, newContent, para_index, divParagraph) {

	/*Find the paragraph with the right index in the DOM document (the html page)*/
	/* First update text content */

	var domNodeId = "text_" + thelanguage;
	var blockqoutes = divParagraph.getElementsByTagName("blockquote");
	var para_author = document.getElementById("para_author_" + para_index + "_" + thelanguage);
	for (var j = 0; j < blockqoutes.length; j++) {
		if (blockqoutes[j]['@id'] == domNodeId) {
			para_author.innerHTML = newAuthor;
			blockqoutes[j].innerHTML = newContent;
			if (revisionNode["@state"] == 'draft') {
				blockqoutes[j].style.backgroundImage = "url(./graphics/draft_mode.png)";
				blockqoutes[j].style.backgroundRepeat = "no-repeat";
				blockqoutes[j].style.backgroundPosition = "50% 50%";
			}
			else if (revisionNode["@state"] == 'deprecated') {
				blockqoutes[j].style.backgroundImage = "url(./graphics/deprecated_mode.png)";
				blockqoutes[j].style.backgroundRepeat = "no-repeat";
				blockqoutes[j].style.backgroundPosition = "50% 50%";
			}
			else {
				blockqoutes[j].style.backgroundImage = "";
				blockqoutes[j].style.backgroundRepeat = "";
				blockqoutes[j].style.backgroundPosition = "";
			}
			break;
		}
	}
}

async function saveDraft(para_index, language, langstate) {
	let paragraphsNodeList = getProcSpec().content.paragraph;

	/* Save changes from the editor to node list */
	for (var i = 0; i < paragraphsNodeList.length; i++) {
		/* Find the right paragraph */
		if (paragraphsNodeList[i]["@para_index"] == para_index) {
			currentParagraph = paragraphsNodeList[i];
			var revisionskNodeList = currentParagraph["revision"];
			for (var j = 0; j < revisionskNodeList.length; j++) {
				/* Find the draft revision */
				if (revisionskNodeList[j]['@state'] == 'draft') {
					var paraNodeList = revisionskNodeList[j]["para"];
					for (var i = 0; i < paraNodeList.length; i++) {
						if (paraNodeList[i]['@language'] == language) {
							language = paraNodeList[i]["@language"];
							/* Try to replace node value with new text */

							var newText = document.getElementById('paratext_' + language).innerHTML;
							// var textNode = paraNodeList[i]['text'];
							if (paraNodeList[i]['text'] != '') {
								paraNodeList[i]['text'] = encodeXml(newText);
							}
							else { paraNodeList[i]['text'] = encodeXml(newText); }

							var newHeading = document.getElementById('newparaheading_' + language).value;
							if (paraNodeList[i]['heading'] != '') {
								paraNodeList[i]['heading'] = encodeXml(newHeading);
							}
							else { paraNodeList[i]['heading'] = encodeXml(newHeading); }

							if (langstate == 'main') {
								paraNodeList[i]["@author"] = userIndex;
							}
							else { paraNodeList[i]["@translator"] = userIndex; }

						}
					}
				}

			}
			await convertDataAndSendToDataBase();
			break;
		}
	}
}
async function removeDraft(para_index) {
	let paragraphsNodeList = getProcSpec().content.paragraph;
	//alert(para_index);
	for (var i = 0; i < paragraphsNodeList.length; i++) {
		if (paragraphsNodeList[i]['@para_index'] == para_index) {
			var revisionsNodeList = paragraphsNodeList[i]['revision'];
			for (var j = 0; j < revisionsNodeList.length; j++) {
				if (revisionsNodeList[j]['@state'] == 'draft') {
					revisionsNodeList.splice(j, 1);
				}
			}
		}
	}
	await convertDataAndSendToDataBase();

	viewParagraphs();
}
async function saveAndReturn() {
	await convertDataAndSendToDataBase();
	viewParagraphs();
}
function readRadioChecked(groupname) {

	return $('input[name="' + groupname + '"]:checked').val();
}
function readCheckboxChecked(groupname) {
	var checkboxes = document.getElementsByName(groupname);
	var valuearray = [];
	for (i = 0; i < checkboxes.length; i++) {
		if (checkboxes[i].checked) {
			valuearray.push(checkboxes[i].value);
		}
	}
	return valuearray;
}

function saveDocProperties(isNewDoc) {
	$('#docpropertiesModal').modal('hide');
	// ** Get document properties from inputs ** 
	var docstate = readRadioChecked('docstateRadioBtn');
	var exrestrict = readRadioChecked('exRadioBtn');
	var mainlang = readRadioChecked('mainLangRadioBtn');
	// var pstype = readRadioChecked('psTypeRadioBtn');
	var docTitle = document.getElementById('titleInput').value;
	var docSubTitle = document.getElementById('subTitleInput').value;
	var sublangArray = readCheckboxChecked('subLangChkBtn');
	var sublang = sublangArray.join("-");
	// ** Save new properties to document **
	var nodeInfo = getProcSpec().info;
	nodeInfo.document_state = docstate
	nodeInfo.ex = exrestrict;
	nodeInfo.title = docTitle;
	nodeInfo.subtitle = docSubTitle;

	// 	nodeInfo.type = pstype;

	nodeInfo.languages['@main'] = mainlang;
	nodeInfo.languages['@sub'] = sublang;
	if (isNewDoc == 'true') {
		nodeInfo.author = userIndex;
		saveNewPS();

	}
	else {
		saveAndSendPsInfo(nodeInfo);

	}
	viewParagraphs();
}

async function saveNewPS() {
	/* Save the new document */
	let theContent = appContext.model.document;
	delete appContext.model.document['exist:result'].process_specification.biblioid["#comment"];
	let contentResult = await convertObjToXmlInfo(theContent);
	await dataAccess.saveNewPS(contentResult);

}

function replaceImage(replaceImageNode) {
    imageNodeReplaced = replaceImageNode;
    return function () { document.getElementById('replacementPictureFile').click(); }();
}
/* remove from the psdoc */
function removeImage(node) {
    let imageEditorContextworkRevision = getObjValues.imageEditorContextworkRevision
    imageEditorContextworkRevision.gallery['image'] = checkIfNotArrayMakeArray(imageEditorContextworkRevision.gallery['image'])
    for (let i = 0; i < imageEditorContextworkRevision.gallery['image'].length; i++) {

        if (imageEditorContextworkRevision.gallery['image'][i].match(node)) {
            imageEditorContextworkRevision.gallery['image'].splice(i, 1);

        }
    }
    document.getElementById('workingGallery').innerHTML = workingGalleryHTML(imageEditorContextworkRevision["gallery"]);
}
function findElements(tagName, id_part) {
	// Find an element of a kind, with a id that math a part string
	var tags = document.getElementsByTagName(tagName);
	var matches = new Array();
	// iterate over them
	for (var i = 0; tags[i]; i++) {
		if (tags[i].nodeType === 1) {
			// id start with id_part ?
			if (tags[i].id.indexOf(id_part) == 0) {
				matches.push(tags[i]);
			}
		}
	}
	return matches;
}
function visibleLanguage(btnid) {
	var all_state = getLangState(btnid);
	let languagesArray = ['en', 'no', 'lt'];
	for (let a = 0; a < languagesArray.length; a++) {
		let langArr = languagesArray[a];
		let id = `paradiv_${langArr}`
		let getId = findElements('div', id)
		for (var j = 0; j < getId.length; j++) {
			if (all_state == true) {
				getId[j].style.display = "";
			}
			else {
				getId[j].style.display = lan_states[a];
			}
		}

	}
}
function getLangState(btnid) {
	var en_state = "";
	var lt_state = "";
	var no_state = "";
	var all_state = "";
	switch (btnid) {
		case "lanbtn_en":
			en_state = "";
			lt_state = "none";
			no_state = "none";
			break;
		case "lanbtn_lt":
			en_state = "none";
			lt_state = "";
			no_state = "none";
			break;
		case "lanbtn_no":
			en_state = "none";
			lt_state = "none";
			no_state = "";
			break;
		default:
			all_state = true;
			break;
	}
	lan_states = [en_state, no_state, lt_state];
	return all_state;
}

