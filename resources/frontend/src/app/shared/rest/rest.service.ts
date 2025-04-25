import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  url = `${environment.base_url}/`;

  constructor(private http: HttpClient) { }

  get(path, payload): Observable<any> {
    return this.http.get<any>(this.url + path, { params: payload }).pipe(
      map(response => {
        return response;
      })
    );
  }

  get_id(path, id, payload): Observable<any> {
    return this.http.get<any>(this.url + path + "/" + id, { params: payload }).pipe(
      map(response => {
        return response;
      })
    );
  }

  get_file(path, id): Observable<any> {
    return this.http.get<any>(this.url + path + "/" + id, { params: {}, responseType: 'blob' as 'json' }).pipe(
      map(response => {
        return response;
      })
    );

  }

  post(path, payload): Observable<any> {
    return this.http.post<any>(this.url + path, { params: payload }).pipe(
      map(response => {
        return response;
      })
    );
  }

  put(path, id, payload): Observable<any> {
    return this.http.put<any>(this.url + path + "/" + id, { params: payload }).pipe(
      map(response => {
        return response;
      })
    );
  }

  delete(path, id): Observable<any> {
    return this.http.delete<any>(this.url + path + "/" + id, {}).pipe(
      map(response => {
        return response;
      })
    );
  }

}
