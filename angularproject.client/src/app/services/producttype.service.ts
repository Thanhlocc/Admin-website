import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Producttype {
  type_id: number;
  type_name: string;

}
@Injectable({
  providedIn: 'root'
})
export class ProducttypeService {

  constructor(private http: HttpClient) { }
  getProducttypes() {
    return this.http.get<[Producttype]>('https://localhost:7106/ProductType');
  }
  addProducttype(producttype: Producttype): Observable<Producttype> {
    return this.http.post<Producttype>('https://localhost:7106/Producttype', producttype)
  }
}
