import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { AppService } from "./app.service";

@Injectable({ providedIn: 'root' })
export class TempOrderService {

    private FILE_NAME: string = "order.service";
    private baseOrdersURL = `${environment.baseURL}/TempOrder`;

    constructor(
        private http: HttpClient,
        private appService: AppService
    ) { }

    saveTempOrder(order: any): Observable<any> {
        return this.http.post<any>(`${this.baseOrdersURL}/Save`, order)
            .pipe(catchError(error => this.appService.handleError(error)));
    }

    updateTempOrder(id: string, order: any): void {
        this.http.put<boolean>(`${this.baseOrdersURL}/Update/${id}`, order)
            .pipe(catchError(error => this.appService.handleError(error)))
            .subscribe(response => {
                if (!response) {
                    console.log("Temp order was not updated in updateTempOrder " + this.FILE_NAME);
                }
            });
    }

    getTempOrder(id: string): Observable<any> {
        return this.http.get<any>(`${this.baseOrdersURL}/Get/${id}`);
    }

    deleteTempOrder(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseOrdersURL}/Delete/${id}`);
    }
}
