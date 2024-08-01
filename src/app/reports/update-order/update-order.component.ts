import { Component } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { MatDialog } from '@angular/material/dialog';
import { OrderDetails } from '../../models/order-details.model';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { AppService } from '../../services/app.service'; ``

@Component({
  selector: 'app-update-order',
  templateUrl: './update-order.component.html',
  styleUrl: './update-order.component.css'
})
export class UpdateOrderComponent {

  orderForm: any;
  order: any;
  unitPrice: number = 0;

  get orderId(): number { return this.orderForm.get('orderID').value; }
  get orderDetailsFC(): FormArray { return this.orderForm.get('orderDetails') as FormArray; }

  constructor(
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    public appService: AppService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.resetOrderFC();
  }

  loadOrder() {
    try {
      if (this.orderId) {
        this.orderService.isOrderExists$(this.orderId).subscribe((exists) => {

          if (exists) {
            this.orderService.getOrderById$(this.orderId).subscribe({
              next: order => {
                this.order = order
                this.initialOrderFC();
              },

              error: err => {
                this.appService.showSnackbar('There is no order with order id ' + this.orderId);
                this.resetOrderFC();
                this.order = null;
              }
            });
          }

          else {
            this.appService.showSnackbar('There is no order with order id ' + this.orderId);
          }
        });
      }
    }

    catch (err) {
      console.log(err);
    }
  }

  initialOrderFC() {
    try {
      this.resetOrderFC();

      this.orderForm.patchValue({
        orderID: this.order.orderID,
        orderDate: this.order.orderDate,
        customer: this.appService.customers.find(c => c.customerID == this.order.customerID),
        employee: this.appService.employees.find(c => c.employeeID == this.order.employeeID),
        shipper: this.appService.shippers.find(c => c.shipperID == this.order.shipperID)
      });

      this.order.orderDetails.forEach((detail: OrderDetails) => {
        this.orderDetailsFC.push(this.createOrderDetailFormGroup(detail));
      });
    }

    catch (err) {
      console.log(err);
    }
  }

  private createOrderDetailFormGroup(detail: OrderDetails): any {
    try {
      return this.formBuilder.group({
        orderDetailID: [detail.orderDetailID],
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
    try {
      const detail = this.orderDetailsFC.at(index);
      const productID = productId || detail.get('product')?.value;
      const quantity = detail.get('quantity')?.value;
      const product = this.appService.products.find(p => p.productID === productID);
      const unitPrice = product?.price != undefined ? product.price * quantity : 0;
      detail.get('unitPrice')?.setValue(unitPrice);
    }

    catch (err) {
      console.log(err);
    }
  }

  addOrderDetail() {
    this.orderDetailsFC.push(this.createOrderDetailFormGroup({ orderDetailID: 0, product: 0, quantity: 1, unitPrice: 0 } as OrderDetails));
  }

  removeOrderDetail(index: number) {
    this.orderDetailsFC.removeAt(index);
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
    this.orderService.updateOrder(this.prepareOrderToUpdate()).subscribe(
      () => { this.router.navigate(['/orders']); });
  }

  private prepareOrderToUpdate() {
    return {
      orderID: this.orderForm.value.orderID,
      customerID: this.orderForm.value.customer.customerID,
      employeeID: this.orderForm.value.employee.employeeID,
      orderDate: this.appService.convertDate(this.orderForm.value.orderDate),
      shipperID: this.orderForm.value.shipper ? this.orderForm.value.shipper.shipperID : null,
      orderDetails: this.orderForm.value.orderDetails.map((detail: any) => ({
        orderDetailID: detail.orderDetailID,
        productID: detail.product,
        quantity: detail.quantity
      }))
    };
  }

  private resetOrderFC() {
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
