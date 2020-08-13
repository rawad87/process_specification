async function moveParagraph(where, paraIndex) {
	let paragraphsNodeList = getProcSpec().content.paragraph;
	let theContent = getProcSpec().content;
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

	let contentResult = await convertObjToXml(theContent);
	await dataAccess.savePSContent(docNum(), contentResult)
	updateViewProcessSpecification();
}

async function convertObjToXml(theContent) {
	let xmlDOM = await appContext.services.dataAccess.jsonObjToXml(theContent);
	let encode = encodeXml(xmlDOM);
	let contentResult = decodeHtml(`<content>${encode}</content>`);
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

	arr.push(paragraphNode.revision);
	paragraphNode.revision = arr;

	for (let i = 0; i < paragraphsNodeList.length; i++) {
		if (paragraphsNodeList[i]['@para_index'] == para_index) {
			if (where == 'after') {
				paragraphsNodeList.splice(i + 1, 0, paragraphNode);

				//console.log(JSON.stringify( paragraphNode));

			}
			if (where == 'before') {
				paragraphsNodeList.splice(i - 0, 0, paragraphNode)
				//console.log(JSON.stringify( paragraphNode));
			}
			break;
		}
	}
	updateViewProcessSpecification();
	document.getElementById('paragraph_new_button').style.display = "none";

}


// let newObj = {
	// 	importedParagraphNode : getPsTemplate().content
	// }
	// Object.assign(newObj, paragraphNode);
	// // console.log(newObj);
	// const theNewObj = Object.assign({},newObj);
	// console.log(theNewObj);
	// console.log(importedParagraphNode);
	// for (var i = 0; i < paragraphsNodeList.length; i++) {
	// 	if (paragraphsNodeList[i]['@para_index'] == para_index) {
	// 		console.log(paragraphsNodeList[i]['@para_index'] , para_index)
	// 		var content = getProcSpec().content;

	// 		if (where == 'before') {
	// 			console.log('before');
	// 			paragraphsNodeList[i - importedParagraphNode];
	// 			console.log(paragraphsNodeList);
	// 		}
	// 		if (where == 'after') {

	// 			paragraphsNodeList[i + importedParagraphNode];

	// 		}
	// 		break;
	// 	}
	// }
	//alert(xml_to_string(content));