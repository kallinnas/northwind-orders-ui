import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Employee } from '../models/employee.model';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseProductsURL = `${environment.baseURL}/Products`;

  products$ = this.http.get<Product[]>(`${this.baseProductsURL}`);

  constructor(private http: HttpClient) { }
}
