import { Component } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { CustomerService } from '../../services/customer.service';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.css'
})
export class CreateOrderComponent {

  orderForm: any;
  unitPrice: number = 0;
  selectedFile: File | null = null;

  get orderDetails(): FormArray { return this.orderForm.get('orderDetails') as FormArray; }

  constructor(
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    public customerService: CustomerService,
    public appService: AppService,
  ) { }

  ngOnInit(): void {
    this.resetOrderFC();
  }

  addOrderDetail(): void {
    this.orderDetails.push(this.formBuilder.group({
      product: ['', Validators.required],
      quantity: [0, Validators.required],
      unitPrice: [{ value: '0', disabled: true }]
    }));
  }

  removeOrderDetail(index: number): void {
    this.orderDetails.removeAt(index);
  }

  updateUnitPrice(index: number): void {
    const detail = this.orderDetails.at(index);
    const productID = detail.get('product')?.value.productID;
    const quantity = detail.get('quantity')?.value;

    if (productID && quantity) {
      const product = this.appService.products.find(p => p.productID === productID);

      if (product?.price != undefined) {
        this.unitPrice = product.price * quantity;
      }

      detail.get('unitPrice')?.setValue(this.unitPrice);
    }
  }

  createOrderWithFile(): void {
    if (this.orderForm.valid && this.selectedFile) {
      this.orderService.createOrderWithFile(this.orderForm.value, this.selectedFile).subscribe({
        next: (isCreated: boolean) => {
          if (isCreated) {
            this.appService.showSnackbar('Order created successfully!');
            this.resetOrderFC();
          }
        },
        error: () => {
          this.appService.showSnackbar('Failed to create order. Please try again.');
        }
      });
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  private resetOrderFC() {
    this.orderForm = this.formBuilder.group({
      customer: ['', Validators.required],
      employee: ['', Validators.required],
      orderDate: ['', Validators.required],
      shipper: ['', Validators.required],
      orderDetails: this.formBuilder.array([])
    });
  }

  isAddOrderDetailDisabled(): boolean {
    return !this.orderForm.get('customer')?.valid ||
      !this.orderForm.get('employee')?.valid ||
      !this.orderForm.get('orderDate')?.valid ||
      !this.orderForm.get('shipper')?.valid;
  }

  isCreateOrderButtonVisible(): boolean {
    return this.orderDetails.length > 0 &&
      this.orderDetails.controls.every(control => control.valid && control.value.quantity > 0);
  }

}
