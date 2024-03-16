import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map  } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServicioArticuloService {

  url_principal            = `${environment.base_url}/inventario-articulo`;
  url_unidad               = `${environment.base_url}/catalogo-unidad`;
  
  constructor(private http: HttpClient) { }
  
  CatalogoUnidad():Observable<any> {
    return this.http.get<any>(this.url_unidad, {}).pipe(
      map( response => {
        return response;
      })
    );
  }
  
  obtenerLista(payload):Observable<any> {
    return this.http.get<any>(this.url_principal, {params: payload}).pipe(
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
}
