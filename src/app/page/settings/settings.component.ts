import {Component, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {SettingsService} from "../../shared/service/settings.service";
import {DataService} from "../../shared/service/data.service";

@Component({
  selector: 'my-home',
  templateUrl: 'settings.component.html',
  styleUrls: ['settings.component.scss']
})
export class SettingsComponent{

  constructor(public settingsService: SettingsService) {
    // Do stuff
  }

  public save(){
    this.settingsService.save();
  }

}
