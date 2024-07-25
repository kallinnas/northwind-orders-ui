import { Customer } from "./customer.model";
import { Employee } from "./employee.model";
import { OrderDetails } from "./order-details.model";
import { Shipper } from "./shipper.model";

export interface Order {
    orderID: number;
    employee: Employee;
    employeeID?: number;
    orderTotalPrice?: number;
    customer: Customer;
    customerID?: number;
    shipper: Shipper;
    // shipperName?: string;
    shipperID?: number;
    orderDate?: Date;
    orderDetails: OrderDetails[];
}