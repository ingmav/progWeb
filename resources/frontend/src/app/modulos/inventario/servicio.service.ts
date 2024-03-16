import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map  } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  url_principal            = `${environment.base_url}/inventario`;
  url_catalogos            = `${environment.base_url}/catalogos`;
  url_cardex               = `${environment.base_url}/cardex`;
  
  constructor(private http: HttpClient) { }
  
  obtenerLista(payload):Observable<any> {
    return this.http.get<any>(this.url_principal, {params: payload}).pipe(
      map( response => {
        return response;
      })
    );
  }
  obtenerCatalogos(payload):Observable<any> {
    return this.http.get<any>(this.url_catalogos, {params:payload}).pipe(
      map( response => {
        return response;
      })
    );
  }

  crearElemento(payload):Observable<any> {
    return this.http.post<any>(this.url_principal, {params: payload}).pipe(
      map( response => {
        return response;
      })
    );
  }

  eliminarElemento(id, payload):Observable<any> {
    return this.http.delete<any>(this.url_principal+"/"+id, {params: payload}).pipe(
      map( response => {
        return response;
      })
    );
  }

  editarElemento(id, payload):Observable<any> {
    return this.http.put<any>(this.url_principal+"/"+id, {params: payload}).pipe(
      map( response => {
        return response;
      })
    );
  }
  
  obtenerCardex(id, payload):Observable<any> {
    return this.http.get<any>(this.url_cardex+"/"+id, {params: payload}).pipe(
      map( response => {
        return response;
      })
    );
  }
}
