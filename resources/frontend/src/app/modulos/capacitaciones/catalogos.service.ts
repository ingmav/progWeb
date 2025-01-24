import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map  } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {

  private url_principal            = `${environment.base_url}/`;
  private url_capacitacion         = `${environment.base_url}/capacitacion`;
  private url_rel_puesto_cap       = `${environment.base_url}/rel-puesto-capacitacion`;
  
  constructor(private http: HttpClient) { }
  
  Listar(api, payload):Observable<any> {
    return this.http.get<any>(this.url_principal+api, {params: payload}).pipe(
      map( response => {
        return response;
      })
    );
  }
  Editar(api,id, payload):Observable<any> {
    return this.http.put<any>(this.url_principal+api+"/"+id, {params: payload}).pipe(
      map( response => {
        return response;
      })
    );
  }
  
  Buscar(api,id, payload):Observable<any> {
    return this.http.get<any>(this.url_principal+api+"/"+id, {params: payload}).pipe(
      map( response => {
        return response;
      })
    );
  }

  Guardar(api, payload):Observable<any> {
    return this.http.post<any>(this.url_principal+api, {params: payload}).pipe(
      map( response => {
        return response;
      })
    );
  }

  Eliminar(api,id, payload):Observable<any> {
    return this.http.delete<any>(this.url_principal+api+"/"+id, {params: payload}).pipe(
      map( response => {
        return response;
      })
    );
  }
  
  CargarCapacitaciones():Observable<any> {
    return this.http.get<any>(this.url_capacitacion, {}).pipe(
      map( response => {
        return response;
      })
    );
  }

  guardarPuestoCapacitacion(id, payload):Observable<any> {
    return this.http.put<any>(this.url_rel_puesto_cap+"/"+id, {params: payload}).pipe(
      map( response => {
        return response;
      })
    );
  }
}
