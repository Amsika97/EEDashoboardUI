import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AssessmentServiceService {
  private apiUrl =
    environment.BASE_URL + '/ee-dashboard/api/v1/user/profile/details/';

  constructor(private http: HttpClient) {}

  getAssessmentList(objectId: any, profileType: any): Observable<any[]> {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}'); // Parse the userInfo JSON string from sessionStorage
    // const oid = userInfo?.idTokenClaims?.oid;
    return this.http.get<any[]>(this.apiUrl + objectId + '/' + profileType);
  }
}
