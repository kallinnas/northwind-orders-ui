import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Employee } from '../models/employee.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private baseURL = `${environment.baseURL}`;

  employees$ = this.http.get<Employee[]>(`${this.baseURL}/Employees`);

  constructor(private http: HttpClient) { }
}
