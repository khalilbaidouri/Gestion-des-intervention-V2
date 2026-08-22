import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Intervention } from '../../../../core/models/intervention.model';

@Injectable({ providedIn: 'root' })
export class InterventionService {
  private readonly apiUrl = 'https://gestiondesinterventionsdockeriser.onrender.com/api';

  constructor(private http: HttpClient) {}

  getAllByStatus(status: string): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(
      `${this.apiUrl}/interventions/afficherLesInterventionsParStatut?statut=${status}`,
    );
  }

  getMine(): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(`${this.apiUrl}/interventions/mesInterventions`);
  }

  assign(id: number, ingenieurId?: number): Observable<Intervention> {
    const query = ingenieurId ? `?idIngenieur=${ingenieurId}` : '';
    return this.http.post<Intervention>(`${this.apiUrl}/interventions/${id}/assigner${query}`, {});
  }

  start(id: number): Observable<Intervention> {
    return this.http.put<Intervention>(`${this.apiUrl}/interventions/${id}/commencer`, {});
  }

  terminate(id: number, rapport: string): Observable<Intervention> {
    return this.http.put<Intervention>(`${this.apiUrl}/interventions/${id}/terminer`, { rapport });
  }

  fail(id: number, rapport: string): Observable<Intervention> {
    return this.http.put<Intervention>(`${this.apiUrl}/interventions/${id}/echouer`, { rapport });
  }

  validate(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/interventions/${id}/valider`, {});
  }

  redo(id: number, data: object): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/interventions/${id}/refaire`, data);
  }
}
