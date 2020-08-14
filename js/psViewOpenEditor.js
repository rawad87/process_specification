
function viewParaForEdit(para_index) {

    /* Building the html content for the editor area */
    let paragraphsNodeList = getProcSpec().content.paragraph;

    document.getElementById('languageSelectors').style.display = "none";
    var textHtml = '';
    var para = '';
    var langTag = '';
    var editorID = new Array();
    var paraTextID = new Array();
    var langArray = new Array();
    var { draftRevision, j, i } = getParNodeListInfo(paragraphsNodeList, para_index);

    

    /* Building the text parts of the paragraph */
    paraNodeList = paraNodeList1;

    let docLanguages = getLanguage();
    for (var j = 0; j < docLanguages.length; j++) {
        /* Find the /para corresponding to language */
        var paranum = 0;
        for (var x = 0; x < paraNodeList.length; x++) {
            if (paraNodeList[x]["@language"] == docLanguages[j]) {
                paranum = x;
                break;
            }
        }
        var langTag;
        ({ langTag, textHtml } = showInfoInEditor(j, paranum, langTag, langArray, editorID, paraTextID, textHtml, para_index));
    }

    anchor = "<a  id='editor' class='paragraphnum' >Paragraph Editor </a>";
    editorpanel = '<div class="panel panel-default" style="margin:10px 10px 10px 10px;"><div class="panel-body">'
        + anchor
        + "<a href='#paraindex_" + para_index + "' onclick='saveAndReturn()'>"
        + '<button type="button" class="btn btn-success" id="backToPSBtn" style="margin-left:10px;margin-right: 10px;" aria-label="Left Align"><span class="glyphicon glyphicon-backward" aria-hidden="true"></span> Back to <strong>PS</strong></button>'
        + "</a>"
        + "<a href='#paraindex_" + para_index + "' onclick='removeDraft(\"" + para_index + "\")'>"
        + '<button type="button" class="btn btn-danger" id="removeDraftBtn" style="margin-left:10px;margin-right: 10px;" aria-label="Left Align"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Remove <strong>Draft</strong></button>'
        + "</a>"
        + '</div></div>';

    /* --- Building the image parts of the paragraph --- */
    imageHtml = workingGalleryHTML(draftRevision["gallery"]);


    html = '<div class="paragraphEdit">'
        + editorpanel
        + '<!--<p class="paralanguageEdit">Index ' + para_index + '</p>-->'
        + textHtml

        + '<div class="paraimagesEdit">'
        + imageHtml
        + '</div>'

        + '</div>';
    document.getElementById('editor').innerHTML = html;

    for (var i = 0; i < langArray.length; i++) {
        document.getElementById('htmlEditorArea_' + langArray[i]).style.display = "none";
    }
    // listener for file select change handler 
    document.getElementById('pictureFile').addEventListener('change', imageSelected, false);
    document.getElementById('replacementPictureFile').addEventListener('change', imageReplacement, false);

    // Setup the dnd listeners.
    var dropZone = document.getElementById('dropZoneDiv');
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleFileDrop, false);

}
function showInfoInEditor(j, paranum, langTag, langArray, editorID, paraTextID, textHtml, para_index) {
    if (j == 0) {
        /* If main language */
        var editBtnText = " Edit ";
        var allowEdit = "";
        mainLangEdited = (paraNodeList[paranum]["@author"] != "") ? true : false;
        var langstate = 'main';
    }
    else {
        /* If sub languages */
        var editBtnText = " Translate to ";
        var allowEdit = mainLangEdited ? "" : "disabled";
        var langstate = 'sub';
        var backgroundTranslMissing = "background-image: url(\"./graphics/translation_needed.png\"); background-repeat:no-repeat; background-position:10% 50%;";
        var backgroundImage = (paraNodeList[paranum]["@translator"] != "") ? "" : backgroundTranslMissing;
    }
    var language = paraNodeList[paranum]["@language"];
    var langTag = getLanguageString(language);

    var paraheading = paraNodeList[paranum]['heading'];
    var paratext = paraNodeList[paranum]['text'];


    /* Using a <blockquote> for displaying para text and a <textarea> for displaying the TinyMCE editor */
    langArray[j] = language;
    editorID[j] = "editor_" + language;
    paraTextID[j] = "paratext_" + language;
    textHtml += `<div class='paradivEdit'>
		<!--<p class='paralanguageEdit'>${langTag}</p>-->
		<div  class='paratextEdit'>
		<div id='paraTextArea_${language}' style='${backgroundImage}'>
		<button type='button' id='editBtn_${language}' class='btn btn-primary btn-xs' ${allowEdit} style='margin:0px 0px 5px -10px;' onclick='htmlEditor("view" , "${language}","","" )' >
		<span class='glyphicon glyphicon-pencil' aria-hidden='true'></span>${editBtnText}<strong>${langTag}</strong></button><br/>
		<p class='paraheading' id='paraheading_${language}'>${decodeHtml(paraheading)}</p>
		<blockquote id='${paraTextID[j]}' >${decodeHtml(paratext)}</blockquote>
		</div> <div id='htmlEditorArea_${language}'><div style='margin-bottom:5px;'>
		<button type='button' id='saveBtn_${language}' class='btn btn-success btn-xs' onclick='htmlEditor("save" , "${language}"  , "${para_index}"  , "${langstate}" )' >
		<span class='glyphicon glyphicon-ok' aria-hidden='true'></span> Keep Changes</button>
		<button type='button' id='cancelBtn_${language}' class='btn btn-danger btn-xs' style='margin-left:10px;' onclick='htmlEditor("cancel" , "${language}" ,"","")' >
		<span class='glyphicon glyphicon-remove' aria-hidden='true'></span> Forget</button>
		</div><input type='text' class='form-control' id='newparaheading_${language}' placeholder='Heading' style='width:50%;margin-bottom:10px;' value='${decodeHtml(paraheading)}' />
		<textarea name='content' id='${editorID[j]}' rows='10'  >${paratext}</textarea></div> </div></div>`;
    return { langTag, textHtml };
}

function getParNodeListInfo(paragraphsNodeList, para_index) {
    for (var j = 0; j < paragraphsNodeList.length; j++) {

        if (paragraphsNodeList[j]['@para_index'] == para_index) {
            currentParagraph = paragraphsNodeList[j];

            for (let z = 0; z < currentParagraph.revision.length; z++) {
                if (currentParagraph.revision[z]['@state'] == 'draft') {
                    draftRevision = currentParagraph.revision[z];
                    var draftRevision = currentParagraph["revision"][z];
                    paraNodeList1 = currentParagraph["revision"][z].para;
                    imageEditorContextworkRevision = draftRevision;
                    console.log(imageEditorContextworkRevision)
                    break;

                }
                else {

                    /* If there is no revision in state='draft', the first revision is cloned, changed to 'draft' and inserted as first revision node */
                    var approvedRev = currentParagraph["revision"][z];
                    // console.log(approvedRev);
                    var clonedNode = approvedRev;
                    clonedNode['@state'] = 'draft';
                    clonedNode['@approval_time'] = '';
                    clonedNode['@approver'] = '';
                    //clonedNode.setAttribute('author', userIndex);
                    var clonedParaNodeList = clonedNode.para;
                    for (var i = 0; i < clonedParaNodeList.length; i++) {
                        clonedParaNodeList[i]['@author'] = '';
                        clonedParaNodeList[i]['@translator'] = '';
                    }
                    try {
                        var changelogNode = clonedNode["changelog"];
                        var textnode = changelogNode.childNodes[0];
                        changelogNode.removeChild(textnode);
                    }
                    catch (e) { }
                    var dateObj = new Date();
                    clonedNode['@rev_index'] = dateObj.getTime();
                    // var rootElement = psDoc.documentElement;
                    //approvedRev.parentNode.insertBefore(clonedNode,approvedRev);
                    // clonedNode = clonedNode -1;
                    // console.log(clonedNode);
                    var draftRevision = currentParagraph["revision"][z];
                    paraNodeList1 = currentParagraph["revision"][z].para;
                    imageEditorContextworkRevision = draftRevision;
                    break;
                }
            }
        }
    }
    return { draftRevision, j, i };
}

function addImage() {
    document.getElementById('pictureFile').click();
}
function handleFileDrop(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var files = evt.dataTransfer.files; // FileList object.
    for (var i = 0, f; f = files[i]; i++) {
        handleSelectedFile(f, null);
    }
}
function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

function viewEditor(para_index) {
    viewParaForEdit(para_index);
    //alert(para_index);
    //document.getElementById('editor').innerHTML = editParagraph;
    document.getElementById('paragraphs').style.display = "none";
    document.getElementById('editor').style.display = "";
    //document.getElementById('paragraphs').style.display = "none";
}
function imageSelected(evt) {
    var files = evt.target.files;
    for (var i = 0, f; f = files[i]; i++) {
        handleSelectedFile(f, null);
    }
}
function imageReplacement(evt) {
    var f = evt.target.files[0];
    handleSelectedFile(f, imageNodeReplaced);
}
function handleSelectedFile(selectedFile, targetImage) {
    var currentRevision = imageEditorContextworkRevision;
    var documentRoot = currentRevision;

    var gallery = currentRevision["gallery"];
    /* Ensure that no whitespace is within the name  */
    /*var ImageFileStoredName = ("Fig" + (new Date()).getTime() + selectedFile.name).replace(/\W/g, '');*/
    var ImageFileStoredName = ("Fig" + (new Date()).getTime() + selectedFile.name).replace(/[^.,/\w]+/g, '');
    var textElement = ImageFileStoredName;
    dstImageNode = targetImage;

    /* dstImageNode is that object we shall bind the image file to if it does not exist create it */
    if (!dstImageNode) {
        dstImageNode = documentRoot["image"];
        dstImageNode = textElement;
        if (!Array.isArray(gallery["image"])) {
            let arr = [];
            arr.push(gallery["image"]);
            gallery["image"] = arr;
        }
        gallery["image"].unshift(dstImageNode);
        console.log(documentRoot);
    } else {
        /* leave the element in place but change the the text node within */
        dstImageNode = textElement;
    }

    // read the specified file asynchronously and base64 encoded, result will include type information
    makeImageInfoAndSave(targetImage, ImageFileStoredName, currentRevision, selectedFile);
}
function makeImageInfoAndSave(targetImage, ImageFileStoredName, currentRevision, selectedFile) {
    var reader = new FileReader();
    reader.onload = async function (e) {
        var dataURL = reader.result;
        var tempFileInfo = dataURL.split(';');
        var fileType = tempFileInfo[0].split(':');
        fileType = fileType[1].split('/');
        if (fileType[0] != 'image') {
            alert("The uploaded file is a " + fileType[1] + "-file, please choose a valid image file");
            return false;
        }
        // a new image to the gallery this is not yet saved
        previewPic = new Image();
        previewPic.className = 'paraimageEdit imageUploading';
        previewPic.setAttribute("id", "previewPicture");
        previewPic.src = dataURL;
        // while we upload show the image in the drop zone 
        if (!targetImage) {
            document.getElementById("dropZoneDiv").style.display = 'none';
            document.getElementById("dropZoneContainer").appendChild(previewPic);
        }
        await dataAccess.saveImage(ImageFileStoredName, dataURL);
        redrawGallery(currentRevision["gallery"]);
    };
    reader.readAsDataURL(selectedFile);
}

function redrawGallery(currentRevision) {
    document.getElementById('workingGallery').innerHTML = workingGalleryHTML(currentRevision);
}

function htmlEditor(state, language, para_index, langstate) {
    /* Viewing the editor on a specified place (editorarea) */
    var paraTextArea = "paraTextArea_" + language;
    var htmlEditorArea = "htmlEditorArea_" + language;
    var editor = "editor_" + language;
    var paratext = "paratext_" + language;
    var newparaheading = "newparaheading_" + language;
    var paraheading = "paraheading_" + language;
    var newHTML = "";
    var newHeading = "";

    switch (state) {
        case "view": {
            document.getElementById(paraTextArea).style.display = 'none';
            document.getElementById(htmlEditorArea).style.display = '';
            document.getElementById('backToPSBtn').style.display = 'none';
            document.getElementById('removeDraftBtn').style.display = 'none';
            initEditor('editor_' + language);
            $('[id ^=editBtn_]').hide();

            break;
        }
        case "cancel": {
            document.getElementById(paraTextArea).style.display = '';
            document.getElementById(htmlEditorArea).style.display = 'none';
            document.getElementById('backToPSBtn').style.display = '';
            document.getElementById('removeDraftBtn').style.display = '';
            $('[id ^=editBtn_]').show();

            break;
        }
        case "save": {
            newHTML = tinyMCE.activeEditor.getContent();
            document.getElementById(paratext).innerHTML = newHTML;
            newHeading = document.getElementById(newparaheading).value;
            document.getElementById(paraheading).innerHTML = newHeading;
            document.getElementById(paraTextArea).style.display = '';
            document.getElementById(htmlEditorArea).style.display = 'none';
            document.getElementById('backToPSBtn').style.display = '';
            document.getElementById('removeDraftBtn').style.display = '';
            $('[id ^=editBtn_]').show();

            saveDraft(para_index, language, langstate);
            viewParaForEdit(para_index);
            break;
        }
    }
}

function initEditor(e) {
    /* The html editor can be set up with various menues and toolbars */
    tinymce.init({
        mode: "exact",
        elements: e,
        paste_word_valid_elements: "b,strong,i,em,h1,h2",
        plugins: ["advlist autolink lists link image charmap print preview anchor", "searchreplace visualblocks code fullscreen", "insertdatetime media table contextmenu paste", "textcolor"],
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | forecolor backcolor",
        file_browser_callback_types: 'image'
    });
}
function replaceImage(replaceImageNode) {
    imageNodeReplaced = replaceImageNode;
    return function () { document.getElementById('replacementPictureFile').click(); }();
}
/* remove from the psdoc */
function removeImage(node) {
    if (!Array.isArray(imageEditorContextworkRevision.gallery['image'])){
        let arr = [];
        arr.push(imageEditorContextworkRevision.gallery['image']);
        imageEditorContextworkRevision.gallery['image'] = arr;

    }
    for(let i  = 0; i <imageEditorContextworkRevision.gallery['image'].length; i++ ){
        console.log(imageEditorContextworkRevision.gallery['image'][i])
        if(imageEditorContextworkRevision.gallery['image'][i].match(node)){
            imageEditorContextworkRevision.gallery['image'].splice(i, 1);
        }
    }
    document.getElementById('workingGallery').innerHTML = workingGalleryHTML(imageEditorContextworkRevision["gallery"]);
}
