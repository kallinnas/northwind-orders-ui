import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisplayOrdersComponent } from './components/display-orders/display-orders.component';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import { UpdateOrderComponent } from './components/update-order/update-order.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';

const routes: Routes = [
  { path: 'orders', component: DisplayOrdersComponent },
  { path: 'create-order', component: CreateOrderComponent },
  { path: 'update-order', component: UpdateOrderComponent },
  { path: 'order-details', component: OrderDetailsComponent },
  { path: '', redirectTo: '/orders', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
