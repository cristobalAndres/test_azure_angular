import { Component, OnInit, HostListener, ViewChildren, QueryList, inject } from '@angular/core';
import {
  NavigationService,
  IMenuItem,
  IChildItem
} from '../../../../services/navigation.service';
import { Router, NavigationEnd } from '@angular/router';
// import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';

import { filter } from 'rxjs/operators';
import { Utils } from '../../../../utils';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-sidebar-large',
  templateUrl: './sidebar-large.component.html',
  styleUrls: ['./sidebar-large.component.scss']
})
export class SidebarLargeComponent implements OnInit {
  private readonly router = inject(Router);
  permissionsService = inject(PermissionsService);
  navService = inject(NavigationService);
  selectedItem: IMenuItem;
  nav: IMenuItem[];

  constructor() {
  }

  ngOnInit() {
    this.permissionsService.getPermissionUserByRoleId(this.getRoleIdToken());
    this.updateSidebar();
    // CLOSE SIDENAV ON ROUTE CHANGE
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(routeChange => {
        this.closeChildNav();
        if (Utils.isMobile()) {
          this.navService.sidebarState.sidenavOpen = false;
        }
      });

    this.navService.menuItems$.subscribe(items => {
      this.nav = items;
      this.setActiveFlag();
    });
  }

  selectItem(item) {
    this.navService.sidebarState.childnavOpen = true;
    this.navService.selectedItem = item;
    this.setActiveMainItem(item);
  }

  closeChildNav() {
    this.navService.sidebarState.childnavOpen = false;
    this.setActiveFlag();
  }

  onClickChangeActiveFlag(item) {
    this.setActiveMainItem(item);
  }
  setActiveMainItem(item) {
    this.nav.forEach(i => {
      i.active = false;
    });
    item.active = true;
  }

  setActiveFlag() {
    if (window && window.location) {
      const activeRoute = window.location.hash || window.location.pathname;
      this.nav.forEach(item => {
        item.active = false;
        if (activeRoute.indexOf(item.state) !== -1) {
          this.navService.selectedItem = item;
          item.active = true;
        }
        if (item.sub) {
          item.sub.forEach(subItem => {
            subItem.active = false;
            if (activeRoute.indexOf(subItem.state) !== -1) {
              this.navService.selectedItem = item;
              item.active = true;
            }
            if (subItem.sub) {
              subItem.sub.forEach(subChildItem => {
                if (activeRoute.indexOf(subChildItem.state) !== -1) {
                  this.navService.selectedItem = item;
                  item.active = true;
                  subItem.active = true;
                }
              });
            }
          });
        }
      });
    }
  }

  updateSidebar() {
    if (Utils.isMobile()) {
      this.navService.sidebarState.sidenavOpen = false;
      this.navService.sidebarState.childnavOpen = false;
    } else {
      this.navService.sidebarState.sidenavOpen = true;
    }
  }

  getRoleIdToken() {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return decoded['roleId'];
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    return null;
  }

  getLocalCompany() {
    const company = sessionStorage.getItem('company');
    if (company) {
      return true;
    }

    return false;
  }

  changeRouteCompany(route: string) {
    const company = sessionStorage.getItem('company');
    console.log('---->>>', company);
    route = route.replace('{{company}}', company);

    return route;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.updateSidebar();
  }
}
