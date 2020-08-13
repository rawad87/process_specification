

const dummyDataAccess = {
    readPS: async function (docnum) {
        return getDoc1054();
        // const xml = await $.get("../xml/readPs1054.xml");
        // console.log(xml);
        // //return this.objectFromXmlText(xml);        
        // let json = xml2json(xml).replace('undefined', '');
        // console.log(json);
        // return JSON.parse(json);
    },
    usersFullName: async function () {
        return getUsers();
    },
    savePSContent: async function (docnum, content) {
        return await this.readXmlAjaxServer('savePSContent', docnum, content);
    },
    readParaTemp:async function(){
        return readParaTemp()
    },
    readPsTemp :async function(){
        return readPsTemp()
    } ,

    readXmlAjaxServer: async function (subject, name, data) {
        return await $.post("ps_ajax_server.php", { subject, name, data });
    },
    

    objectFromXmlText: function (xmlText) {
        let dom = this.parseXml(xmlText);
        let json = xml2json(dom).replace('undefined', '');
        return JSON.parse(json);
    },

    
    jsonObjToXml : async function (jsonText) {
     
        let xmlDOM =json2xml(jsonText);
        let encode = encodeXml(xmlDOM);
        let result =  decodeHtml(encode);
         return result;

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
