import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Order } from '../../models/order.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { OrderService } from '../../services/order.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-display-orders',
  templateUrl: './display-orders.component.html',
  styleUrl: './display-orders.component.css'
})
export class DisplayOrdersComponent implements OnInit, OnDestroy {

  @ViewChild(MatSort) sort = new MatSort();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private subscription: Subscription[] = [];

  displayedColumns: string[] = ['employeeName', 'customerName', 'shipperName', 'orderDate', 'orderTotalPrice'];
  dataSource = new MatTableDataSource<Order>();
  totalOrders: number = 0;
  suggestions: string[] = [];



  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.subscription.push(
      this.orderService.orders$.subscribe({
        next: orders => {
          this.dataSource = new MatTableDataSource(orders);
          this.totalOrders = orders.length;
          this.updateSuggestions(orders);
          this.dataSource.paginator = this.paginator;
        },
        error: err => {
          console.error('Failed to load orders', err);
        }
      }));
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  updateSuggestions(orders: Order[]) {
    const employeeNames = orders.map(order => order.employee.firstName + ' ' + order.employee.lastName).filter(name => name !== undefined) as string[];
    const customerNames = orders.map(order => order.customer.customerName).filter(name => name !== undefined) as string[];
    this.suggestions = [...new Set([...employeeNames, ...customerNames])];
  }

  sortData(sort: Sort) {
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'orderDate': return this.compare(new Date(a.orderDate), new Date(b.orderDate), isAsc);
        default: return 0;
      }
    });
  }

  compare(a: string | number | Date, b: string | number | Date, isAsc: boolean) {
    return (a < b ? 1 : -1) * (isAsc ? 1 : -1);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

}
