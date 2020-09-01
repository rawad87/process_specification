


function updateViewProcessSpecification() {
    console.log('new version')
    const procSpec = getProcSpec();
    const dateString = dateFormat(parseInt(procSpec.info.last_updated));
    let docnum = procSpec.biblioid.docnum;
    let exNodeValue = procSpec.info.ex;
    let exDoc = (exNodeValue == 'true') ? "EX document" : "Standard PS";

    let typeNodeValue = procSpec.info.type;
    let type = (typeNodeValue.toLowerCase() == 'assembly') ? "Assembly" : "Test";
    let userIndex = procSpec.info.author;
    let docauthor = (userIndex == '') ? '' : getUserFullname(userIndex);
    var langValue = '';
    GetToolTip();
    var lan_states = ["", "", ""];
    let languagesArray = ['en', 'no', 'lt'];
    for (var i = 0; i < lan_states.length; i++) {
        langValue = langValue + ((lan_states[i] == "") ? '-' + languagesArray[i] : '');
    };
    document.getElementById('app').innerHTML = `
    <div class="panel panel-primary" style="margin-bottom: 10px; ">
    <div class="panel-heading" id="panel-heading" style="font-size: 20px; font-weight: bold">Process Specification : ${docnum}</div>

    <table class="table table-condensed">
        <tr>
            <th>Document Edition:</th>
            <th>Document State:</th>
            <th>Creator:</th>
            <th>Last Change Date:</th>
            <th>Document Type:</th>
            <th>PS Type:</th>
            <th></th>
            <th></th>
        </tr><tr>
            <td>${procSpec.info.document_edition}</td>
            <td>${procSpec.info.document_state}</td>
            <td>${docauthor["#text"]}</td>
            <td>${dateString}</td>
            <td>${exDoc}</td>
            <td>${type}</td>
            <td><a onclick="viewDocProperties('false')"><span class="glyphicon glyphicon-list-alt" style="cursor:pointer"data-toggle="tooltip" title="Document Properties" aria-hidden="true"></span></a></td>
            <td id="psPrintLink"><a href="pspec_print.php?psnum=${docnum}&languages= ${langValue}"  target="_blank" data-toggle="tooltip" title="Print">
            <span class='glyphicon glyphicon-print' style='cursor:pointer' aria-hidden='true'></span></a></td>
        </tr></table>
    </div>
    
    <h3>${chceckNullValue(procSpec.info.title)}</h3>
    <h4>${chceckNullValue( procSpec.info.subtitle)}</h4>
    ${flags()}  
    ${documentProperties()} 
    ${modalConfirmRemovePara()} 
    ${modelApprovalParagraph()} `;
    viewParagraphs()
}


function flags() {
    return `
    <div id="draftImg" style="display: none"><img src="./graphics/draft_mode_horizontical.png" alt="Draft" height="60" style="margin: 0px 0px 10px 30%"> </div>
    <div class="btn-group" role="group" id="languageSelectors">
    <button type="button" class="btn btn-default" id="lanbtn_en" onclick="visibleLanguage(this.id)">
          <img src="../include/graphics/flag_england.png" alt="English language" style="height: 18px;"/>
    </button>
    <button type="button" class="btn btn-default"  id="lanbtn_no" onclick="visibleLanguage(this.id)">
        <img src="../include/graphics/flag_norway.png" alt="Norwegian language" style="height: 18px"/>
    </button>
    <button type="button" class="btn btn-default"  id="lanbtn_lt" onclick="visibleLanguage(this.id)">
        <img src="../include/graphics/flag_lithuania.png" alt="Lithuanian language" style="height: 18px"/>
    </button>
    <button type="button" class="btn btn-default"  id="lanbtn_all" onclick="visibleLanguage(this.id)">
        <span class="glyphicon glyphicon-th-list" aria-hidden="true"></span> <strong>All</strong> langauges
    </button>
    </div>
    <div id="paragraph_new_button" style="float: right;display: none;">
          <a href="#" class="btb btn-default" onclick="createParagraph ('', 0)">
              <span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span> Add Paramgraph
          </a>
    </div>
    <div id="paragraphs"  style="margin-top: -20px; ">
				<!-- All paragraphs HTML goes here -->
			</div>
			<br />
			<div id="editor">
				<!-- The editor goes here -->
			</div>
            <!-- File upload support multiple files selectable for additions-->
             <div style='height: 0px;width: 0px; overflow:hidden;'>
               <input id="pictureFile" type="file" value="upload" multiple/>
             </div>
             
            <!-- File upload support single file for replacement of an existing image-->
             <div style='height: 0px;width: 0px; overflow:hidden;'>
               <input id="replacementPictureFile" type="file" value="upload"/>
             </div>
            `;
}
function getLanguage() {

    let mainlang = getProcSpec().info.languages["@main"];
    let docLanguages = [mainlang];
    let sublangstring = getProcSpec().info.languages["@sub"];
    if (sublangstring != '') {
        var sublangArr = sublangstring.split("-");
        docLanguages = [...docLanguages, ...sublangArr];

    }
    return docLanguages;
}

function viewParagraphs() {
    let contentHTML = '';

    let paragraphsNodeList = getProcSpec().content.paragraph.filter(p => p["@state"] == 'active');

    for (let i = 0; i < paragraphsNodeList.length; i++) {

        if (paragraphsNodeList[i].revision == undefined || paragraphsNodeList[i].revision == '') {
            paragraphsNodeList.splice(i, 1)
        }
        contentHTML += createHtmlForOneParagraph(i, paragraphsNodeList);
    }

    document.getElementById('paragraphs').innerHTML = contentHTML;
    document.getElementById('paragraphs').style.display = "";
    document.getElementById('editor').style.display = "none";
}

function makeArrayIfElementNotArray() {
    if (!Array.isArray(getProcSpec().content.paragraph)) {
        let arr = [];
        arr.push(getProcSpec().content.paragraph);
        getProcSpec().content.paragraph = arr;
    }
}

function createHtmlForOneParagraph(i, paragraphsNodeList) {
    let viewParaNum = i + 1;
    let para_index = paragraphsNodeList[i]["@para_index"];
    if (!Array.isArray(paragraphsNodeList[i].revision)) {
        let arr = [];
        arr.push(paragraphsNodeList[i].revision);
        paragraphsNodeList[i].revision = arr;
    }
    let revisionsNodeList = paragraphsNodeList[i].revision;
    let currentParagraph = getLastApprovedParagraph(revisionsNodeList);

    //getLastApprovedParagraph(revisionsNodeList);
    let rev_index = currentParagraph["@rev_index"];

    let revisionRows = revisionTableBody(para_index, rev_index);
    let paraNodeList = currentParagraph.para;
    getTexts(paraNodeList, para_index, currentParagraph);
    let imageHtml = galleryHTML(currentParagraph);
    completeImageHtml = "<div id='paraimages_" + para_index + "' class='paraimages'>" + imageHtml + "</div>";
    let disabledMoveParUp = (i == 0) ? "class='disabled'" : "";
    let disabledMoveParDown = (i == (paragraphsNodeList.length - 1)) ? "class='disabled'" : "";
    paragrahpNum = `<a  id='paraindex_${para_index}' class='paragraphnum' onclick='viewParaEditionsTable(${para_index})' >Paragraph ${viewParaNum} </a>`;
    let disabledApprove = (canApproveParagraph() == true) ? "" : "class='disabled'";
    let disabledRemove = (canApproveParagraph() == true) ? "" : "disabled='disabled'";
    let editBtns = editButtons(para_index, disabledApprove, disabledMoveParUp, disabledMoveParDown, disabledRemove);
    let editionsTable = editBtnsFun(para_index, revisionRows, editBtns);
    return `<div class='paragraph' id='paraindex_${para_index}'>${paragrahpNum} 
                <div class='row'></div>${editionsTable} ${textHtml} ${completeImageHtml} </div>`;
}

function getLastApprovedParagraph(revisionsNodeList) {
    let approvedNodeIndex = '0';
    let currentParagraph = '';

    if (!Array.isArray(revisionsNodeList)) {
        if (revisionsNodeList["@state"] == 'approved') {
            currentParagraph = revisionsNodeList
        }
        return currentParagraph;
    }
    for (let r = 0; r < revisionsNodeList.length; r++) {

        if (revisionsNodeList[r]["@state"] == 'approved') {
            approvedNodeIndex = r;
        }
        currentParagraph = revisionsNodeList[approvedNodeIndex];
    }
    return currentParagraph
}

function getTexts(paraNodeList, para_index, currentParagraph) {
    textHtml = "";
    let docLanguages = getLanguage();

    for (let j = 0; j < docLanguages.length; j++) {
        let backgroundTranslMissing = "";
        let backgroundImage = "";
        let paranum = 0;

        paraNodeList.forEach((paraNodeList, x) => paraNodeList["@language"] == docLanguages[j] ? paranum = x : '');


        let language = paraNodeList[paranum]["@language"];
        if (j == 0) {
            let textauthor = paraNodeList[paranum]["@author"];

            textauthor = isNumber(textauthor) ? getUserFullname(textauthor) : textauthor;

            var editedBy = `- <code id='para_author_${para_index} _ ${language}'>Author: ${textauthor["#text"]}  </code>`;
            if (textauthor == '') editedBy = `- <code id='para_author_${para_index} _ ${language}'>Author:   </code>`;
            revDraftMode = "background-image: url(\"./graphics/draft_mode.png\"); background-repeat:no-repeat; background-position:10% 50%;";
            backgroundImage = (currentParagraph["@state"] != "draft") ? "" : revDraftMode;
        }
        else {
            var texttranslator = paraNodeList[paranum]["@translator"];
            texttranslator = isNumber(texttranslator) ? getUserFullname(texttranslator) : texttranslator;
            var editedBy = `- <code id='para_author_${para_index} _ ${language}'>Translator: ${texttranslator["#text"]}</code>`;
            if (texttranslator == '') editedBy = `- <code id='para_author_${para_index} _ ${language}'>Translator: </code>`;
            backgroundTranslMissing = "background-image: url(\"./graphics/translation_needed.png\"); background-repeat:no-repeat; background-position:10% 50%;";
            backgroundImage = (paraNodeList[paranum]["@translator"] != "") ? "" : backgroundTranslMissing;
        }

        let paraheading = paraNodeList[paranum]["heading"] ? paraNodeList[paranum]["heading"] : '-';
        let paratext = paraNodeList[paranum]["text"] ? paraNodeList[paranum]["text"] : '';
        textHtml += textHtmlPar(language, para_index, paraheading, editedBy, backgroundImage, paratext);

    }
}
function textHtmlPar(language, para_index, paraheading, editedBy, backgroundImage, paratext) {
    return `
    <div class='paradiv' id='paradiv_${language} ${para_index}' >
     <div  class='paralangindicator'> ${language} </div>
     <p class='paraheading' id='heading_${language}'> ${paraheading} </p>  ${editedBy}
     <div  class='paratext'>
     <blockquote id='text_${language}' style='${backgroundImage}'>
     ${encodHtml(paratext)}
     </blockquote>
     </div>
     </div> `;

}
function editBtnsFun(para_index, revisionRows, editBtns) {
    return `
    <div class='row'>
    <div class='col-md-9'><table class='table table-condensed table-bordered' id='revisionTable_${para_index}' style='margin-left:20px;background:white;display:none;'>
    <thead><tr><th>Paragraph State</th><th>Date issued</th><th>Change Log</th><th>Approved By</th></tr></thead>
    <tbody id='revisionTableBody_ ${para_index}'>${revisionRows} </tbody>
    </table></div>
    <div class='col-md-3'>${editBtns}</div>
    </div>`;
}
function editButtons(para_index, disabledApprove, disabledMoveParUp, disabledMoveParDown, disabledRemove) {
    return `
    <div id='adminDropdown_${para_index}' class='btn-group-vertical' role='group' style='display:none'>
    <div class='btn-group' role='group'>
    <button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown' aria-expanded='false'>
    <span class='glyphicon glyphicon-pencil' aria-hidden='true'></span>
     Edit Paragraph <span class='caret'></span>
    </button>
    <ul class='dropdown-menu' role='menu'>
    <li><a href='#editor' onclick='viewEditor(${para_index})'>Open editor</a></li>
    <li ${disabledApprove}><a href='#editor' role='menuitem' tabindex='-1' onclick='approveParagraph(${para_index})'>Paragraph Approval</a></li>
    </ul>
    </div>
    <div class='btn-group' role='group'>
   <button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown' aria-expanded='false'>
    <span class='glyphicon glyphicon-plus-sign' aria-hidden='true'></span>
     Add Paragraph <span class='caret'></span>
    </button>
    <ul class='dropdown-menu' role='menu'>
    <li><a href='#editor' onclick='createParagraph("after", ${para_index})'>After</a></li>
    <li><a href='#editor' onclick='createParagraph("before", ${para_index})'>Before</a></li>
    </ul>
    </div>
    <div class='btn-group' role='group'>
    <button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown' aria-expanded='false'>
    <span class='glyphicon glyphicon-sort' aria-hidden='true'></span>
    Move Paragraph <span class='caret'></span>
    </button>
    <ul class='dropdown-menu' role='menu'>
    <li ${disabledMoveParUp}><a href='#editor' onclick='moveParagraph(\"up\", ${para_index})'>Move UP</a></li>
    <li ${disabledMoveParDown}><a href='#editor' onclick='moveParagraph(\"down\", ${para_index})'>Move DOWN</a></li>
    </ul>
    </div>
    <button  ${disabledRemove}  type='button' class='btn btn-danger' onclick='confirmRemoveParagraph(${para_index})'>
    <span class='glyphicon glyphicon-remove-sign' aria-hidden='true'></span> Remove Paragraph
    </button>
    </div>`;

}
function viewParaEditionsTable(para_index) {
    let tableState = document.getElementById('revisionTable_' + para_index).style.display;
    tableState = (tableState == 'none') ? '' : 'none';
    document.getElementById('revisionTable_' + para_index).style.display = tableState;
    if (canEditParagraph()) {
        dropdwnState = document.getElementById('adminDropdown_' + para_index).style.display;
        dropdwnState = (dropdwnState == 'none') ? '' : 'none';
        document.getElementById('adminDropdown_' + para_index).style.display = dropdwnState;
    }

}
function galleryHTML(paragraphRevision) {
    result = "";
    index = 0;
    if (paragraphRevision.gallery == null || paragraphRevision.gallery == '') {
        paragraphRevision.gallery = {};
        paragraphRevision.gallery.image = [];
        paragraphRevision.gallery.image = paragraphRevision.gallery.image;
    }
    imageNodeList = paragraphRevision.gallery.image;
    imageNodeList = checkIfNotArrayMakeArray(imageNodeList)
    for (var j = 0; j < imageNodeList.length; j++) {
        if (!Array.isArray(imageNodeList)) {
            imageFilename = encodeURI(imageNodeList);
        }
        imageFilename = encodeURI(imageNodeList[j]);
        imageTitle = imageTitleRoot(j);
        result += `<a href='http://trondoc.jotron.inet/ps_images/${imageFilename}'  class='highslide' onclick='return hs.expand(this)' title= '${imageTitle}'
                   style='margin: 0 0 10px 15px'>
                   <img src= 'http://trondoc.jotron.inet/ps_images/${imageFilename}' alt='' class='paraimage' /></a>`;

    }
    return result;
}
function revisionTableBody(para_index, selected_rev_index) {
    var revisionRows = '';
    let paragraphsNodeList = getProcSpec().content.paragraph;
    for (var i = 0; i < paragraphsNodeList.length; i++) {
        if (paragraphsNodeList[i]["@para_index"] == para_index) {
            var revisionNodes = paragraphsNodeList[i].revision;
            revisionRows = getRevisionNodes(revisionNodes, selected_rev_index, para_index, revisionRows);
        }
    }
    return revisionRows;
}
function getRevisionNodes(revisionNodes, selected_rev_index, para_index, revisionRows) {
    for (var j = 0; j < revisionNodes.length; j++) {
        var changelog = "";
        ({ state, rev_index, dateString, approver, changelog } = getTableInfo(changelog, revisionNodes, j));
        var paragraphState = '';
        if (state == "draft") {
            paragraphState = 'Draft';
            color = "yellow";
        }
        else if (state == "approved") {
            paragraphState = 'Current';
            currentNodeNum = j;
            color = "#66CC66";
            rev_index_approved = rev_index;
        }
        else {
            paragraphState = 'Deprecated';
            color = "red";
        }
        if (revisionNodes[j]["@rev_index"] == selected_rev_index) rowstyle = "background-color:" + color + ";";
        else rowstyle = "";

        paralink = "onclick=\"updateParagraph('" + para_index + "','" + rev_index + "')\"";
        revisionRows = getRivisionRows(revisionRows, para_index, rev_index, paragraphState, dateString, changelog, approver);
    }
    return revisionRows;
}

function getTableInfo(changelog, revisionNodes, j) {
    changelog = revisionNodes[j]["changelog"] ? revisionNodes[j]["changelog"] : '';
    var userIndex = revisionNodes[j]["@approver"];
    if (userIndex != '') {
        var approver = isNumber(userIndex) ? getUserFullname(userIndex) : userIndex;

    }
    else { var approver = ''; }
    var state = revisionNodes[j]["@state"];
    var rev_index = parseInt(revisionNodes[j]["@rev_index"]);
    var approval_time = parseInt(revisionNodes[j]["@approval_time"]);
    var dateString = dateFormat(approval_time);
    return { state, rev_index, dateString, approver, changelog };
}

function getRivisionRows(revisionRows, para_index, rev_index, paragraphState, dateString, changelog, approver) {
    revisionRows += `<tr id='revrow_ ${para_index}  ${rev_index}' style='${rowstyle}'>
                        <td><a ${paralink}> ${paragraphState}</a></td> 
                        <td>${dateString}</td><td>${changelog}</td>
                        <td>${approver["#text"] || ''}</td></tr>`;
    return revisionRows;
}

function documentProperties() {
    return `<!-- Modal for setting document properties -->
    <div class="modal fade" id="docpropertiesModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
            <h4 class="modal-title" id="docPropertiesLabel">Document Properties</h4>
          </div>
          <div class="modal-body">
               <table class="table table-hover">
                   <thead>
                   <tr>
                      <th>Property</th><th colspan="3">Setting</th>
                  </tr>
                  </thead>
                  <tbody id="docPropertiesTable">
                  
                  </tbody>
            </table>
            <div class="well">
                PS Title:
                <input type="text" class="form-control" id="titleInput" placeholder="Title" disabled="disabled"/>
                PS Subtitle:
                <input type="text" class="form-control" id="subTitleInput" placeholder="Subtitle"/>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" id="docPropertiesCancelPSButton" onclick="newPsCanceled()" class="btn btn-info" data-dismiss="modal" >Cancel Create PS</button>
            <button type="button" id="docPropertiesCancelChangeButton" class="btn btn-default" data-dismiss="modal">Cancel</button>
            <button type="button" id="docPropertySaveBtn" class="btn btn-primary" onclick="saveDocProperties('false')">Save Document Properties</button>
            <button type="button" id="docPropertyCreateBtn" class="btn btn-warning" onclick="saveDocProperties('true')">Create New PS</button>
          </div>
        </div>
      </div>
    </div>`;

}

function viewDocProperties(isNewDoc) {
    let nodeInfo = getProcSpec().info;
    showProeperties(isNewDoc);

    let docstate = nodeInfo.document_state;
    let draftChecked = '';
    let productionChecked = '';
    if (docstate == 'draft') draftChecked = 'checked';
    else productionChecked = 'checked';
    let disabledNewDoc = (isNewDoc == 'true') ? 'disabled' : '';
    docStateInp(draftChecked, productionChecked, disabledNewDoc)

    let ex = nodeInfo.ex;
    let exTrueChecked = '';
    let exFalseChecked = '';
    if (ex == 'true') { exTrueChecked = 'checked'; }
    else { exFalseChecked = 'checked' }
    exInp(exTrueChecked, exFalseChecked)

    var mainlang = nodeInfo.languages["@main"];
    var sublang = nodeInfo.languages["@sub"];
    var mainLangInputs = "";
    var subLangInputs = "";

    ({ checkedState, disabledState, mainLangInputs, subLangInputs } = getLanguagesArray(mainlang, mainLangInputs, sublang, subLangInputs));
    mainLangInputs = "<tr><form><td>Main Language:</td>" + mainLangInputs + "</form></tr>";
    subLangInputs = "<tr><form><td>Subsidiary Languages:</td><td/>" + subLangInputs + "</form></tr>";
    var psTypeInputs = "";
    var psTypeOpt = ['Assembly', 'Test'];
    ({ checkedState, disabledState, psTypeInputs } = getPsTypeInputs(isNewDoc, checkedState, psTypeOpt, disabledState, psTypeInputs));
    psTypeInputs = "<tr id='psTypeRow' ><form><td>PS Kind:</td>" + psTypeInputs + "</form></tr>";
    var table = "" + docstateInputs + exInputs + mainLangInputs + subLangInputs + psTypeInputs;
    document.getElementById('docPropertiesTable').innerHTML = table;

    if (isNewDoc == 'true') {
        document.getElementById('psTypeRow').style.display = '';
    } else { document.getElementById('psTypeRow').style.display = 'none'; }
    var docTitle = nodeInfo.title;
    document.getElementById('titleInput').value = docTitle;
    var docSubTitle = nodeInfo.subtitle;
    document.getElementById('subTitleInput').value = docSubTitle;

    $('#docpropertiesModal').modal('show');
}


function showProeperties(isNewDoc) {
    if (isNewDoc == 'true') {
        var displayNew = "";
        var displayExist = "none";
        var docPropLabel = "Create New Process Specification";
    }
    else {
        var displayNew = "none";
        var displayExist = "";
        var docPropLabel = "Document Properties";
    }
    document.getElementById("docPropertiesLabel").innerHTML = docPropLabel;
    document.getElementById("docPropertiesCancelPSButton").style.display = displayNew;
    document.getElementById("docPropertiesCancelChangeButton").style.display = displayExist;
    document.getElementById("docPropertyCreateBtn").style.display = displayNew;
    if (canApproveParagraph()) {
        document.getElementById("docPropertySaveBtn").style.display = displayExist;
    }
    else {
        document.getElementById("docPropertySaveBtn").style.display = "none";
    }
}

function getPsTypeInputs(isNewDoc, checkedState, psTypeOpt, disabledState, psTypeInputs) {
    let psTypeArray = ['assembly', 'test'];
    for (var i = 0; i < psTypeArray.length; i++) {
        if (isNewDoc == 'true') {
            var checkedState = (i == 0) ? 'checked' : '';
        }
        else {
            var checkedState = ($('#info_type').text() == psTypeOpt[i]) ? 'checked' : '';
        }
        var disabledState = 'enabled';
        psTypeInputs += `<td><input type='radio' onclick='setTitleInDocPropertiesModal(this.value)' name='psTypeRadioBtn' value='${psTypeArray[i]}' ${checkedState} ${disabledState} > ${psTypeArray[i]}</td>`;

    }
    return { checkedState, disabledState, psTypeInputs };
}
function setTitleInDocPropertiesModal(pskind) {
    var titleword = (pskind == 'test') ? 'Test' : 'Assembly';
    document.getElementById('titleInput').value = `${titleword} of X-${callerModuleNum} "${callerModuleName}"`;
}


function getLanguagesArray(mainlang, mainLangInputs, sublang, subLangInputs) {
    let languagesArray = ['en', 'no', 'lt'];
    for (var i = 0; i < languagesArray.length; i++) {
        var checkedState = (mainlang == languagesArray[i]) ? 'checked' : '';
        var disabledState = (i > 0) ? 'disabled' : 'enabled';
        mainLangInputs += `<td><input type='radio' name='mainLangRadioBtn' value='${languagesArray[i]}' ${checkedState} ${disabledState} > ${languagesArray[i]}</td>`;
        if (i > 0) {
            var checkedState = (sublang.indexOf(languagesArray[i]) != -1) ? 'checked' : '';
            subLangInputs += `<td><input type='checkbox' name='subLangChkBtn' value='${languagesArray[i]}' ${checkedState} > ${languagesArray[i]}</td>`;
        }
    }
    return { checkedState, disabledState, mainLangInputs, subLangInputs };
}

function docStateInp(draftChecked, productionChecked, disabledNewDoc) {
    docstateInputs = `<tr><form><td>Document State:</td>
                        <td><input type='radio' name='docstateRadioBtn' value='draft' ${draftChecked} disabled > draft</td>
                        <td><input type='radio' name='docstateRadioBtn' value='production' ${productionChecked} ${disabledNewDoc} > production</td><td/>
                      </form></tr>`;
    return docstateInputs
}
function exInp(exTrueChecked, exFalseChecked) {
    exInputs = `<tr><form><td>EX Restricted:</td>
                    <td><input type='radio' name='exRadioBtn' value='true' ${exTrueChecked}> restricted</td>
                    <td><input type='radio' name='exRadioBtn' value='false' ${exFalseChecked}> not restricted</td><td/>
                </form></tr>`;
    return exInputs
}
function modalConfirmRemovePara() {
    return `		<div class="modal fade" id="confirmRemoveModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
          <h4 class="modal-title" id="myModalLabel">Please confirm that you will remove this paragraph</h4>
        </div>
        <div class="modal-body">
            <p id="remove_para_index" style="display: none"></p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
          <button type="button" id="paraRemoveBtn" class="btn btn-primary" onclick="removeParagraph()">Confirm Paragraph Removal</button>
        </div>
      </div>
    </div>
  </div>`
}

function confirmRemoveParagraph(para_index) {
    //modalConfirmRemovePara()
    var displayRemoveBtn = canApproveParagraph() ? "" : "none";
    document.getElementById("paraRemoveBtn").style.display = displayRemoveBtn;
    document.getElementById('remove_para_index').innerHTML = para_index;
    $('#confirmRemoveModal').modal('show');
}
function modelApprovalParagraph() {
    return `<div class="modal fade" id="revisionsModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
          <h4 class="modal-title" id="myModalLabel">Revision Reason</h4>
        </div>
        <div class="modal-body">
            <p id="approval_para_index" style="display: none"></p>
          <textarea id="approval_changelog" class="form-control" rows="3" placeholder="Write a reason for the paragraph update."></textarea>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
          <button type="button" id="paraApprovalBtn" class="btn btn-primary" onclick="approvalConfirmed()">Confirm Paragraph Approval</button>
        </div>
      </div>
    </div>
  </div>`
}
