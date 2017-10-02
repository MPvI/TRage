import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

import {DataService} from "../../shared/service/data.service";
import {FavoriteService} from "../../shared/service/favorite.service";
import {InfoService} from "../../shared/service/info.service";

import {TreeNode} from "../../shared/class/tree/tree-node";
import {TreeLeaf} from "../../shared/class/tree/tree-leaf";
import {Favorite} from "../../shared/class/helper/favorite";

@Component({
  selector: 'my-home',
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.scss']
})
export class ListComponent implements OnInit {

  public displayNode: TreeNode;
  private showMenu: boolean = false;

  constructor(public dataService: DataService, private infoService: InfoService) {
  }

  ngOnInit() {
    this.dataService.getActiveNode().subscribe(
      rsp => {
        let init = this.displayNode==null;
        this.displayNode = rsp;
        if(init && this.displayNode && this.displayNode.subNodes.length > 0 && this.displayNode.subNodes[0].name == "Device"){
          this.dataService.setActiveNode(this.displayNode.subNodes[0]);
        }
      }
    );
  }

  public remove(){
    if(!this.displayNode.subNodes[0]){
      this.infoService.setInfoMsg("Nothing to delete here");
      return null;
    }
    let instance = prompt("Instance number:");
    return this.displayNode.fullPath + instance + '.'
  }

  public toggleMenu(e: MouseEvent){
    e.stopPropagation();
    this.showMenu = !this.showMenu;
  }

  public smartToggle(){
    this.showMenu ? this.showMenu = false : this.dataService.setActiveNode(this.displayNode.parent);
  }
}
