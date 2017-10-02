import { enableProdMode } from '@angular/core';
import { AppModuleNgFactory } from '../aot/src/app/app.module.ngfactory';
import { environment } from './environments/environment';
import { platformBrowser } from "@angular/platform-browser";
if (environment.production) {
    enableProdMode();
}
platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
//# sourceMappingURL=main.js.map