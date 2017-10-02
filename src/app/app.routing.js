import { RouterModule } from '@angular/router';
import { HomeComponent } from './page/home/home.component';
import { ListComponent } from "./page/list/list.component";
import { FavoritesComponent } from "./page/favorites/favorites.component";
import { SettingsComponent } from "./page/settings/settings.component";
var routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '*', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'list', component: ListComponent },
    { path: 'list/:node?', component: ListComponent },
    { path: 'favs', component: FavoritesComponent },
    { path: 'conf', component: SettingsComponent }
];
export var routing = RouterModule.forRoot(routes);
export var routeHelper = ['/home', '/list', '/favs', 'conf'];
//# sourceMappingURL=app.routing.js.map