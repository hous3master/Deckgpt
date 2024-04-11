import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import config from '../../auth_config.json';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  ping$() {
    return this.http.get(`${config.apiUri}/api/external`);
  }
  
  test1$() {
    return this.http.get(`${config.apiUri}/api/test1`);
  }

  test2$(orderData: any) {
    return this.http.post(`${config.apiUri}/api/test2`, orderData);
  }
}
