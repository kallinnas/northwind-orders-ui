import { Customer } from "./customer.model";
import { Employee } from "./employee.model";
import { OrderDetails } from "./order-details.model";
import { Shipper } from "./shipper.model";

export interface Order {
    orderID: number;
    employeeID?: number;
    employeeFullName?: string;
    orderTotalPrice?: number;
    customerID?: number;
    customerName?: string;
    shipperID?: number;
    shipperName?: string;
    orderDate?: Date;
    orderDetails: OrderDetails[];
}