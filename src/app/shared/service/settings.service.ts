import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {InfoService} from "./info.service";

@Injectable()
export class SettingsService {

  public activeProfile = 0;

  private _settings: BehaviorSubject<Array<Setting>> = new BehaviorSubject<Array<Setting>>([]);

  constructor(){
  }

  //

  public getTargetUrl(){
    return 'https://dslf-config:' + this.activeSetting().pwd + '@' + this.activeSetting().baseURL;
  }

  public get settings() {
    return this._settings.asObservable();
  }

  public activeSetting(){
    return this._settings.getValue()[this.activeProfile];
  }

  public save(){
    localStorage.setItem("settings",JSON.stringify(this._settings.getValue()));
  }

  public load(){
    let loaded = JSON.parse(localStorage.getItem("settings"));

    if(loaded)
      this._settings.next(loaded);
  }

  public switchBase(n: number){
    if(n < this._settings.getValue().length){
      this.activeProfile = n;
    }
  }

  public setBase(devInfo: any){
    for(let i = 0; i<this._settings.getValue().length; i++){
      if(this._settings.getValue()[i].id.valueOf() === devInfo.device.UDN.text.valueOf()){
        this._settings.getValue()[i].deviceInfo = devInfo;
        this._settings.getValue()[i].baseURL = devInfo.URLBase.text.slice(devInfo.URLBase.text.indexOf('://')+3);
        this.activeProfile = i;
        return;
      }
    }
    this._settings.getValue().push({ id: devInfo.device.UDN.text , pwd: prompt("Please enter the device password:"), deviceInfo: devInfo, baseURL: devInfo.URLBase.text.slice(devInfo.URLBase.text.indexOf('://')+3)});
    this._settings.next(this._settings.getValue());
    this.activeProfile = this._settings.getValue().length-1;
  }
}

interface Setting {
  id: string,
  pwd: string,
  deviceInfo: any,
  baseURL: string
}
