import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Supplier {
  supplier_id: number;
  supplier_name: string;
  
}
@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  constructor(private http: HttpClient) { }
  getSuppliers() {
    return this.http.get<Supplier[]>('https://localhost:7106/Supplier');
  }
  addSupplier(supplier: Supplier): Observable<Supplier>
  {
    return this.http.post<Supplier>('https://localhost:7106/Supplier',supplier)
  }
}
