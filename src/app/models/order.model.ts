import { OrderDetails } from "./order-details.model";

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