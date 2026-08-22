import { Component, OnInit } from '@angular/core';
import { Auth } from '../../../../core/services/auth';
import { TypeRole } from '../../../auth/models/auth.model';
import { Intervention, StatutIntervention } from '../../../../core/models/intervention.model';

import {
  LucideAngularModule,
  BarChart3,
  Calendar,
  Pin,
  TrendingUp,
  TrendingDown,
  ListChecks,
  CheckCircle2,
  Loader,
  Clock,
  Activity,
} from 'lucide-angular';

import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { InterventionService } from '../../../intervention/page/intervention/intervention';

type Period = 'semaine' | 'mois' | 'trimestre';

interface StatusSlice {
  label: string;
  count: number;
  percent: number;
  colorClass: string;
}

interface MonthlyEvolution {
  label: string;
  count: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [LucideAngularModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  // ============================================================
  // ICÔNES
  // ============================================================

  readonly icons = {
    barChart: BarChart3,
    calendar: Calendar,
    pin: Pin,
    trendUp: TrendingUp,
    trendDown: TrendingDown,
    listChecks: ListChecks,
    checkCircle: CheckCircle2,
    loader: Loader,
    clock: Clock,
    activity: Activity,
  };

  readonly TypeRole = TypeRole;

  // ============================================================
  // ÉTAT DU DASHBOARD
  // ============================================================

  isLoading = true;

  selectedPeriod: Period = 'mois';

  readonly currentDateLabel = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // ============================================================
  // STATISTIQUES
  // ============================================================

  total = 0;
  terminees = 0;
  enCours = 0;
  planifiees = 0;
  echouees = 0;
  validees = 0;

  // ============================================================
  // MÉTRIQUES
  // ============================================================

  tauxReussite = 0;
  efficacite = 0;

  // ============================================================
  // RÉPARTITION DES STATUTS
  // ============================================================

  statusBreakdown: StatusSlice[] = [];

  // ============================================================
  // TENDANCES
  // ============================================================
  //
  // Ces valeurs restent des placeholders tant que le backend
  // ne fournit pas les statistiques de la période précédente.
  //

  readonly trends = {
    total: 12,
    terminees: 8,
    enCours: -2,
    planifiees: 15,
  };

  // ============================================================
  // ÉVOLUTION MENSUELLE
  // ============================================================
  //
  // Placeholder : ton backend actuel ne fournit pas encore
  // une agrégation par mois.
  //

  readonly monthlyEvolution: MonthlyEvolution[] = [
    {
      label: 'Mars',
      count: 4,
    },
    {
      label: 'Avr',
      count: 6,
    },
    {
      label: 'Mai',
      count: 5,
    },
    {
      label: 'Juin',
      count: 8,
    },
    {
      label: 'Juil',
      count: 7,
    },
    {
      label: 'Août',
      count: 9,
    },
  ];

  // ============================================================
  // MAXIMUM DU GRAPHIQUE MENSUEL
  // ============================================================

  get monthlyMax(): number {
    return Math.max(...this.monthlyEvolution.map((month) => month.count), 1);
  }

  // ============================================================
  // CONSTRUCTEUR
  // ============================================================

  constructor(
    private auth: Auth,
    private interventionService: InterventionService,
  ) {}

  // ============================================================
  // INIT
  // ============================================================

  ngOnInit(): void {
    this.loadData();
  }

  // ============================================================
  // UTILISATEUR CONNECTÉ
  // ============================================================

  get userFullName(): string {
    return this.auth.getCurrentUsername() ?? '';
  }

  // ============================================================
  // RÔLE CONNECTÉ
  // ============================================================

  get role(): TypeRole | null {
    return this.auth.getRole();
  }

  // ============================================================
  // ADMIN + CHEF DE DÉPARTEMENT
  // ============================================================
  //
  // Ces deux rôles ont les mêmes droits.
  //

  get hasFullAccess(): boolean {
    return this.role === TypeRole.ADMINISTRATEUR || this.role === TypeRole.CHEF_DE_DEPARTEMENT;
  }

  // ============================================================
  // INGÉNIEUR + OPÉRATEUR
  // ============================================================
  //
  // Ces deux rôles ont les mêmes droits.
  //

  get hasOwnAccess(): boolean {
    return this.role === TypeRole.INGENIEUR || this.role === TypeRole.OPERATEUR;
  }

  // ============================================================
  // MESSAGE DU RÔLE
  // ============================================================

  get roleSpecificMessage(): string {
    switch (this.role) {
      case TypeRole.ADMINISTRATEUR:
        return "En tant qu'administrateur, vous pouvez gérer toutes les demandes d'intervention et les affectations.";

      case TypeRole.CHEF_DE_DEPARTEMENT:
        return "En tant que chef de département, vous disposez des mêmes droits de gestion des interventions que l'administrateur.";

      case TypeRole.INGENIEUR:
        return "En tant qu'ingénieur, vous pouvez voir et gérer les interventions qui vous sont assignées.";

      case TypeRole.OPERATEUR:
        return "En tant qu'opérateur, vous pouvez voir et gérer les interventions qui vous sont assignées.";

      default:
        return 'Bienvenue sur le système de gestion des interventions.';
    }
  }

  // ============================================================
  // CHANGEMENT DE PÉRIODE
  // ============================================================

  setPeriod(period: Period): void {
    this.selectedPeriod = period;

    /*
     * Le backend actuel ne possède pas encore de paramètre
     * de période pour les statistiques.
     *
     * Lorsque l'endpoint sera disponible, on pourra faire :
     *
     * this.loadData();
     */
  }

  // ============================================================
  // CHARGEMENT DES DONNÉES
  // ============================================================

  private loadData(): void {
    this.isLoading = true;

    let interventions$: Observable<Intervention[]>;

    // ==========================================================
    // ADMINISTRATEUR + CHEF DE DÉPARTEMENT
    // ==========================================================
    //
    // Ils voient toutes les interventions.
    //
    // Comme ton service ne possède pas encore getAll(),
    // on récupère chaque statut puis on fusionne les résultats.
    //

    if (this.hasFullAccess) {
      interventions$ = forkJoin([
        this.interventionService.getAllByStatus(StatutIntervention.PLANIFIEE),

        this.interventionService.getAllByStatus(StatutIntervention.EN_COURS),

        this.interventionService.getAllByStatus(StatutIntervention.TERMINEE),

        this.interventionService.getAllByStatus(StatutIntervention.ECHOUEE),

        this.interventionService.getAllByStatus(StatutIntervention.VALIDEE),
      ]).pipe(
        map((results) => {
          return results.flat();
        }),
      );
    }

    // ==========================================================
    // INGÉNIEUR + OPÉRATEUR
    // ==========================================================
    //
    // Ils voient uniquement leurs interventions.
    //
    else if (this.hasOwnAccess) {
      interventions$ = this.interventionService.getMine();
    }

    // ==========================================================
    // RÔLE INCONNU
    // ==========================================================
    else {
      interventions$ = of([] as Intervention[]);
    }

    // ==========================================================
    // SOUSCRIPTION
    // ==========================================================

    interventions$
      .pipe(
        catchError((error) => {
          console.error('Erreur lors du chargement des interventions :', error);

          return of([] as Intervention[]);
        }),
      )
      .subscribe({
        next: (interventions: Intervention[]) => {
          this.computeStats(interventions);

          this.isLoading = false;
        },

        error: (error) => {
          console.error('Erreur dashboard :', error);

          this.isLoading = false;
        },
      });
  }

  // ============================================================
  // CALCUL DES STATISTIQUES
  // ============================================================

  private computeStats(interventions: Intervention[]): void {
    // ==========================================================
    // TOTAL
    // ==========================================================

    this.total = interventions.length;

    // ==========================================================
    // TERMINÉES
    // ==========================================================

    this.terminees = interventions.filter(
      (intervention) => intervention.statut === StatutIntervention.TERMINEE,
    ).length;

    // ==========================================================
    // EN COURS
    // ==========================================================

    this.enCours = interventions.filter(
      (intervention) => intervention.statut === StatutIntervention.EN_COURS,
    ).length;

    // ==========================================================
    // PLANIFIÉES
    // ==========================================================

    this.planifiees = interventions.filter(
      (intervention) => intervention.statut === StatutIntervention.PLANIFIEE,
    ).length;

    // ==========================================================
    // ÉCHOUÉES
    // ==========================================================

    this.echouees = interventions.filter(
      (intervention) => intervention.statut === StatutIntervention.ECHOUEE,
    ).length;

    // ==========================================================
    // VALIDÉES
    // ==========================================================

    this.validees = interventions.filter(
      (intervention) => intervention.statut === StatutIntervention.VALIDEE,
    ).length;

    // ==========================================================
    // TAUX DE RÉUSSITE
    // ==========================================================
    //
    // Même logique que ton dashboard React :
    //
    // terminées / total * 100
    //

    this.tauxReussite = this.total > 0 ? Math.round((this.terminees / this.total) * 100) : 0;

    // ==========================================================
    // EFFICACITÉ
    // ==========================================================
    //
    // Même logique que le dashboard React :
    //
    // (terminées + en cours) / total * 100
    //

    this.efficacite =
      this.total > 0 ? Math.round(((this.terminees + this.enCours) / this.total) * 100) : 0;

    // ==========================================================
    // FONCTION POUR CALCULER LES POURCENTAGES
    // ==========================================================

    const percent = (value: number): number => {
      if (this.total === 0) {
        return 0;
      }

      return Math.round((value / this.total) * 100);
    };

    // ==========================================================
    // RÉPARTITION DES STATUTS
    // ==========================================================

    this.statusBreakdown = [
      {
        label: 'Terminées',
        count: this.terminees,
        percent: percent(this.terminees),
        colorClass: 'bg-primary',
      },

      {
        label: 'En cours',
        count: this.enCours,
        percent: percent(this.enCours),
        colorClass: 'bg-accent-foreground/70',
      },

      {
        label: 'Planifiées',
        count: this.planifiees,
        percent: percent(this.planifiees),
        colorClass: 'bg-muted-foreground/40',
      },

      {
        label: 'Échouées',
        count: this.echouees,
        percent: percent(this.echouees),
        colorClass: 'bg-destructive',
      },

      {
        label: 'Validées',
        count: this.validees,
        percent: percent(this.validees),
        colorClass: 'bg-primary/70',
      },
    ];
  }
}
