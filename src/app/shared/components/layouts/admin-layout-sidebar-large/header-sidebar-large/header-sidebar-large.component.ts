import { Component, OnInit, inject } from '@angular/core';
import { NavigationService } from '../../../../services/navigation.service';
import { SearchService } from '../../../../services/search.service';
import { AuthService } from '../../../../services/auth.service';
import { TokenService } from 'src/app/services/token/token.service';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header-sidebar-large',
  templateUrl: './header-sidebar-large.component.html',
  styleUrls: ['./header-sidebar-large.component.scss']
})
export class HeaderSidebarLargeComponent implements OnInit {
  private readonly tokenService = inject(TokenService);
  faBuilding = faBuilding;
  company = null;
  constructor(
    private navService: NavigationService,
    public searchService: SearchService,
    private auth: AuthService
  ) {
  }

  ngOnInit() {
    this.getCompany();
  }

  toggelSidebar() {
    const state = this.navService.sidebarState;
    if (state.childnavOpen && state.sidenavOpen) {
      return state.childnavOpen = false;
    }
    if (!state.childnavOpen && state.sidenavOpen) {
      return state.sidenavOpen = false;
    }
    // item has child items
    if (!state.sidenavOpen && !state.childnavOpen
      && this.navService?.selectedItem?.type === 'dropDown') {
      state.sidenavOpen = true;
      setTimeout(() => {
        // state.childnavOpen = true;
      }, 50);
    }
    // item has no child items
    if (!state.sidenavOpen && !state.childnavOpen) {
      state.sidenavOpen = true;
    }
  }

  getCompany() {
    this.company = JSON.parse(sessionStorage.getItem('company'));
    return this.company;
  }

  getNameLastName() {
    const name = this.tokenService.getDataToken('name');
    const lastName = this.tokenService.getDataToken('lastName');
    return `${name} ${lastName}`;
  }

  signout() {
    sessionStorage.clear();
    this.auth.signout();
  }

}
