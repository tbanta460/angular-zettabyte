import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  serverUrl: string = 'http://localhost:3500/';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(private HttpClient: HttpClient) {}

  getAll(): Observable<any> {
    return this.HttpClient.get(this.serverUrl + 'data');
  }

  createData(data: any): Observable<any> {
    return this.HttpClient.post(this.serverUrl + 'data', data);
  }
  removeData(id: any): Observable<any> {
    return this.HttpClient.delete(this.serverUrl + 'data/' + id);
  }
  updateData(id: any, newData: any): Observable<any> {
    return this.HttpClient.put(this.serverUrl + 'data/' + id, newData);
  }
}
