import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
@Injectable()
export class InfoService {
  private _showInfo: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public infoMsg: string = '';

  private _showError: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public errorMsg: string = '';

  private _showDesc: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public descMsg: any = {};

  constructor(){
  }

  public getInfoState(){
    return this._showInfo.asObservable();
  }

  public getErrorState(){
    return this._showError.asObservable();
  }

  public getDescState(){
    return this._showDesc.asObservable();
  }

  public setDescMsg(msg: any){
    this.descMsg = msg;
    this._showDesc.next(true);
  }

  public closeDescMsg(){
    this._showDesc.next(false);
  }

  public setInfoMsg(msg: string){
    this.infoMsg = msg;
    this._showInfo.next(true);
    setTimeout(()=>this._showInfo.next(false),3000);
  }

  public setErrorMsg(msg: string){
    this.errorMsg = msg;
    this._showError.next(true);
  }

  public clearError(){
    this._showError.next(false);
  }

  public clearInfo(){
    this._showInfo.next(false);
  }
}
