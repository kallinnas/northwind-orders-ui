import { Component } from '@angular/core';
import { Order } from '../../models/order.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';

import { MatDialog } from '@angular/material/dialog';
import { OrderDetails } from '../../models/order-details.model';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { AppService } from '../../services/app.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-update-order',
  templateUrl: './update-order.component.html',
  styleUrl: './update-order.component.css'
})
export class UpdateOrderComponent {
  orderForm: any;
  order!: Order;
  unitPrice: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    // private route: ActivatedRoute,
    private orderService: OrderService,
    public appService: AppService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.resetOrderForm();
  }


  ngOnInit(): void {

  }

  loadOrder() {
    if (this.orderID) {

      this.orderService.getOrderById(this.orderID)
        .pipe(tap(() => this.resetOrderForm())).subscribe({
          next: order => {
            this.order = order
            this.createForm();
          },
          error: err => {
            this.appService.showSnackbar('There is no order with order id ' + this.orderID);
          }
        });
    }
  }

  createForm() {
    try {
      this.orderForm.patchValue({
        orderID: this.order.orderID,
        customer: this.appService.customers.find(c => c.customerID == this.order.customer.customerID),
        employee: this.appService.employees.find(c => c.employeeID == this.order.employee.employeeID),
        orderDate: this.order.orderDate,
        shipper: this.appService.shippers.find(c => c.shipperID == this.order.shipper.shipperID)
      });

      this.order.orderDetails.forEach(detail => {
        this.orderDetails.push(this.createOrderDetailGroup(detail));
      });
    }

    catch (err) {
      console.log(err);
    }
  }

  createOrderDetailGroup(detail: OrderDetails): any {
    try {
      return this.formBuilder.group({
        product: [detail.productID, Validators.required],
        quantity: [detail.quantity, [Validators.required, Validators.min(1)]],
        unitPrice: [{ value: this.appService.products.find(p => p.productID == detail.productID)?.price, disabled: true }, Validators.required]
      });
    }

    catch (err) {
      console.log(err);
    }
  }

  updateUnitPrice(index: number, productId: number = 0): void {
    const detail = this.orderDetails.at(index);
    const productID = productId == 0 ? detail.get('product')?.value : productId;
    const quantity = detail.get('quantity')?.value;

    if (productID && quantity) {
      const product = this.appService.products.find(p => p.productID === productID);
      if (product?.price != undefined) {
        this.unitPrice = product.price * quantity;
      }
      detail.get('unitPrice')?.setValue(this.unitPrice, { emitEvent: false });

    }
  }



  addOrderDetail() {
    this.orderDetails.push(this.createOrderDetailGroup({ orderDetailID: 0, product: 0, quantity: 1, unitPrice: 0 } as OrderDetails));
  }

  removeOrderDetail(index: number) {
    this.orderDetails.removeAt(index);
  }

  openConfirmDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { message: 'Are you sure you want to save the changes?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveChanges();
      }
    });
  }

  saveChanges() {
    const order = {
      orderID: this.orderForm.value.orderID,
      customerID: this.orderForm.value.customer.customerID,
      employeeID: this.orderForm.value.employee.employeeID,
      orderDate: this.orderForm.value.orderDate,
      shipperID: this.orderForm.value.shipper ? this.orderForm.value.shipper.shipperID : null,
      orderDetails: this.orderForm.value.orderDetails.map((detail: any) => ({
        productID: detail.product,
        quantity: detail.quantity
      }))
    };

    this.orderService.updateOrder(order).subscribe(() => {
      this.router.navigate(['/orders']);
    });
  }

  get orderID(): number { return this.orderForm.get('orderID').value; }
  get customerName(): string { return this.orderForm.get('customer').value.customerName; }

  get orderDetails(): FormArray { return this.orderForm.get('orderDetails') as FormArray; }

  private resetOrderForm() {
    this.orderForm = this.formBuilder.group({
      orderID: ['', Validators.required],
      customer: ['', Validators.required],
      employee: ['', Validators.required],
      orderDate: ['', Validators.required],
      shipper: ['', Validators.required],
      orderDetails: this.formBuilder.array([])
    });
  }

}
