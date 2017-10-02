import {Component, ElementRef, OnInit} from '@angular/core';
import {Router} from "@angular/router";

import { routeHelper } from './app.routing';
import {DataService} from "./shared/service/data.service";
import {FavoriteService} from "./shared/service/favorite.service";
import {InfoService} from "./shared/service/info.service";

declare var Hammer: any;
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  public showInfo = false;
  public showError = false;
  public showDesc = false;
  private i: number;

  constructor(private dataService: DataService, private favoriteService: FavoriteService, public infoService: InfoService, private el:ElementRef, private router: Router) {
    this.i = 0;
  }


  ngOnInit(): void {

    this.infoService.getInfoState().subscribe((s)=>{
      this.showInfo = s;
    });

    this.infoService.getErrorState().subscribe((s)=>{
      this.showError = s;
    });

    this.infoService.getDescState().subscribe((s)=>{
      this.showDesc = s;
    });

    let hammer = new Hammer(document.body);
    hammer.on("swipeleft", ()=> {
      this.i++;
      if(this.i >= routeHelper.length)
        this.i = 0;
      this.router.navigate([routeHelper[this.i]])
    });
    hammer.on("swiperight", ()=> {
      this.i--;
      if(this.i < 0)
        this.i = routeHelper.length-1;
      this.router.navigate([routeHelper[this.i]])
    });
  }
}
