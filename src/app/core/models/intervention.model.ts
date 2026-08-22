import { TypeRole } from '../../features/auth/models/auth.model';

export enum StatutDemande {
  EN_ATTENTE = 'EN_ATTENTE',
  ACCEPTEE = 'ACCEPTEE',
  REFUSEE = 'REFUSEE',
}

export enum StatutIntervention {
  PLANIFIEE = 'PLANIFIEE',
  EN_COURS = 'EN_COURS',
  TERMINEE = 'TERMINEE',
  ECHOUEE = 'ECHOUEE',
  VALIDEE = 'VALIDEE',
}

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: TypeRole;
}

export interface DemandeIntervention {
  id: number;
  titre: string;
  description: string;
  statut: StatutDemande;
  dateCreation: string;
  demandeur?: User;
}

export interface Intervention {
  id: number;
  statut: StatutIntervention;
  dateDebut?: string;
  dateEcheance?: string;
  rapport?: string;
  ingenieur?: User;
  demande?: DemandeIntervention;
}

export interface Notification {
  id: number;
  message: string;
  lu: boolean;
  dateCreation: string;
}
