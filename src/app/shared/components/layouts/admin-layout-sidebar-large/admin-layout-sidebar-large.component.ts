import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { NavigationService } from '../../../services/navigation.service';
import { SearchService } from 'src/app/shared/services/search.service';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import {
  Router,
  RouteConfigLoadStart,
  ResolveStart,
  RouteConfigLoadEnd,
  ResolveEnd
} from '@angular/router';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-admin-layout-sidebar-large',
  templateUrl: './admin-layout-sidebar-large.component.html',
  styleUrls: ['./admin-layout-sidebar-large.component.scss']
})
export class AdminLayoutSidebarLargeComponent implements OnInit {
  permissionsService = inject(PermissionsService);
  moduleLoading: boolean;

  constructor(
    public navService: NavigationService,
    public searchService: SearchService,
    private router: Router
  ) { }

  ngOnInit() {
    this.permissionsService.getPermissionUserByRoleId(this.getRoleIdToken());
    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart || event instanceof ResolveStart) {
        this.moduleLoading = true;
      }
      if (event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
        this.moduleLoading = false;
      }
    });
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
}
