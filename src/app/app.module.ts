import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './modules/material.module';
import { ErrorInterceptor } from './config/ErrorInterceptor';

import { AppComponent } from './app.component';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { DisplayOrdersComponent } from './reports/display-orders/display-orders.component';
import { CreateOrderComponent } from './reports/create-order/create-order.component';
import { UpdateOrderComponent } from './reports/update-order/update-order.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { OrderDetailsComponent } from './reports/order-details/order-details.component';

import { AppService } from './services/app.service';
import { OrderService } from './services/order.service';
import { ProductService } from './services/product.service';
import { ShipperService } from './services/shipper.service';
import { CustomerService } from './services/customer.service';
import { EmployeeService } from './services/employee.service';
import { TempOrderService } from './services/temp-order.service';

import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';

@NgModule({
  declarations: [
    AppComponent,
    DisplayOrdersComponent,
    AutocompleteComponent,
    CreateOrderComponent,
    UpdateOrderComponent,
    ConfirmDialogComponent,
    OrderDetailsComponent,
    ThemeToggleComponent,
    
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
    OrderService, ShipperService, 
    TempOrderService, 
    DatePipe,
    provideHttpClient(withFetch()),
    // provideClientHydration(),
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
