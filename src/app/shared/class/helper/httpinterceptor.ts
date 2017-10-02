import {Injectable} from "@angular/core";
import { XHRBackend, ConnectionBackend, RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {Md5} from 'ts-md5/dist/md5';
import {SettingsService} from "../../service/settings.service";

@Injectable()
export class InterceptedHttp extends Http {
  private setting: SettingsService;

  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, settings: SettingsService) {
    super(backend, defaultOptions);
    this.setting = settings;
}

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return super.request(url, options);
  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return super.get(url, this.getRequestOptionArgs(options));
  }

  post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    console.log(body);
    return super.post(url, body, this.getRequestOptionArgs(options)).catch((e) => {
      if(e.status == 401){
        let ah = e.headers.get('www-authenticate').split(',');
        ah = ah.map((a)=>a.split('=')[1].replace(/"/g,''));
        let ha1 = Md5.hashStr("dslf-config:"+ah[0]+":"+this.setting.activeSetting().pwd);
        let ha2 = Md5.hashStr("POST:"+url);
        let rsp = Md5.hashStr(ha1+":"+ah[1]+":"+ha2);
        console.log(ha1,ha2,rsp);
        options = this.getRequestOptionArgs(options);
        options.headers.append("Authorization", "Digest "+rsp);
        return super.post("https://dslf-config:"+this.setting.activeSetting().pwd+"@"+url.replace("https://",""),body,options);
      }
      return Observable.throw(e);
    });
  }

  put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return super.put(url, body, this.getRequestOptionArgs(options));
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return super.delete(url, this.getRequestOptionArgs(options));
  }

  private getRequestOptionArgs(options?: RequestOptionsArgs) : RequestOptionsArgs {
    if (options == null) {
      options = new RequestOptions();
    }
    if (options.headers == null) {
      options.headers = new Headers();
    }
    options.headers.append('Content-Type', 'application/json');

    return options;
  }
}

export function httpFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions, setting: SettingsService): Http {
  return new InterceptedHttp(xhrBackend, requestOptions, setting);
}
