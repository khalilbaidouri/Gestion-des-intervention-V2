export enum TypeRole {
  OPERATEUR = 'OPERATEUR',
  ADMINISTRATEUR = 'ADMINISTRATEUR',
  CHEF_DE_DEPARTEMENT = 'CHEF_DE_DEPARTEMENT',
  INGENIEUR = 'INGENIEUR'
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  id: number | null;
  nom: string;
  prenom: string;
  email: string;
  role: TypeRole;
  matricule: string;
  password: string;
}

export interface AuthResponse {
  bearer: string;
  refreshToken: string;
}