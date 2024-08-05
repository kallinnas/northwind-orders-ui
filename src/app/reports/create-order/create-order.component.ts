import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { CustomerService } from '../../services/customer.service';
import { AppService } from '../../services/app.service';
import { TempOrderService } from '../../services/temp-order.service';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.css'
})
export class CreateOrderComponent implements OnInit, AfterViewInit {

  private FILE_NAME: string = "create-order.ts";

  orderForm!: FormGroup;
  unitPrice: number = 0;
  selectedFile: File | null = null;
  tempOrderId: string = "";
  isOrderFormInitialized: boolean = false;

  get orderDetails(): FormArray { return this.orderForm.get('orderDetails') as FormArray; }

  constructor(
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private tempOrderService: TempOrderService,
    public customerService: CustomerService,
    public appService: AppService,
  ) { }

  ngOnInit(): void {
    this.resetOrderForm();
    this.subscribeToOrderForm();
  }

  ngAfterViewInit(): void {
    if (typeof localStorage !== 'undefined') {
      const storedTempOrderId = localStorage.getItem('tempOrderId');

      if (storedTempOrderId) {
        this.tempOrderId = storedTempOrderId;
        this.loadSavedOrder(this.tempOrderId);
      }
    }
  }

  onFormChange() {
    if (!this.isOrderFormInitialized) {
      if (this.tempOrderId) {
        this.updateProgress();
      }

      else {
        this.saveProgress();
      }
    }
  }

  private subscribeToOrderForm() {
    this.orderForm.valueChanges.subscribe(() => {
      this.onFormChange()
    });

    this.subscribeToOrderDetailsChanges();
  }

  private subscribeToOrderDetailsChanges() {
    this.orderDetails.controls.forEach(control => {
      control.valueChanges.subscribe(() => {
        this.onFormChange();
      });
    });
  }

  private loadSavedOrder(tempOrderId: string): void {
    try{
      this.isOrderFormInitialized = true;

    this.tempOrderService.getTempOrder(tempOrderId).subscribe(order => {
      if (order) {
        this.isOrderFormInitialized = true;

        this.orderForm.patchValue({
          customer: order.customerID > 0 ? this.appService.customers.find(c => c.customerID == order.customerID) : "",
          employee: order.employeeID > 0 ? this.appService.employees.find(e => e.employeeID == order.employeeID) : "",
          orderDate: order.orderDate != null ? new Date(order.orderDate) : "",
          shipper: order.shipperID > 0 ? this.appService.shippers.find(s => s.shipperID == order.shipperID) : ""
        });

        const orderDetailsArray = JSON.parse(order.orderDetailsJson) || [];
        this.orderForm.setControl(
          'orderDetails',
          this.formBuilder.array(
            orderDetailsArray.map((detail: any) => this.formBuilder.group({
              product: [this.appService.products.find(p => p.productID == detail.product.productID), Validators.required],
              quantity: [detail.quantity, Validators.required],
              unitPrice: [{ value: (detail.product.unit * detail.product.unit), disabled: true }]
            }))));

        this.subscribeToOrderDetailsChanges();
        this.isOrderFormInitialized = false;
      }
    });
    }

    catch (err) {
      console.log(err, "loadSavedOrder " + this.FILE_NAME);
    }
  }

  updateProgress(): void {
    const tempOrder = this.createTempOrderPayload();
    this.tempOrderService.updateTempOrder(this.tempOrderId, tempOrder);
  }

  saveProgress(): void {
    const tempOrder = this.createTempOrderPayload();
    this.tempOrderService.saveTempOrder(tempOrder).subscribe(response => {
      this.tempOrderId = response.id;
      if (this.tempOrderId) {
        localStorage.setItem('tempOrderId', this.tempOrderId);
      }
    });
  }

  private createTempOrderPayload(): any {
    return {
      CustomerID: this.orderForm.value.customer.customerID,
      EmployeeID: this.orderForm.value.employee.employeeID ?? 0,
      OrderDate: this.appService.convertDate(this.orderForm.value.orderDate),
      ShipperID: this.orderForm.value.shipper.shipperID ?? 0,
      OrderDetailsJson: JSON.stringify(this.orderForm.value.orderDetails)
    };
  }

  clearProgress(): void {
    if (this.tempOrderId) {
      this.tempOrderService.deleteTempOrder(this.tempOrderId).subscribe(() => {
        this.tempOrderId = "";
        localStorage.removeItem('tempOrderId');
        this.resetOrderForm();
      });
    }
  }

  addOrderDetail(): void {
    const newDetail = this.formBuilder.group({
      product: ['', Validators.required],
      quantity: [0, Validators.required],
      unitPrice: [{ value: '0', disabled: true }]
    });

    this.orderDetails.push(newDetail);

    // Subscribe to changes in the new form group
    newDetail.valueChanges.subscribe(() => {
      this.onFormChange();
    });

    // Trigger a form change manually after adding a new order detail
    this.onFormChange();
  }

  removeOrderDetail(index: number): void {
    this.orderDetails.removeAt(index);

    this.onFormChange();
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

      this.onFormChange();
    }
  }

  createOrderWithFile(): void {
    if (this.orderForm.valid && this.selectedFile) {
      this.orderService.createOrderWithFile(this.orderForm.value, this.selectedFile).subscribe({
        next: (isCreated: boolean) => {
          if (isCreated) {
            this.appService.showSnackbar('Order created successfully!');
            this.resetOrderForm();
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

  private resetOrderForm() {
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

  private isOrderFormEmpty(): boolean {
    return Object.values(this.orderForm.controls).every((control: any) =>
      control.value === '' || control.value === null || control.value.length === 0);
  }

  hasProgress(): boolean {
    return !this.orderForm.dirty && this.isOrderFormEmpty();
  }

}
