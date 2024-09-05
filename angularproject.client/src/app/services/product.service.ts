import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Product {
  product_id: number;
  product_name: string;
  product_inventory: number;
  supplier_id: number;
  type_id: number;
  product_saleprice: number;
  product_inprice: number;  
  product_description: string;
  productImage: string;  
  product_warranty: string;  
  is_deleted: number;  

}
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProducts() {
    return this.http.get<Product[]>('https://localhost:7106/Product');
  }
  addProduct(productData: FormData): Observable<any>
  {
    return this.http.post<any>('https://localhost:7106/Product', productData);
  }
  deleteProduct(productId: number): Observable<any> {
    return this.http.put(`https://localhost:7106/Product/${productId}/delete`, { is_deleted: 1 })
  }
  getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(`https://localhost:7106/Product/${productId}`);
  }
  updateProduct(productId: number, formData: FormData) {
    return this.http.put(`https://localhost:7106/Product/${productId}`, formData);
  }
}
