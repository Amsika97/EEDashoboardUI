import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../environments/environment';
import { Subject, debounceTime } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class HTTPService {
  filterAccount:Subject<any> = new Subject()
  filterProject:Subject<any> = new Subject()

  passFilterValue(data:any){
    this.filterAccount.next(data)
  }

  passFilterValueForProject(data:any){
    this.filterProject.next(data)
  }
  
  submittedBoolean:boolean = false;
  constructor(private httpClient: HttpClient) {}

  passValue(data:any){
    //this.submittedBoolean.next(data)
  }

  httpRequest(url: string, method: string, body?: any) {
    // this.auditCall(auditPayload).subscribe(data=>console.log(data)
    // )
    return this.httpClient.request(
      method,
      environment.BASE_URL! + url,
      body ? { body } : {}
    );
  }

  // auditCall(auditPayload:any){
  //   const body={
  //     body:auditPayload
  //   }
  //   return this.httpClient.request(
  //     "POST",
  //     environment.BASE_URL! + "/ee-dashboard/api/v1/audit/save",
  //     body.body ? { body } : {}
  //   );
  // }

  getFileDownLoad(url: string) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };

    return this.httpClient.get(url, httpOptions);
  }

  login(url:string,data:any){
    return this.httpClient.post(environment.BASE_URL+url, data)
  }

  getLoginDetails(url:string,data:any){
    return this.httpClient.post(environment.BASE_URL+url, data)
  }

  dashboardFilter(url:string,data:any){
    return this.httpClient.post(environment.BASE_URL+url,data)
  }

  getTemplate(url: any){
    return this.httpClient.get<any[]>(url);
  }
}
