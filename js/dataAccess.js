
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
    savePSInfoTest: async function (docnum, content) {
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
