import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";
import {Router} from "@angular/router";

import {SettingsService} from "./settings.service";
import {InfoService} from "./info.service";
import {FavoriteService} from "./favorite.service";

import {Soap} from "../class/helper/soap";
import {TreeNode} from "../class/tree/tree-node";
import {TreeLeaf} from "../class/tree/tree-leaf";

import {BehaviorSubject} from "rxjs";

declare var $: any;
declare var serviceDiscovery: any;
declare var jQuery: any;
declare var cordova: any;
declare var window: any;

@Injectable()
export class DataService{
  private _loaded: boolean = false;
  private _rootNode: TreeNode;
  private _activeNode: BehaviorSubject<TreeNode> = new BehaviorSubject<TreeNode>(this._rootNode);
  private docDocument: any = {};

  constructor(private http: Http, private settingsService: SettingsService, private infoService: InfoService, private favoriteService: FavoriteService, private router: Router){
    this.init();
    Soap.init(this.infoService);
  }

  private d = null;

  public init() {
    if (!this._loaded) {
      if (navigator["connection"].type == 'wifi') {
          this.infoService.setErrorMsg("Searching device...");
          let id = setInterval(()=>{
            if (this.d != null) {
              if(this.d.length == 0){
                this.infoService.setErrorMsg("No device found!");
                clearInterval(id);
              }
              let deviceInfo = Soap.xml2json(jQuery.parseXML(this.d[0].xml))["root"];
              this.settingsService.load();
              this.settingsService.setBase(deviceInfo);
              this.infoService.setErrorMsg("Reading parameter list...");
              this.getParameterNames();
              clearInterval(id);

              let checkId = setInterval(()=>{
                if(navigator["connection"].type != 'wifi'){
                  this._loaded = false;
                  this.init();
                  clearInterval(checkId);
                }
              },1000);
            }
          },1000);

          serviceDiscovery.getNetworkServices(
            "urn:telekom-de:device:TO_InternetGatewayDevice:2",
            (d) => this.d=d,
            () => console.log("error")
          );
      } else {
        this.infoService.setErrorMsg("Please enable WIFI!");
        let id = setInterval(() => {
          if (navigator["connection"].type == 'wifi') {
            clearInterval(id);
            this.init();
          }
        }, 1000)
      }
    }
  }

  public docLoaded(){
    return this.docDocument != {};
  }

  public export(path: string){
    let headers = new Headers();
    headers.append("SOAPAction", "urn:telekom-de:device:TO_InternetGatewayDevice:2#GetParameterNames");
    headers.append("content-type", "text/xml");
    let options = new RequestOptions({
      headers: headers
    });
    this.http.post(this.settingsService.getTargetUrl(), Soap.getAllValuesMessage(path), options).subscribe(
      rsp => {
        try {
          let heads = [];
          let vals = [];
          for(let pvs of Soap.getSoapBodyFromXml(rsp.text())["GetParameterValuesResponse"].ParameterList.ParameterValueStruct){
            let val = pvs["Value"].text ? "\""+pvs["Value"].text.replace(/(?:\r\n|\r|\n)/g,"").trim()+"\"" : "";
            if(val.length > 1000) val = "";
            if(val != ""){
              heads.push("\""+pvs["Name"].text+"\"");
              vals.push(val);
            }
          }
          let blob = new Blob([heads.join(",")+'\n'+vals.join(",")], {type: "text/plain;charset=utf-8"});
          window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, (dirEntry)=>{
            dirEntry.getFile("cdm.csv", {create: true, exclusive: false}, (file)=>{
              file.createWriter((fileWriter)=>{
                fileWriter.write(blob);
                cordova.plugins.fileOpener2.open(cordova.file.externalDataDirectory+"cdm.csv", "text/plain");
              }, (err)=>console.log(err));
            }, (err)=>console.log(err));
          },(err)=>console.log(err))
        }catch(e){
          this.infoService.setInfoMsg("Could not export. Did you set a device password?")
        }
      });
  }

  public getParameterNames(node? : TreeNode){
    let headers = new Headers();
    headers.append("SOAPAction", "urn:telekom-de:device:TO_InternetGatewayDevice:2#GetParameterNames");
    headers.append("content-type", "text/xml");
    let options = new RequestOptions({
      headers: headers
    });
    // Get Full List
    this.http.post(this.settingsService.getTargetUrl(),Soap.getListMessage(),options).subscribe(
      rsp => {
        this._rootNode = new TreeNode(Soap.generateTreeFromList(rsp.text()),'',null,this);
        if(node){
          this._activeNode.next(this.findNode(node.fullPath));
        }else{
          this._activeNode.next(this._rootNode);
        }
        this._loaded = true;
        this.favoriteService.load(this);

        let dmn = this.findLeaf("Device.DeviceInfo.SupportedDataModel.1.URL");
        dmn.query();
        dmn.value.subscribe((val)=>{
          if(val == "") return;
          let url = val.replace("xml","html");
          this.infoService.setErrorMsg("Reading specification info, this can take a while.");
          this.http.get(url).subscribe(
            rsp=>{
              this.docDocument = jQuery.parseHTML(rsp.text());
              $(this.docDocument).find("a").each(function () {
                this.href.replace("file:///android_asset/www/", url);
              });
              this.infoService.clearError();
            },err=>this.infoService.clearError()
          );
        })
      }
    );
  }

  public getInfoFor(path: string){
      this.infoService.setDescMsg($(this.docDocument).find("td[title='" + path.replace(/\.[0-9]*\./g,'.{i}.') + "']").nextAll().eq(2)[0].innerHTML);
  }

  public getValues(leafs: Array<TreeLeaf>){
    let headers = new Headers();
    headers.append("SOAPAction", "urn:telekom-de:device:TO_InternetGatewayDevice:2#GetParameterValues");
    headers.append("content-type", "text/xml");
    let options = new RequestOptions({
      headers: headers
    });
    this.http
      .post(this.settingsService.getTargetUrl(),Soap.getValuesMessage(leafs),options)
      .subscribe(rsp=>Soap.getValuesCallback(rsp.text(),leafs));

  //TODO Error handling
  }

  public setValues(leafs: Array<TreeLeaf>, values: Array<any>){
    let headers = new Headers();
    headers.append("SOAPAction", "urn:telekom-de:device:TO_InternetGatewayDevice:2#SetParameterValues");
    headers.append("content-type", "text/xml");
    let options = new RequestOptions({
      headers: headers
    });
    this.http
      .post(this.settingsService.getTargetUrl(),Soap.setValuesMessage(leafs,values),options)
      .subscribe(rsp=>console.log(rsp));
    //TODO Response Handling
  }

  public addObject(obj: any, node: TreeNode){
    let headers = new Headers();
    headers.append("SOAPAction", "urn:telekom-de:device:TO_InternetGatewayDevice:2#AddObject");
    headers.append("content-type", "text/xml");
    let options = new RequestOptions({
      headers: headers
    });
    this.http
      .post(this.settingsService.getTargetUrl(),Soap.addObjectMessage(obj),options)
      .subscribe(rsp=>{console.log(rsp); this.getParameterNames(node)});
    //TODO Response Handling
  }

  public delObject(obj: any, node: TreeNode){
    let headers = new Headers();
    headers.append("SOAPAction", "urn:telekom-de:device:TO_InternetGatewayDevice:2#DeleteObject");
    headers.append("content-type", "text/xml");
    let options = new RequestOptions({
      headers: headers
    });
    this.http
      .post(this.settingsService.getTargetUrl(),Soap.delObjectMessage(obj),options)
      .subscribe(rsp=>{console.log(rsp); this.getParameterNames(node)});
    //TODO Response Handling
  }

  public reboot(){
    let conf = confirm("Reboot now?");
    if(!conf)
      return;
    let headers = new Headers();
    headers.append("SOAPAction", "urn:telekom-de:device:TO_InternetGatewayDevice:2#Reboot");
    headers.append("content-type", "text/xml");
    let options = new RequestOptions({
      headers: headers
    });
    this.http
      .post(this.settingsService.getTargetUrl(),Soap.rebootMessage(),options)
      .subscribe(rsp=>console.log(rsp));
    //TODO Response Handling
  }

  public reset(){
    let conf = confirm("Reset now?");
    if(!conf)
      return;
    let headers = new Headers();
    headers.append("SOAPAction", "urn:telekom-de:device:TO_InternetGatewayDevice:2#FactoryReset");
    headers.append("content-type", "text/xml");
    let options = new RequestOptions({
      headers: headers
    });
    this.http
      .post(this.settingsService.getTargetUrl(),Soap.factoryResetMessage(),options)
      .subscribe(rsp=>console.log(rsp));
    //TODO Response Handling
  }


  public get loaded(){
    return this._loaded;
  }

  public getActiveNode(){
    return this._activeNode.asObservable();
  }

  public setActiveNode(value: TreeNode) {
    $('html, body').animate({ scrollTop: 0 }, 'fast');

    if(value)
      this._activeNode.next(value);
  }

  public jumptonode(node: TreeNode){
    this.router.navigate(["/list"]);
    return this.setActiveNode(node);
  }

  public search(path: string){
    let node = this.findNode(path);

    if(node){
      return this.jumptonode(node);
    }else{
      let leaf = this.findLeaf(path);
      if(leaf){
        return this.jumptonode(leaf.parent);
      }else{
        let modnode = this.findNode(path+'.');
        if(modnode){
          return this.jumptonode(modnode);
        }
      }
    }

    this.infoService.setInfoMsg("Not found.")
  }

  public findLeaf(path: string): TreeLeaf{
    return this._rootNode.find(path.trim().split('.'));
  }

  public findNode(path: string): TreeNode{
    return this._rootNode.findNode(path.trim().split('.'));
  }
}
