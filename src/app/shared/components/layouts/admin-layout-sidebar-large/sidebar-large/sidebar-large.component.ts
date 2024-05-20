import {
  Component,
  OnInit,
  HostListener, ViewChildren, QueryList, inject, Input } from '@angular/core';
import {
  NavigationService,
  IMenuItem,
  IChildItem
} from '../../../../services/navigation.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
// import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';

import { filter } from 'rxjs/operators';
import { Utils } from '../../../../utils';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { jwtDecode } from 'jwt-decode';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-sidebar-large',
  templateUrl: './sidebar-large.component.html',
  styleUrls: ['./sidebar-large.component.scss']
})
export class SidebarLargeComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly tokenService = inject(TokenService);
  permissionsService = inject(PermissionsService);
  navService = inject(NavigationService);
  selectedItem: IMenuItem;
  nav: IMenuItem[];
  idCompany: number;

  constructor() {
  }

  ngOnInit() {
    // this.route.parent.children.forEach(child => {
    //   child.children.forEach(grandchild => {
    //     grandchild.children.forEach(grandgrandchild => {
    //       console.log('Child ID:', grandgrandchild.snapshot.paramMap.get('id'));
    //     });
    //   });
    // });

    let currentRoute = this.route;

    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    // Obtener el parámetro 'id' de la ruta más profunda
    this.idCompany = +currentRoute.snapshot.paramMap.get('id');

    // Luego, accedemos a la ruta nieta (grandchild)
    // this.route.paramMap.subscribe(params => {
    //   console.log('Grandchild ID:', params.get('id'));
    // });
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
    return this.tokenService.getDataToken('roleId');
  }

  getLocalCompany() {
    const company = sessionStorage.getItem('company');
    if (company) {
      return true;
    }

    return false;
  }

  changeRouteCompany(route: string) {
    const company = JSON.parse(sessionStorage.getItem('company'));
    if (company) {
      route = route.replace('{{company}}', `${company.id}`);
    }

    return route;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.updateSidebar();
  }
}
