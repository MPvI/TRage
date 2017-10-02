import {TreeLeaf} from "../tree/tree-leaf";
import {InfoService} from "../../service/info.service";
import 'jquery';

declare var jQuery: any;

export class Soap {

  private static info: InfoService;
  public static init(info: InfoService){
    Soap.info = info;
  }

  private static XMLpre: string = '<?xml version="1.0" encoding="utf-8"?>';

  private static SOAPpre: string = '<soap-env:Envelope ' +
    'soap-enc="http://schemas.xmlsoap.org" ' +
    'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
    'xmlns:xsd="http://www.w3.org/2001/XMLSchema" ' +
    'xmlns:cwmp="urn:telekom-de.totr62-2-n" ' +
    'xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope"><soap-env:Body>';

  private static SOAPpost: string = '</soap-env:Body></soap-env:Envelope>';

  public static getListMessage(): string {
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
                  Soap.cwmpOpen("ParameterPath","xsd:string") +
                    "Device." +
                  Soap.cwmpClose("ParameterPath") +
                  Soap.cwmpOpen("NextLevel","xsd:bool") +
                    "0" +
                  Soap.cwmpClose("NextLevel") +
                Soap.cwmpClose("GetParameterNames") +
              Soap.SOAPpost;
  }

  public static setValuesMessage(leafs: Array<TreeLeaf>, values: Array<any>){
    /*
     ACTION = SetParameterValues
     ARGS0 = ParameterList string[] of ParameterValueStructs
     ARGS1 = ParameterKey string
     */
    let msg = Soap.XMLpre+
      Soap.SOAPpre+
      Soap.cwmpOpen("SetParameterValues",null)+
      Soap.cwmpOpen("ParameterList",["ParameterValueStruct",leafs.length]);
    for(let i=0; i<leafs.length; i++){
      msg += Soap.parameterValueStruct(leafs[i],values[i]);
    }
    msg +=        Soap.cwmpClose("ParameterList")+
      Soap.cwmpOpen("ParameterKey","string")+
      Soap.cwmpClose("ParameterKey")+
      Soap.cwmpClose("SetParameterValues")+
      Soap.SOAPpost;
    return msg;
  }

  public static getValuesMessage(leafs: Array<TreeLeaf>){
    /*
     ACTION = GetParameterValues
     ARG0 = ParameterNames string[]
     */
    let msg = Soap.SOAPpre+
      Soap.cwmpOpen("GetParameterValues", null)+
      Soap.cwmpOpen("ParameterNames",["string",leafs.length]);
    for(let leaf of leafs){
      msg += Soap.open("xsd:string")+leaf.fullPath+Soap.close("xsd:string");
    }
    msg+=     Soap.cwmpClose("ParameterNames")+
      Soap.cwmpClose("GetParameterValues")+
      Soap.SOAPpost;
    return msg;
  }

  public static getAllValuesMessage(path: string){
    /*
     ACTION = GetParameterValues
     ARG0 = ParameterNames string[]
     */
    let msg = Soap.SOAPpre+
      Soap.cwmpOpen("GetParameterValues", null)+
        Soap.cwmpOpen("ParameterNames",["string",1])+
          Soap.open("xsd:string")+
            path+
          Soap.close("xsd:string")+
        Soap.cwmpClose("ParameterNames")+
      Soap.cwmpClose("GetParameterValues")+
      Soap.SOAPpost;
    return msg;
  }

  public static addObjectMessage(obj: any){
    /*
     ACTION = AddObject
     ARGS0 = ParameterKey
     ARGS1 = ObjectName
     */
    return Soap.XMLpre+Soap.SOAPpre+
      Soap.cwmpOpen("AddObject",null)+
        Soap.open("ObjectName")+
          obj.oname+
        Soap.close("ObjectName")+
        Soap.open("ParameterKey")+
          obj.pkey+
        Soap.close("ParameterKey")+
      Soap.cwmpClose("AddObject")+
      Soap.SOAPpost
  }

  public static delObjectMessage(obj: any){
    /*
     ACTION = DelObject
     ARGS0 = ParameterKey
     ARGS1 = ObjectName
     */
    return Soap.XMLpre+Soap.SOAPpre+
      Soap.cwmpOpen("DeleteObject",null)+
        Soap.open("ObjectName")+
          obj.oname+
        Soap.close("ObjectName")+
        Soap.open("ParameterKey")+
          obj.pkey+
        Soap.close("ParameterKey")+
      Soap.cwmpClose("DeleteObject")+
      Soap.SOAPpost
  }

  public static rebootMessage(){
    /*
     ACTION = Reboot
     ARGS0 = CommandKey
     */
    return Soap.XMLpre+
            Soap.SOAPpre+
              Soap.cwmpOpen("Reboot",null)+
                Soap.cwmpOpen("CommandKey",null)+
                Soap.cwmpClose("CommandKey")+
              Soap.cwmpClose("Reboot")+
            Soap.SOAPpost;
  }

  public static factoryResetMessage(){
    /*
     ACTION = FactoryReset
     */

    return Soap.XMLpre+
      Soap.SOAPpre+
      Soap.cwmpOpen("FactoryReset",null)+
      Soap.cwmpClose("FactoryReset")+
      Soap.SOAPpost;
  }

  public static getValuesCallback(xml: string, leafs: Array<TreeLeaf>){
    let soapRsp = Soap.getSoapBodyFromXml(xml);
    if(soapRsp.hasOwnProperty("Fault")){
      Soap.info.setInfoMsg("Something broke?");
      for(let i = 0; i<leafs.length; i++){
        leafs[i].status = 2;
      }
      return;
    }
    if(leafs.length > 1){
      for(let i = 0; i<leafs.length; i++){
        let val = soapRsp.GetParameterValuesResponse.ParameterList.ParameterValueStruct[i].Value;
        leafs[i].type = val["@attributes"]["xsi:type"];
        leafs[i].value = val.text;
        leafs[i].status = 3;
      }
    }else{
      let val = soapRsp.GetParameterValuesResponse.ParameterList.ParameterValueStruct.Value;
      leafs[0].type = val["@attributes"]["xsi:type"];
      leafs[0].value = val.text;
      leafs[0].status = 3;
    }
  }

  public static generateTreeFromList(xml: any) {
    let soapRsp = Soap.getSoapBodyFromXml(xml);
    if(soapRsp.hasOwnProperty("Fault")){
      Soap.info.setInfoMsg("Most likely no connection?");
      return;
    }

    let storage = [];
    if(Array.isArray(soapRsp.GetParameterNamesResponse.ParameterList.ParameterInfoStruct))
      storage = soapRsp.GetParameterNamesResponse.ParameterList.ParameterInfoStruct;
    else
      storage = [soapRsp.GetParameterNamesResponse.ParameterList.ParameterInfoStruct];

    let result = {};
    for (let data of storage){
      Soap.addDeepProp(result,data);
    }
    return result;
  }

  public static getSoapBodyFromXml(xml: string){
    let soap = Soap.xml2json(jQuery.parseXML(xml));
    if(soap.hasOwnProperty("Fault"))
      return soap;
    if(soap.hasOwnProperty("Envelope")){
      let envelope = soap["Envelope"];
      if(envelope.hasOwnProperty("Body")){
        return envelope["Body"];
      }
    }
  }
  // Helpers!!!

  private static addDeepProp(objTarget: any, data: any){
    let iterator = objTarget;
    let paths = data.Name.text.split('.');

    for (let i = 0; i < paths.length; i++){
      if(paths[i] === '')
        continue;
      if(!(iterator.hasOwnProperty(paths[i]))){
        if(i == paths.length-1)
          iterator[paths[i]] = data.Writable.text;
        else
          iterator[paths[i]]={};
      }
      iterator = iterator[paths[i]];
    }

    return iterator;
  }

  private static cwmpOpen(arg: any, type: any){
    let tx = '';
    if(type)
      if(Array.isArray(type)){
        tx = ' soap-env:arrayType="xsd:' + type[0] + '['+type[1]+']"';
      }
      else{
        tx = ' xsi:type="'+type+'"';
      }
    return Soap.open('cwmp:'+arg+tx);
  }

  private static cwmpClose(arg: any){
    return Soap.close('cwmp:'+arg);
  }

  private static cwmpMe(method: any, args: any){
    return Soap.cwmpOpen(method, null) + Soap.cwmpArr(args) + Soap.cwmpClose(method);
  }

  private static cwmpArr(args: any){
    let content = "";
    for (let i=0; i<args.length; i++){
      content += Soap.cwmpOpen(args[i].name, args[i].type);
      content += args[i].val;
      content += Soap.cwmpClose(args[i].name);
    }
    return content;
  }

  private static open(type: any){
    return '<'+type+'>';
  }

  private static close(type: any){
    return Soap.open('/'+type);
  }

  private static parameterValueStruct(leaf: TreeLeaf, val: any){
    return  Soap.cwmpOpen("ParameterValueStruct",null)+
      Soap.cwmpOpen("Name",null)+
      leaf.fullPath+
      Soap.cwmpClose("Name")+
      Soap.cwmpOpen("Value",leaf.type)+
      val+
      Soap.cwmpClose("Value")+
      Soap.cwmpClose("ParameterValueStruct");
  }

  public static xml2json(inputXml: any){
    let obj = {};

    if (inputXml.nodeType == 1) {// element
      // do attributes
      if (inputXml.attributes.length > 0) {
        obj['@attributes'] = {};
        for (let j = 0; j < inputXml.attributes.length; j++) {
          let attribute = inputXml.attributes.item(j);
          obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (inputXml.nodeType == 3) {// text
      obj = inputXml.nodeValue;
    }

    // do children
    if (inputXml.hasChildNodes()) {
      for (let i = 0; i < inputXml.childNodes.length; i++) {
        let item = inputXml.childNodes.item(i);
        let nodeName = item.nodeName.substring(item.nodeName.indexOf(':') + 1).replace('#', '');
        //if (nodeName == 'text') continue;
        if ( typeof (obj[nodeName]) == 'undefined') {
          obj[nodeName] = Soap.xml2json(item);
        } else {
          if ( typeof (obj[nodeName].push) == 'undefined') {
            let old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(Soap.xml2json(item));
        }
      }
    }
    return obj;
  }
}
