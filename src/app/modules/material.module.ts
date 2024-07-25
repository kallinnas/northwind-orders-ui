import { NgModule } from "@angular/core";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatNativeDateModule, MatOption } from "@angular/material/core";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";

@NgModule({
    imports: [
        MatFormFieldModule, MatSortModule, MatPaginatorModule, MatTableModule, MatOption,
        MatInputModule, MatIconModule, MatCardModule, MatListModule, MatButtonModule,
        MatSnackBarModule, MatDatepickerModule, MatSelectModule, MatNativeDateModule,
        MatDialogModule, MatDividerModule
 
        // MatCheckboxModule, MatSidenavModule, MatToolbarModule, ,
        // , MatTabsModule, MatCardModule,
        // MatProgressSpinnerModule, 
        // MatGridListModule,
    ],
    exports: [
        MatFormFieldModule, MatSortModule, MatPaginatorModule, MatTableModule, MatOption,
        MatInputModule, MatIconModule, MatCardModule, MatListModule, MatButtonModule,
        MatSnackBarModule, MatDatepickerModule, MatSelectModule, MatNativeDateModule,
        MatDialogModule, MatDividerModule
    ],
})
export class MaterialModule {
}