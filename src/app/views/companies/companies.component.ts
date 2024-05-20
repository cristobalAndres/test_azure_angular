import { Component, inject } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';  // Importa RouterModule
import { CompaniesService } from 'src/app/services/companies/companies.service';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [NgxDatatableModule, CommonModule, NgbTooltipModule, RouterModule],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.scss'
})
export class CompaniesComponent {
  private readonly companiesService = inject(CompaniesService);
  private readonly tokenService = inject(TokenService);
  rows = [];
  columns = [];

  pagination = {
    currentPage: 1,
    itemsPerPage: 10,
    totalElements: 0
  };

  constructor() {
    this.columns = [
      { name: 'ID', prop: 'id' },
      { name: 'Name', prop: 'name' },
      { name: 'Actions', prop: 'actions' }
    ];
  }

  ngOnInit() {
    sessionStorage.removeItem('company');
    const userId = this.tokenService.getDataToken('id');
    this.companiesService.getCompaniesByUserId(+userId).subscribe((data) => {
      this.rows = data;
    });
  }

  setCompany(company: any): void {
    sessionStorage.setItem('company', JSON.stringify(company));
    console.log('company:', JSON.parse(sessionStorage.getItem('company')));
  }
}
