import {TreeLeaf} from "../tree/tree-leaf";
import {FavoriteService} from "../../service/favorite.service";
export class Favorite {
  private _myLeafs: Array<TreeLeaf>;
  private _name: string;

  constructor(name: string, private favSvc: FavoriteService, leafs?: Array<TreeLeaf>){
    this._name = name;
    if(leafs)
      this._myLeafs=leafs;
    else
      this._myLeafs = [];
  }

  public add(leaf: TreeLeaf){
    this._myLeafs.push(leaf);
    this.favSvc.save();
  }

  public rem(leaf: TreeLeaf){
    let i = this._myLeafs.indexOf(leaf);
    if(i !== -1)
      this._myLeafs.splice(i,1);
  }

  public has(leaf: TreeLeaf){
    return this._myLeafs.indexOf(leaf)!=-1;
  }

  public toggle(leaf: TreeLeaf){
    if(this.has(leaf)){
      this.rem(leaf);
    }else{
      this.add(leaf);
    }
  }

  get name(){
    return this._name;
  }

  get myLeafs(){
    return this._myLeafs;
  }

  public saveRep(){
    let favString = [];
    for(let i = 0; i < this._myLeafs.length; i++){
      favString.push(this._myLeafs[i].fullPath);
    }
    return {
      name: this._name,
      items: favString,
    }
  }
}
