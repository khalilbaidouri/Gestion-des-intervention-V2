import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from  '../../../../core/models/intervention.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly apiUrl = 'https://gestiondesinterventionsdockeriser.onrender.com/api';

  constructor(private http: HttpClient) {}

  getMine(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/notifications/mesNotification`);
  }
}