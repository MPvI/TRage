import 'jquery';
var Soap = (function () {
    function Soap() {
    }
    Soap.init = function (info) {
        Soap.info = info;
    };
    Soap.getListMessage = function () {
        /*
        ACTION = GetParameterNames
        ARGS0 = ParameterPath
        ARGS1 = NextLevel
        let args = [
          {name: 'ParameterPath', type: 'xsd:string', val: "Device."},
          {name: 'NextLevel', type: 'xsd:boolean', val: '0'}
        ];
    
         */
        return Soap.XMLpre +
            Soap.SOAPpre +
            Soap.cwmpOpen("GetParameterNames", null) +
            Soap.open("ParameterPath") +
            "Device." +
            Soap.close("ParameterPath") +
            Soap.open("NextLevel") +
            "0" +
            Soap.close("NextLevel") +
            Soap.cwmpClose("GetParameterNames") +
            Soap.SOAPpost;
    };
    Soap.setValuesMessage = function (leafs, values) {
        /*
         ACTION = SetParameterValues
         ARGS0 = ParameterList string[] of ParameterValueStructs
         ARGS1 = ParameterKey string
         */
        var msg = Soap.XMLpre +
            Soap.SOAPpre +
            Soap.cwmpOpen("SetParameterValues", null) +
            Soap.cwmpOpen("ParameterList", ["ParameterValueStruct", leafs.length]);
        for (var i = 0; i < leafs.length; i++) {
            msg += Soap.parameterValueStruct(leafs[i], values[i]);
        }
        msg += Soap.cwmpClose("ParameterList") +
            Soap.cwmpOpen("ParameterKey", "string") +
            Soap.cwmpClose("ParameterKey") +
            Soap.cwmpClose("SetParameterValues") +
            Soap.SOAPpost;
        return msg;
    };
    Soap.getValuesMessage = function (leafs) {
        /*
         ACTION = GetParameterValues
         ARG0 = ParameterNames string[]
         */
        var msg = Soap.SOAPpre +
            Soap.cwmpOpen("GetParameterValues", null) +
            Soap.cwmpOpen("ParameterNames", ["string", leafs.length]);
        for (var _i = 0, leafs_1 = leafs; _i < leafs_1.length; _i++) {
            var leaf = leafs_1[_i];
            msg += Soap.open("xsd:string") + leaf.fullPath + Soap.close("xsd:string");
        }
        msg += Soap.cwmpClose("ParameterNames") +
            Soap.cwmpClose("GetParameterValues") +
            Soap.SOAPpost;
        return msg;
    };
    Soap.addObjectMessage = function (obj) {
        /*
         ACTION = AddObject
         ARGS0 = ParameterKey
         ARGS1 = ObjectName
         */
        return Soap.XMLpre + Soap.SOAPpre +
            Soap.cwmpOpen("AddObject", null) +
            Soap.open("ObjectName") +
            obj.oname +
            Soap.close("ObjectName") +
            Soap.open("ParameterKey") +
            obj.pkey +
            Soap.close("ParameterKey") +
            Soap.cwmpClose("AddObject") +
            Soap.SOAPpost;
    };
    Soap.delObjectMessage = function (obj) {
        /*
         ACTION = DelObject
         ARGS0 = ParameterKey
         ARGS1 = ObjectName
         */
        return Soap.XMLpre + Soap.SOAPpre +
            Soap.cwmpOpen("DeleteObject", null) +
            Soap.open("ObjectName") +
            obj.oname +
            Soap.close("ObjectName") +
            Soap.open("ParameterKey") +
            obj.pkey +
            Soap.close("ParameterKey") +
            Soap.cwmpClose("DeleteObject") +
            Soap.SOAPpost;
    };
    Soap.rebootMessage = function () {
        /*
         ACTION = Reboot
         ARGS0 = CommandKey
         */
        return Soap.XMLpre +
            Soap.SOAPpre +
            Soap.cwmpOpen("Reboot", null) +
            Soap.cwmpOpen("CommandKey", null) +
            Soap.cwmpClose("CommandKey") +
            Soap.cwmpClose("Reboot") +
            Soap.SOAPpost;
    };
    Soap.factoryResetMessage = function () {
        /*
         ACTION = FactoryReset
         */
        return Soap.XMLpre +
            Soap.SOAPpre +
            Soap.cwmpOpen("FactoryReset", null) +
            Soap.cwmpClose("FactoryReset") +
            Soap.SOAPpost;
    };
    Soap.getValuesCallback = function (xml, leafs) {
        var soapRsp = Soap.getSoapBodyFromXml(xml);
        if (soapRsp.hasOwnProperty("Fault")) {
            Soap.info.setMsg("Something broke?");
            for (var i = 0; i < leafs.length; i++) {
                leafs[i].status = 2;
            }
            return;
        }
        if (leafs.length > 1) {
            for (var i = 0; i < leafs.length; i++) {
                var val = soapRsp.GetParameterValuesResponse.ParameterList.ParameterValueStruct[i].Value;
                leafs[i].type = val["@attributes"]["xsi:type"];
                leafs[i].value = val.text;
                leafs[i].status = 3;
            }
        }
        else {
            var val = soapRsp.GetParameterValuesResponse.ParameterList.ParameterValueStruct.Value;
            leafs[0].type = val["@attributes"]["xsi:type"];
            leafs[0].value = val.text;
            leafs[0].status = 3;
        }
    };
    Soap.generateTreeFromList = function (xml) {
        var soapRsp = Soap.getSoapBodyFromXml(xml);
        if (soapRsp.hasOwnProperty("Fault")) {
            Soap.info.setMsg("Most likely no connection?");
            return;
        }
        var storage = [];
        if (Array.isArray(soapRsp.GetParameterNamesResponse.ParameterList.ParameterInfoStruct))
            storage = soapRsp.GetParameterNamesResponse.ParameterList.ParameterInfoStruct;
        else
            storage = [soapRsp.GetParameterNamesResponse.ParameterList.ParameterInfoStruct];
        var result = {};
        for (var _i = 0, storage_1 = storage; _i < storage_1.length; _i++) {
            var data = storage_1[_i];
            Soap.addDeepProp(result, data);
        }
        return result;
    };
    Soap.getSoapBodyFromXml = function (xml) {
        var soap = Soap.xml2json(jQuery.parseXML(xml));
        if (soap.hasOwnProperty("Fault"))
            return soap;
        if (soap.hasOwnProperty("Envelope")) {
            var envelope = soap["Envelope"];
            if (envelope.hasOwnProperty("Body")) {
                return envelope["Body"];
            }
        }
    };
    // Helpers!!!
    Soap.addDeepProp = function (objTarget, data) {
        var iterator = objTarget;
        var paths = data.Name.text.split('.');
        for (var i = 0; i < paths.length; i++) {
            if (paths[i] === '')
                continue;
            if (!(iterator.hasOwnProperty(paths[i]))) {
                if (i == paths.length - 1)
                    iterator[paths[i]] = data.Writable.text;
                else
                    iterator[paths[i]] = {};
            }
            iterator = iterator[paths[i]];
        }
        return iterator;
    };
    Soap.cwmpOpen = function (arg, type) {
        var tx = '';
        if (type)
            if (Array.isArray(type)) {
                tx = ' soap-env:arrayType="xsd:' + type[0] + '[' + type[1] + ']"';
            }
            else {
                tx = ' xsi:type="' + type + '"';
            }
        return Soap.open('cwmp:' + arg + tx);
    };
    Soap.cwmpClose = function (arg) {
        return Soap.close('cwmp:' + arg);
    };
    Soap.cwmpMe = function (method, args) {
        return Soap.cwmpOpen(method, null) + Soap.cwmpArr(args) + Soap.cwmpClose(method);
    };
    Soap.cwmpArr = function (args) {
        var content = "";
        for (var i = 0; i < args.length; i++) {
            content += Soap.cwmpOpen(args[i].name, args[i].type);
            content += args[i].val;
            content += Soap.cwmpClose(args[i].name);
        }
        return content;
    };
    Soap.open = function (type) {
        return '<' + type + '>';
    };
    Soap.close = function (type) {
        return Soap.open('/' + type);
    };
    Soap.parameterValueStruct = function (leaf, val) {
        return Soap.cwmpOpen("ParameterValueStruct", null) +
            Soap.cwmpOpen("Name", null) +
            leaf.fullPath +
            Soap.cwmpClose("Name") +
            Soap.cwmpOpen("Value", leaf.type) +
            val +
            Soap.cwmpClose("Value") +
            Soap.cwmpClose("ParameterValueStruct");
    };
    Soap.xml2json = function (inputXml) {
        var obj = {};
        if (inputXml.nodeType == 1) {
            // do attributes
            if (inputXml.attributes.length > 0) {
                obj['@attributes'] = {};
                for (var j = 0; j < inputXml.attributes.length; j++) {
                    var attribute = inputXml.attributes.item(j);
                    obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
                }
            }
        }
        else if (inputXml.nodeType == 3) {
            obj = inputXml.nodeValue;
        }
        // do children
        if (inputXml.hasChildNodes()) {
            for (var i = 0; i < inputXml.childNodes.length; i++) {
                var item = inputXml.childNodes.item(i);
                var nodeName = item.nodeName.substring(item.nodeName.indexOf(':') + 1).replace('#', '');
                //if (nodeName == 'text') continue;
                if (typeof (obj[nodeName]) == 'undefined') {
                    obj[nodeName] = Soap.xml2json(item);
                }
                else {
                    if (typeof (obj[nodeName].push) == 'undefined') {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(Soap.xml2json(item));
                }
            }
        }
        return obj;
    };
    return Soap;
}());
export { Soap };
Soap.XMLpre = '<?xml version="1.0" encoding="utf-8"?>';
Soap.SOAPpre = '<s:Envelope><s:Body>';
Soap.SOAPpost = '</s:Body></s:Envelope>';
//# sourceMappingURL=soap.js.map