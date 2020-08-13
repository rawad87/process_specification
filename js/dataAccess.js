
// document.getElementById('test').innerHTML = 'rawad TEST';
// function readXmlAjaxServer($subject, $name, $data) {
//     /* jQuery method $.post used for AJAX */
//     var jqxhr = $.post("ps_ajax_server.php", {
//         subject: $subject,
//         name: $name,
//         data: $data
//     },
//         function (data, status) {
//             returnData = data;
//             //console.log(returnData);
//         });
//     return jqxhr;
// }

// function readPsTemplate() {

//     var psObject = readXmlAjaxServer('readPSTemplate', '', '')
//     psObject.done(function () {
//         //alert(psObject.responseText);
//        // var parser = new DOMParser();
//         console.log(psObject.responseText);
//         // psDoc = parser.parseFromString(psObject.responseText, "text/xml");
//         // console.log('dddddd',psDoc);

//          //var jsonText = JSON.stringify(xml2json(psDoc));
//         // console.log(jsonText)
//         //  obj = JSON.parse(jsonText);
//         // console.log(obj);


//         // console.log(typeof obj);

//         let dom = parseXml(psObject.responseText);
//         let json = xml2json(dom).replace('undefined','');
//         console.log(json);
//         let obj = JSON.parse(json);
//         console.log(obj);

//         console.log(obj["exist:result"].process_specification.info.languages);

//         //document.getElementById('Json').innerHTML = obj["exist:result"].process_specification.info.document_state;


//     })
// }
// function readXmlAjaxServer(subject, name, data) {
//     return $.post("ps_ajax_server.php", {subject, name,data});
// }


// async function readPsTemplate() {

//     let psObject = await readXmlAjaxServer('readPSTemplate', '', '');
//     console.log(psObject);
//     let dom = parseXml(psObject);
//     let json = xml2json(dom).replace('undefined', '');
//     //console.log(json);
//     let obj = JSON.parse(json);
//     console.log(obj);
//     //  console.log(obj["exist:result"].process_specification.info.languages['@main']);
//     docnum = obj["exist:result"].process_specification.content;
//     console.log(docnum);

// }
// readPsTemplate();

// async function readParagraphTemplate() {

//     let readParagraphTemplate = await readXmlAjaxServer('readParagraphTemplate', '', '');
//     //console.log(readParagraphTemplate);
//     let dom = parseXml(readParagraphTemplate);
//     let json = xml2json(dom).replace('undefined', '');
//     //console.log(json);
//     let obj = JSON.parse(json);
//     //console.log(obj);

// }
// //readParagraphTemplate();
// async function testReadPs() {
//     const urlParams = new URLSearchParams(window.location.search);
//     const docnum = urlParams.get('docnum');
//     const result = await readPS(docnum);

//     //console.log(result);

// }

// async function readPS(docnum) {
//     let readPS = await readXmlAjaxServer('readPS', docnum, '')
//     let dom = parseXml(readPS);
//     let json = xml2json(dom).replace('undefined', '');
//   //  console.log(json);
//     return JSON.parse(json);
// }

// //testReadPs()

// async function readPSList(){

//     let readPSList = await readXmlAjaxServer('readPSList', '', '');
//     let dom = parseXml(readPSList);
//     let json = xml2json(dom).replace('undefined', '');
//     //console.log(json);
//     let obj = JSON.parse(json);
//    // console.log(obj);
// }
// readPSList();

// async function updateOwnerModule() {
//     const urlParams = new URLSearchParams(window.location.search);
//     const docnum = urlParams.get('docnum');
//     let updateOwnerModule = await readXmlAjaxServer('updateOwnerModule', docnum, '');
//     //console.log(updateOwnerModule);
// }
// //updateOwnerModule();

// async function saveNewPS(){

//     let saveNewPS = await readXmlAjaxServer('saveNewPS','', '');
// }

// function parseXml(xml) {
//     var dom = null;
//     if (window.DOMParser) {
//         try {
//             dom = (new DOMParser()).parseFromString(xml, "text/xml");
//         }
//         catch (e) { dom = null; }
//     }
//     else if (window.ActiveXObject) {
//         try {
//             dom = new ActiveXObject('Microsoft.XMLDOM');
//             dom.async = false;
//             if (!dom.loadXML(xml)) // parse error ..

//                 window.alert(dom.parseError.reason + dom.parseError.srcText);
//         }
//         catch (e) { dom = null; }
//     }
//     else
//         alert("cannot parse xml string!");
//     return dom;
// }


const dataAccess = {
    readPsTemplate: async function () {
        return await this.readXmlAjaxServer('readPSTemplate', '', '');
    },

    readParagraphTemplate: async function () {
        return await this.readXmlAjaxServer('readParagraphTemplate', '', '');
    },

    readPS: async function (docnum) {
        return await this.readXmlAjaxServer('readPS', docnum, '')
    },

    readPSList: async function () {
        return await this.readXmlAjaxServer('readPSList', '', '');
    },

    saveNewPS: async function (content) {
        return await this.readXmlAjaxServer('saveNewPS', '', content);
    },

    savePSContent: async function (docnum, content) {
         return await this.readXmlAjaxServer('savePSContent', docnum, content);
    },

    savePsInfo: async function (docnum, content) {
        return await this.readXmlAjaxServer('savePsInfo', docnum, content);
    },

    usersFullName: async function () {
        return await this.readXmlAjaxServer('usersFullName', '', '');
    },

    saveImage: async function (ImageFileStoredName, dataURL) {
        return await this.readXmlAjaxServer('saveImage', ImageFileStoredName, dataURL);
    },

    readImageList: async function () {
        return await this.readXmlAjaxServer('readImageList', '', '');
    },
    convertImages: async function (newname, imagePath) {
        return await this.readXmlAjaxServer('convertImages', newname, imagePath);
    },

    readXmlAjaxServer: async function (subject, name, data) {
        return await $.post("ps_ajax_server.php", { subject, name, data });
    },

    objectFromXmlText: function (xmlText) {
        let dom = this.parseXml(xmlText);
        let json = xml2json(dom).replace('undefined', '');
        return JSON.parse(json);
    },

    parseXml: function (xml) {
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
    },
}
