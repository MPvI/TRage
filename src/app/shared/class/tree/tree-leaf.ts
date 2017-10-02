import {TreeNode} from "./tree-node";
import {DataService} from "../../service/data.service";
import {BehaviorSubject} from "rxjs";

export class TreeLeaf{
  private _parent: TreeNode = null;

  private _name: string;
  private _location: string;

  private _type: string;
  private _writable: boolean;
  private _value: BehaviorSubject<any>;

  public status = 0;

  constructor(obj:any, name: string, parent: TreeNode, private dataService: DataService ){
    this._parent = parent;
    this._name = name;
    this._location = parent.fullPath;
    this._writable = obj == '1';
    this._value = new BehaviorSubject<any>("");
  }

  get parent(){
    return this._parent;
  }

  get writable(){
    return this._writable;
  }

  get fullPath(): string {
    return this._location + this._name;
  }

  get name(): string {
    return this._name;
  }

  get value(){
    return this._value.asObservable();
  }

  set value(v){
    this._value.next(v);
  }

  get type(){
    return this._type;
  }

  set type(t){
    this._type = t;
  }

  public query(): void{
    this.status = 1;
    this.dataService.getValues([this]);
  }

  public send(v: any): void{
    this.status = 1;
    this.dataService.setValues([this],[v]);
  }

  public export(){
    return this._value.getValue;
  }
}
