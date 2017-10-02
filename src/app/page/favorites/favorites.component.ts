import {Component, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {FavoriteService} from "../../shared/service/favorite.service";
import {Favorite} from "../../shared/class/helper/favorite";
import {TreeLeaf} from "../../shared/class/tree/tree-leaf";

@Component({
  selector: 'my-home',
  templateUrl: 'favorites.component.html',
  styleUrls: ['favorites.component.scss']
})
export class FavoritesComponent implements OnInit {

  public favoriteList: Array<Favorite>;
  private displayFavorite: Favorite;

  constructor(private favoriteService: FavoriteService) {
    //NOOP
  }

  ngOnInit() {
    this.favoriteService.getActiveFav().subscribe(
      rsp => this.displayFavorite = rsp
    );
    this.favoriteService.getFavs().subscribe(
      rsp => this.favoriteList = rsp
    );
  }

  private newFav(){
    let name = prompt("Provide name for new favorite:","myFav");
    this.favoriteService.add(name);
  }

  private delFav(){
    if(!this.displayFavorite) return;
    let sel = confirm("Really delete "+this.displayFavorite.name+" ?");
    if(sel){
      this.favoriteService.del(this.displayFavorite);
    }
  }

  public toggle(leaf: TreeLeaf,e: MouseEvent){
    e.stopPropagation();
    if(this.displayFavorite.has(leaf)){
      this.displayFavorite.rem(leaf);
    }else{
      this.displayFavorite.add(leaf);
    }
  }
}
