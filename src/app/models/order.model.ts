import { Customer } from "./customer.model";
import { Employee } from "./employee.model";
import { OrderDetails } from "./order-details.model";
import { Shipper } from "./shipper.model";

export interface Order {
    orderID: number;
    employee: Employee;
    employeeID?: number;
    employeeFullName?: string;
    orderTotalPrice?: number;
    customer: Customer;
    customerID?: number;
    customerName?: string;
    shipper: Shipper;
    shipperID?: number;
    shipperName?: string;
    orderDate?: Date;
    orderDetails: OrderDetails[];
}