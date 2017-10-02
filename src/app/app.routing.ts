import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './page/home/home.component';
import {ListComponent} from "./page/list/list.component";
import {FavoritesComponent} from "./page/favorites/favorites.component";
import {SettingsComponent} from "./page/settings/settings.component";

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: '*', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'list', component: ListComponent },
  { path: 'list/:node?', component: ListComponent },
  { path: 'favs', component: FavoritesComponent },
  { path: 'conf', component: SettingsComponent }
];

export const routing = RouterModule.forRoot(routes);

export const routeHelper = ['/home','/list','/favs','conf'];
