import { Component } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';  // Importa RouterModule

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [NgxDatatableModule, CommonModule, NgbTooltipModule, RouterModule],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.scss'
})
export class CompaniesComponent {
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
      { name: 'Address', prop: 'address' },
      { name: 'Phone', prop: 'phone' },
      { name: 'Email', prop: 'email' },
      { name: 'Actions', prop: 'actions' }
    ];
  }

  ngOnInit() {
    sessionStorage.removeItem('company');
    this.rows = [
      {
        id: 1,
        name: 'Company 1',
        address: 'Address 1',
        phone: '1234567890',
        email: 'company@gmail.com',
      },
      {
        id: 2,
        name: 'Company 1',
        address: 'Address 1',
        phone: '1234567890',
        email: 'company@gmail.com',
      },
      {
        id: 3,
        name: 'Company 1',
        address: 'Address 1',
        phone: '1234567890',
        email: 'company@gmail.com',
      },
      {
        id: 4,
        name: 'Company 1',
        address: 'Address 1',
        phone: '1234567890',
        email: 'company@gmail.com',
      },
      {
        id: 5,
        name: 'Company 2',
        address: 'Address 1',
        phone: '1234567890',
        email: 'company@gmail.com',
      },
      {
        id: 6,
        name: 'Company 3',
        address: 'Address 1',
        phone: '1234567890',
        email: 'company@gmail.com',
      },
      {
        id: 7,
        name: 'Company 4',
        address: 'Address 1',
        phone: '1234567890',
        email: 'company@gmail.com',
      },
      {
        id: 8,
        name: 'Company 5',
        address: 'Address 1',
        phone: '1234567890',
        email: 'company@gmail.com',
      },
    ];
  }

  setCompany(company: string): void {
    sessionStorage.setItem('company', company);
  }
}
