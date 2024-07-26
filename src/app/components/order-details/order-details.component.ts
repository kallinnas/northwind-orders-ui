import { Component } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent {

  order: any;
  orderId!: number;
  displayedColumns: string[] = [
    'productName',
    'quantity',
    'unitPrice',
    'totalProductPrice'
  ];

  constructor(
    private orderService: OrderService,
    private appService: AppService,
  ) { }

  ngOnInit(): void {

  }

  searchOrderDetails(): void {
    if (this.orderId) {
      this.orderService.getOrderDetails(this.orderId).subscribe(
        {
          next: (data: any) => {
            if (data) {
              this.order = data;
            }
          },
          error: (error: any) => {
            this.appService.showSnackbar('There is no order with order id ' + this.orderId);
            this.order = null;
          }
        }
      );
    }
  }

  getTotalPrice(): number {
    return this.order.orderDetails.reduce((acc: any, item: any) => acc + (item.unitPrice * item.quantity), 0);
  }
}
