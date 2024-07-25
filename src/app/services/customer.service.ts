import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private baseURL = `${environment.baseURL}`;

  customers$ = this.http.get<Customer[]>(`${this.baseURL}/Customers`);

  constructor(private http: HttpClient) { }
}
