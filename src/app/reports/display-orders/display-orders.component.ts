import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { Order } from '../../models/order.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { OrderService } from '../../services/order.service';
import { CustomPaginator } from '../../config/CustomPaginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-display-orders',
  templateUrl: './display-orders.component.html',
  styleUrl: './display-orders.component.css',
  providers: [{ provide: MatPaginatorIntl, useValue: CustomPaginator() }]
})
export class DisplayOrdersComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort = new MatSort();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: MatTableDataSource<Order> = new MatTableDataSource();

  matchesAutocomplite: string[] = [];
  displayedColumns: string[] = [
    'employeeFullName',
    'customerName',
    'shipperName',
    'orderDate',
    'orderTotalPrice',
    'remove'
  ];

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private orderService: OrderService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.orderService.orders$.subscribe(orders => {
      this.dataSource.data = orders;
      this.updateMatches(orders);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    }

    else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  updateMatches(orders: Order[]) {
    const employeeNames = orders.map(order => order.employeeFullName).filter(name => name !== undefined) as string[];
    const customerNames = orders.map(order => order.customerName).filter(name => name !== undefined) as string[];
    const shipperNames = orders.map(order => order.shipperName).filter(name => name !== undefined) as string[];
    this.matchesAutocomplite = [...new Set([...employeeNames, ...customerNames, ...shipperNames])];
  }

  openDeleteDialog(orderID: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { message: `Are you sure you want to remove the order #${orderID}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteOrder(orderID);
      }
    });
  }

  deleteOrder(orderID: number): void {
    this.orderService.deleteOrder(orderID).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter(o => o.orderID !== orderID);
        this.updateMatches(this.dataSource.data);
      },

      error: err => {
        console.error('Failed to delete order', err);
      }
    });
  }
}
