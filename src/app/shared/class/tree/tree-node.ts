import {TreeLeaf} from "./tree-leaf";
import {DataService} from "../../service/data.service";

export class TreeNode{
  private _parent: TreeNode = null;

  private _name: string;
  private _location: string;

  private _subNodes: Array<TreeNode>;
  private _subLeafs: Array<TreeLeaf>;

  constructor(tree: any, name: string, parent: TreeNode, private dataService: DataService){
    this._parent = parent;

    this._name = name;
    this._location = parent ? parent.fullPath : '';

    this._subNodes = [];
    this._subLeafs = [];

    if(typeof tree !== 'object')return;

    for(let key of Object.keys(tree)){
      if(typeof tree[key] == 'object'){
        this._subNodes.push(new TreeNode(tree[key],key,this,dataService));
      }else{
        this._subLeafs.push(new TreeLeaf(tree[key],key,this,dataService));
      }
    }
  }

  get fullPath(): string{
    return this._location + this._name + (this._name !== '' ? '.' : '')
  }

  get subNodes(): Array<TreeNode>{
    return this._subNodes;
  }

  get subLeafs(): Array<TreeLeaf>{
    return this._subLeafs;
  }

  get parent(): TreeNode {
    return this._parent;
  }

  get name(): string {
    return this._name;
  }

  public query(){
    this.dataService.getValues(this._subLeafs);
  }

  public find(p: Array<string>): any {
    for(let subNode of this._subNodes){
      if(subNode.name === p[0]){
        return subNode.find(p.slice(1));
      }
    }
    for(let subLeaf of this._subLeafs){
      if(subLeaf.name === p[0]){
        return subLeaf;
      }
    }
    return null;
  }

  public findNode(p: Array<string>): any{
    if(p[0]==""){
      return this;
    }
    for(let subNode of this._subNodes){
      if(subNode.name === p[0]){
        return subNode.findNode(p.slice(1));
      }
    }
    return null;
  }
}
