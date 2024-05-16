import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-companies',
  standalone: true,
  imports: [],
  templateUrl: './home-companies.component.html',
  styleUrl: './home-companies.component.scss'
})
export class HomeCompaniesComponent {
  private readonly router = inject(Router);
  protected company = null;
  ngOnInit(): void {
    this.company = sessionStorage.getItem('company');
  }

  redirectToRoute(route: string): void {
    this.router.navigateByUrl(route);
  }
}
