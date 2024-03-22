import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpBackend } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map  } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServicioArticuloService {
  private api: string
  private http_upload: HttpClient;
  
  url_principal            = `${environment.base_url}/inventario-articulo`;
  url_unidad               = `${environment.base_url}/catalogo-unidad`;
  url_imagen               = `${environment.base_url}/subir-imagen`;
  url_ver_imagen           = `${environment.base_url}/ver-imagen`;
  
  constructor( handler: HttpBackend, private http: HttpClient) {
    //To ignore interceptor
    this.http_upload = new HttpClient(handler);
    this.api = environment.base_url;
  }
  
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

  SubirImagen(data:any,file:File): Observable<any>{
    const formData: FormData = new FormData();

    formData.append('archivo', file, file.name);

    formData.append('id', data.articulo_id);

    //let token = localStorage.getItem('token');
    let headers = new HttpHeaders().set(
      "Authorization",'Bearer '+localStorage.getItem("token"),
    );
    headers.append('Content-Type','application/x-www-form-urlencoded;charset=UTF-8');
    headers.append('Access-Control-Allow-Origin','*');
    return this.http_upload.post(this.url_imagen, formData, { headers:headers}); 
  }

  verImagen(payload):Observable<any> {
    return this.http.get<any>(this.url_ver_imagen, {params: payload}).pipe(
      map( response => {
        return response;
      })
    );
  }
}
