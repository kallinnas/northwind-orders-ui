import { Injectable } from '@angular/core';
import { Order } from '../models/order.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { AppService } from './app.service';

@Injectable({ providedIn: 'root' })
export class OrderService {

  private baseOrdersURL = `${environment.baseURL}/Orders`;

  orders$ = this.http.get<Order[]>(`${this.baseOrdersURL}`);

  constructor(
    private http: HttpClient,
    private appService: AppService
  ) { }

  createOrder(order: any): any {
    const _order = {
      customerID: order.customer.customerID,
      employeeID: order.employee.employeeID,
      orderDate: this.appService.converDate(order.orderDate),
      shipperID: order.shipper.shipperID,
      orderDetails: order.orderDetails.map((detail: any) => ({ productID: detail.product.productID, quantity: detail.quantity }))
    }

    return this.http.post<Order>(`${this.baseOrdersURL}/Create`, _order);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseOrdersURL}/${id}`).pipe(
      catchError(error => {
        return throwError(() => new Error('There is no order with order id ' + id));
      })
    );
  }

  updateOrder(order: any): any {
    return this.http.put<Order>(`${this.baseOrdersURL}/Update/${order.orderID}`, order);
  }

}
