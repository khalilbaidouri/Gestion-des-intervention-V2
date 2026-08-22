import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DemandeIntervention, Intervention } from '../../../../core/models/intervention.model';

@Injectable({ providedIn: 'root' })
export class DemandeService {
  private readonly apiUrl = 'https://gestiondesinterventionsdockeriser.onrender.com/api';

  constructor(private http: HttpClient) {}

  getAll(): Observable<DemandeIntervention[]> {
    return this.http.get<DemandeIntervention[]>(`${this.apiUrl}/getAllDemande`);
  }

  create(demande: object): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/demande`, demande);
  }

  approve(id: number, dates: { dateDebut: string; dateEcheance: string }): Observable<Intervention> {
    return this.http.post<Intervention>(`${this.apiUrl}/${id}/accepter`, dates);
  }

  refuse(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/refuser`, {});
  }
}