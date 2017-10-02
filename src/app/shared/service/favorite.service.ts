import {Injectable} from "@angular/core";
import {Favorite} from "../class/helper/favorite";
import {BehaviorSubject} from "rxjs";
import {DataService} from "./data.service";

@Injectable()
export class FavoriteService {

  private _favorites: BehaviorSubject<Array<Favorite>> = new BehaviorSubject<Array<Favorite>>([]);
  private _activeFav: BehaviorSubject<Favorite> = new BehaviorSubject<Favorite>(null);

  public getFavs(){
    return this._favorites.asObservable();
  }

  public getActiveFav(){
    return this._activeFav.asObservable();
  }

  public setActiveFav(fav: Favorite){
    this._activeFav.next(fav);
  }

  public add(name: string){
    if(name && name !== '')
      this._favorites.value.push(new Favorite(name,this));
    this.save();
  }

  public del(fav: Favorite){
    let i = this._favorites.value.indexOf(fav);
    if(i !== -1)
      this._favorites.value.splice(i,1);
    this.save();
    this.setActiveFav(null);
  }

  public save(){

    let favs: Array<any> = [];
    for(let i = 0; i < this._favorites.value.length; i++){
      favs.push(this._favorites.value[i].saveRep());
    }
    localStorage.setItem("favorites",JSON.stringify(favs));
  }

  public load(dataService: DataService){
    let loaded = JSON.parse(localStorage.getItem("favorites"));
    if(loaded){
      for(let i = 0; i < loaded.length; i++){
        let leafArray = [];
        for(let leafPath of loaded[i].items){
          leafArray.push(dataService.findLeaf(leafPath));
        }
        this._favorites.value.push(new Favorite(loaded[i].name,this,leafArray))
      }
      this._activeFav.next(this._favorites.value[0]);
    }

  }
}
