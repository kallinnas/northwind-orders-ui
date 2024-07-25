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
    // const _date = new Date(date);
    // const utcDate = new Date(Date.UTC(_date.getFullYear(), _date.getMonth(), _date.getDate()));
    // return formatDate(utcDate, 'yyyy-MM-ddTHH:mm:ss.SSSZ', 'en-US');
  }

  private loadDropdownData(): void {
    this.productService.products$.subscribe(products => this.products = products);
    this.customerService.customers$.subscribe(customers => this.customers = customers);
    this.employeeService.employees$.subscribe(employees => this.employees = employees);
    this.shipperService.employees$.subscribe(shippers => this.shippers = shippers);
  }
}
