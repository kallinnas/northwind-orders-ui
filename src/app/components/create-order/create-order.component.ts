import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { Shipper } from '../../models/shipper.model';
import { ShipperService } from '../../services/shipper.service';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.css'
})
export class CreateOrderComponent {
  orderForm: any;
  products: Product[] = [];
  customers: Customer[] = [];
  employees: Employee[] = [];
  shippers: Shipper[] = [];
  unitPrice: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private productService: ProductService,
    public customerService: CustomerService,
    private employeeService: EmployeeService,
    private shipperService: ShipperService,
    private appService: AppService,
  ) { }

  ngOnInit(): void {
    this.orderForm = this.formBuilder.group({
      customer: ['', Validators.required],
      employee: ['', Validators.required],
      orderDate: ['', Validators.required],
      shipper: ['', Validators.required],
      orderDetails: this.formBuilder.array([])
    });
    this.loadDropdownData();
  }

  get orderDetails(): FormArray {
    return this.orderForm.get('orderDetails') as FormArray;
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
      const product = this.products.find(p => p.productID === productID);
      if (product?.price != undefined) {
        this.unitPrice = product.price * quantity;
      }
      detail.get('unitPrice')?.setValue(this.unitPrice, { emitEvent: false });

    }
  }

  onSubmit(): void {
    if (this.orderForm.valid) {
      this.orderService.createOrder(this.orderForm.value).subscribe(
        {
          next: (isCreated: boolean) => {
            if(isCreated) {
              this.appService.showSnackbar('Order created successfully!');
              this.orderForm.reset();
            }
          },
          error: (error: any) => {
            this.appService.showSnackbar('Failed to create order. Please try again.');
          }
        }
      );
    }
  }

  private loadDropdownData(): void {
    this.productService.products$.subscribe(products => this.products = products);
    this.customerService.customers$.subscribe({ next: customers => { this.customers = customers }, error: err => { } });
    this.employeeService.employees$.subscribe({ next: employees => { this.employees = employees }, error: err => { } });
    this.shipperService.employees$.subscribe(shippers => this.shippers = shippers);
  }
}
