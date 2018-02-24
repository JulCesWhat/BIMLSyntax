import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';

import { environment } from './../../../environments/environment';

@Injectable()
export class EditorService {

  private _backEndUrl = environment.API_HOST + ":" + environment.API_PORT;

  constructor(private httpClient: HttpClient) { }

  public handleError(error: HttpErrorResponse) {
    console.log("Got an error");
    return Observable.throw(error.message || 'Server error');
  }


  //Simple examples for calling the server
  serverCall(url:string , params:any) {
    console.log("callServer() is being called");

    return this.httpClient.post(this._backEndUrl + url, JSON.stringify(params)).catch(this.handleError).toPromise();
  }

}
