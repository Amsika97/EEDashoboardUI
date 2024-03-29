import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private httpClient: HttpClient) {}

  httpRequest(url: string, methodType: string, body: any) {
    if (methodType === 'GET') {
      return this.httpClient.get(url + body);
    } else if (methodType === 'POST') {
      return this.httpClient.post(url, body);
    } else if (methodType === 'PUT') {
      return this.httpClient.put(url, body);
    }
    return this.httpClient.delete(url, body);
  }
}
