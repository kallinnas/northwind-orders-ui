import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './modules/material.module';
import { AutocompleteComponent } from './components/custom/autocomplete/autocomplete.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { OrderService } from './services/order.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DisplayOrdersComponent } from './components/display-orders/display-orders.component';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import { AppService } from './services/app.service';
import { ProductService } from './services/product.service';
import { CustomerService } from './services/customer.service';
import { EmployeeService } from './services/employee.service';
import { ShipperService } from './services/shipper.service';
import { UpdateOrderComponent } from './components/update-order/update-order.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { DatePipe } from '@angular/common';
import { OrderDetailsComponent } from './components/order-details/order-details.component';

@NgModule({
  declarations: [
    AppComponent,
    DisplayOrdersComponent,
    AutocompleteComponent,
    CreateOrderComponent,
    UpdateOrderComponent,
    ConfirmDialogComponent,
    OrderDetailsComponent,
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  providers: [
    AppService, ProductService, CustomerService, EmployeeService,
    OrderService, ShipperService, DatePipe,
    provideHttpClient(withFetch()),
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
