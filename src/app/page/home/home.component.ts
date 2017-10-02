import { Component, OnInit } from '@angular/core';
import {DataService} from "../../shared/service/data.service";

@Component({
  selector: 'my-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss']
})
export class HomeComponent {

  public showInfo = false;

  constructor(public dataService: DataService) {
    // Do stuff
  }

  public toggleInfo(){
    this.showInfo = !this.showInfo;
  }
}
