async function moveParagraph(where, paraIndex) {
	let paragraphsNodeList = getProcSpec().content.paragraph;

	let index = paragraphsNodeList.findIndex(p => p['@para_index'] == paraIndex);

	let el = paragraphsNodeList[index];
	//const newIndex = where == 'down' ? index + 1 : index - 1;
	if (where == 'down' && index !== -1 && paragraphsNodeList.length - 1) {
		paragraphsNodeList[index] = paragraphsNodeList[index + 1];
		paragraphsNodeList[index + 1] = el;
		console.log(paragraphsNodeList)
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
	let theContent = getProcSpec().content;
	var paraIndex = getRemoveParIndexId();
	for (var j = 0; j < paragraphsNodeList.length; j++) {
		if (paragraphsNodeList[j]['@para_index'] == paraIndex) {
			paragraphsNodeList[j]['@state'] = 'passive';
		}
	}
	viewParagraphs();
	let contentResult = await convertObjToXml(theContent);
	await dataAccess.savePSContent(docNum(), contentResult)
	checkDocNode();
}

function getParagraphTemplate() {
	return appContext.model.readParagraphTemplate["exist:result"].content;
}
function getPsTemplate() {
	return appContext.model.readPsTemplate["exist:result"].process_specification
}

function createParagraph(where, para_index) {
	let paragraphsNodeList = getProcSpec().content.paragraph;

	paragraphNode = getParagraphTemplate().paragraph;
	let arr = [];

	var timestamp = getTimestamp();
	let returnTimeTostr = timestamp.toString();
	paragraphNode['@para_index'] = returnTimeTostr;

	revisionNode = getParagraphTemplate().paragraph.revision;
	timestamp = 1 + getTimestamp();
	revisionNode['@rev_index'] = returnTimeTostr;

	let copyParagraphNode = { ...paragraphNode };
	copyParagraphNode.revision['@rev_index'] = returnTimeTostr

	arr.push(copyParagraphNode.revision)
	copyParagraphNode.revision = arr;

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

// async function saveUpdatedPsInfo() {
// 	/* Save the info node of the document */
// 	// 	readPS();
// 	let infoNode = getProcSpec().info;
// 	let contentResult = await convertObjToXml(infoNode);
// 	await dataAccess.savePsInfo(docNum(), contentResult);
// 	viewParagraphs();
// }
// async function saveUpdatedPsInfo1() {
// 	/* Save the info node of the document */
// 	// 	readPS();
// 	let docNum = getProcSpec().biblioid.docnum;
// 	let infoNode = getProcSpec().info;
// 	let contentResult = await convertObjToXmlInfo(infoNode);
// 	await dataAccess.savePsInfo(docNum, contentResult);
// 	//viewParagraphs();
// }
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
	//var author = revisionNode.getAttribute("author");???????
	for (var i = 0; i < revisionNode["para"].length; i++) {
		let docLanguages = getLanguage();

		var paraNode = revisionNode["para"];
		var thelanguage = paraNode[i]["@language"];
		//	console.log(thelanguage);
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
		var newContent = paraNode[i]['text'];

		var newHeading = paraNode[i]['heading'];


		/*Find the paragraph with the right index in the DOM document (the html page)*/
		/* First update text content */

		var divParagraph = document.getElementById(paraid);
		var domNodeId = "text_" + thelanguage;
		var blockqoutes = divParagraph.getElementsByTagName("blockquote");
		var para_author = document.getElementById("para_author_" + para_index + "_" + thelanguage);
		//alert(para_author.innerHTML);
		//alert(blockqoutes.length);
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
	//revisionTableBody(para_index);
	var tablebody = revisionTableBody(para_index, rev_index);
	//alert(tablebody);
	var revTableId = `revisionTableBody_ ${para_index}`;
	document.getElementById(revTableId).innerHTML = tablebody;
}


async function saveDraft(para_index, language, langstate) {
	let paragraphsNodeList = getProcSpec().content.paragraph;
	let userIndex = getProcSpec().info.author;
    let docauthor = (userIndex == '') ? '' : getUserFullname(userIndex);
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
							else {paraNodeList[i]['text'] = encodeXml(newText);}

							var newHeading = document.getElementById('newparaheading_' + language).value;
							if (paraNodeList[i]['heading'] != '') {
								paraNodeList[i]['heading'] = encodeXml(newHeading);
							}
							else {paraNodeList[i]['heading'] = encodeXml(newHeading);}

							if (langstate == 'main') {
								paraNodeList[i]["@author"] = userIndex;
							}
							else {paraNodeList[i]["@translator"] = userIndex;}

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
				console.log(revisionsNodeList[j]['@state'])
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

async function saveDocProperties(isNewDoc) {
	$('#docpropertiesModal').modal('hide');
	// ** Get document properties from inputs ** 
	var docstate = readRadioChecked('docstateRadioBtn');
	var exrestrict = readRadioChecked('exRadioBtn');
	var mainlang = readRadioChecked('mainLangRadioBtn');
	var pstype = readRadioChecked('psTypeRadioBtn');
	var docTitle = document.getElementById('titleInput').value;
	var docSubTitle = document.getElementById('subTitleInput').value;
	var sublangArray = readCheckboxChecked('subLangChkBtn');
	var sublang = sublangArray.join("-");
	// ** Save new properties to document **
	var nodeInfo = getProcSpec().info;
	console.log(nodeInfo)

	nodeInfo.document_state = docstate
	
	nodeInfo.ex = exrestrict;

	nodeInfo.title = docTitle;
	console.log(nodeInfo.title)

	nodeInfo.subtitle = docSubTitle;
	console.log(nodeInfo.subtitle);

	nodeInfo.languages['@main'] = mainlang;
	nodeInfo.languages['@sub'] = sublang;
	if (isNewDoc == 'true') {
		nodeInfo.author = userIndex;
		await saveNewPS();

	}
	else {
		
		let docNum = getProcSpec().biblioid.docnum;
		let contentResult = await convertObjToXmlInfoForChangeProp(nodeInfo);
		console.log(contentResult)
		await dataAccess.savePSInfoTest(docNum, contentResult);

	}
	viewParagraphs();
}

async function saveNewPS() {
	/* Save the new document */
	let theContent = appContext.model.document;
	delete appContext.model.document['exist:result'].process_specification.biblioid["#comment"];
	let contentResult = await convertObjToXmlInfo(theContent);
	await dataAccess.saveNewPS(contentResult);

	// check if this function importatnt	updateOwnerModule(docnum);

}
function updateOwnerModule(docnum) {
	var jqObject = readAjaxXML("updateOwnerModule", docnum, callerModuleNum);
	jqObject.done(function() {
		//alert(jqObject.responseText);
		window.location = "pspec.php?docnum=" + docnum;
	})
}
