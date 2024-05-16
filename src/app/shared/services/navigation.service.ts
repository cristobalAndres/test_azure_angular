import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface IMenuItem {
  id?: string;
  title?: string;
  description?: string;
  type: string;       // Possible values: link/dropDown/extLink
  name?: string;      // Used as display text for item and title for separator type
  state?: string;     // Router state
  icon?: string;      // Material icon name
  tooltip?: string;   // Tooltip text
  disabled?: boolean; // If true, item will not be appeared in sidenav.
  sub?: IChildItem[]; // Dropdown items
  badges?: IBadge[];
  active?: boolean;
  permission?: string;
  allowed?: boolean;
  company?: boolean;
}
export interface IChildItem {
  id?: string;
  parentId?: string;
  type?: string;
  name: string;       // Display text
  state?: string;     // Router state
  icon?: string;
  sub?: IChildItem[];
  active?: boolean;
  permission?: string;
  allowed?: boolean;
}

interface IBadge {
  color: string;      // primary/accent/warn/hex color codes(#fff000)
  value: string;      // Display text
}

interface ISidebarState {
  sidenavOpen?: boolean;
  childnavOpen?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  public sidebarState: ISidebarState = {
    sidenavOpen: true,
    childnavOpen: false
  };
  selectedItem: IMenuItem;

  constructor() {
  }

  defaultMenu: IMenuItem[] = [
    {
      name: 'Empresas',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
      type: 'dropDown',
      icon: 'i-Building',
      company: true,
      permission: '[COMPANIES][MODULE]',
      sub: [
        {
          icon: 'i-Coins',
          permission: '[COMPANIES][SUB-TAXES]',
          name: 'Impuestos',
          state: '/dashboard/companies/{{company}}/taxes',
          type: 'link'
        },
      ]
    },
    {
      name: 'Configuraciones',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
      type: 'dropDown',
      icon: 'i-Gear',
      badges: [{ color: 'primary', value: 'Principal' }],
      permission: '[CONFIGURATIONS][MODULE]',
      sub: [
        {
          icon: 'i-Building',
          name: 'Empresas',
          state: '/dashboard/companies',
          type: 'link'
        },
        {
          icon: 'i-Administrator',
          permission: '[CONFIGURATIONS][SUB-USERS]',
          name: 'Usuarios',
          state: '/dashboard/users',
          type: 'link'
        },
        {
          icon: 'i-ID-2',
          permission: '[CONFIGURATIONS][SUB-ROLES]',
          name: 'Roles',
          state: '/dashboard/roles',
          type: 'link'
        },
      ]
    },
  ];

  // sets iconMenu as default;
  menuItems = new BehaviorSubject<IMenuItem[]>(this.defaultMenu);
  // navigation component has subscribed to this Observable
  menuItems$ = this.menuItems.asObservable();

  getCompanyMenu() {
    return sessionStorage.getItem('company');
  }
}
