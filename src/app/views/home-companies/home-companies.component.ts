import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IChildItem, NavigationService } from 'src/app/shared/services/navigation.service';

@Component({
  selector: 'app-home-companies',
  standalone: true,
  imports: [],
  templateUrl: './home-companies.component.html',
  styleUrl: './home-companies.component.scss'
})
export class HomeCompaniesComponent {
  navService = inject(NavigationService);
  private readonly router = inject(Router);
  nav: IChildItem[];
  protected company = null;
  ngOnInit(): void {
    this.company = JSON.parse(sessionStorage.getItem('company'));
    this.navService.menuItems$.subscribe(items => {
      console.log(items);
      const findNavCompany = items.find(item => item.company);
      this.nav = findNavCompany.sub.map(item => {
        return {
          ...item,
          state: item.state.replace('{{company}}', `${this.company.id}`)
        };
      });
    });
  }

  redirectToRoute(route: string): void {
    this.router.navigateByUrl(route);
  }
}
