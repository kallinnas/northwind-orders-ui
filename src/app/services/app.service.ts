import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShipperService } from './shipper.service';
import { CustomerService } from './customer.service';
import { EmployeeService } from './employee.service';
import { ProductService } from './product.service';
import { Customer } from '../models/customer.model';
import { Employee } from '../models/employee.model';
import { Product } from '../models/product.model';
import { Shipper } from '../models/shipper.model';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  products: Product[] = [];
  customers: Customer[] = [];
  employees: Employee[] = [];
  shippers: Shipper[] = [];

  constructor(
    private snackbar: MatSnackBar,
    private productService: ProductService,
    private shipperService: ShipperService,
    public customerService: CustomerService,
    private employeeService: EmployeeService,
    private datePipe: DatePipe,
  ) {
    this.loadDropdownData();
  }

  showSnackbar(message: string) {
    this.snackbar.open(message, "", { duration: 3000 });
  }

  converDate(date: any) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  private loadDropdownData(): void {
    try {
      this.productService.products$.subscribe(products => this.products = products);
      this.customerService.customers$.subscribe(customers => this.customers = customers);
      this.employeeService.employees$.subscribe(employees => this.employees = employees);
      this.shipperService.shippers$.subscribe(shippers => this.shippers = shippers);
    }

    catch (err) {
      this.showSnackbar('Server is unavailable.');
    }
  }

  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error) {
      // Backend error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    } else {
      // Network error or other issues
      errorMessage = `Error: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }

}
