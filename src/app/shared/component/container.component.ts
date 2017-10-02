/**
 * Created by sleep on 30.05.2017.
 */
import {Component, Input} from "@angular/core";
import {FavoriteService} from "../service/favorite.service";
import {TreeLeaf} from "../class/tree/tree-leaf";
import {DataService} from "../service/data.service";
@Component({
  selector: 'my-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})

export class ContainerComponent {
  @Input() leaf: TreeLeaf;
  valueMenu: boolean = false;

  constructor(public favoriteService: FavoriteService, public dataService: DataService){
  }

  toggleMenu(e: MouseEvent): void {
    e.stopPropagation();
    this.valueMenu = !this.valueMenu;
  }
}
