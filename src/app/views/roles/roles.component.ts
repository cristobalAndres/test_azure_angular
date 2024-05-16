import { Component, inject } from '@angular/core';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { ModulePermissionDto, Permission } from
  'src/app/shared/models/permissions/modulePermission.dto';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RolesService } from 'src/app/services/roles/roles.service';
import { RolesDto } from 'src/app/shared/models/roles/roles.dto';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [ReactiveFormsModule, NgbTooltipModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent {
  private readonly permissionsService = inject(PermissionsService);
  private readonly rolesService = inject(RolesService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);
  roles: RolesDto[] = [];
  modulesPermissions: ModulePermissionDto[];
  moduleForm: FormGroup;
  loading = false;

  ngOnInit() {
    // sessionStorage.removeItem('company');
    this.moduleForm = this.formBuilder.group({
      roleId: [null, Validators.required],
      permissionIds: this.formBuilder.array([])
    });

    this.loadRoles();
  }

  loadRoles() {
    this.rolesService.getRoles().subscribe((response) => {
      this.roles = response;
    });
  }

  onSubmit() {
    console.log(this.moduleForm.value);
    const roleId = this.moduleForm.get('roleId').value;
    const permissions = [];
    this.moduleForm.get('permissionIds').value.forEach((module) => {
      module.permissions.forEach((permission) => {
        if (permission.checked) {
          permissions.push(permission.id);
        }
      });
    });

    this.loading = true;
    this.permissionsService.updateModulesPermissionsByRoleId(roleId, permissions)
      .subscribe(() => {
        this.toastr.success('Permisos actualizados!', 'Exito!', { progressBar: true });
        this.loading = false;
      }, error => {
        let message = 'Error al crear el usuario!';
        if (error?.error?.message && error.error.message === 'USER_ALREADY_EXISTS') {
          message = 'El correo ya existe!';
        }
        console.error(error);
        this.toastr.error(message, 'Error!', { progressBar: true });
        this.loading = false;
      });
  }

  getSubItems(itemIndex: number): FormArray {
    return this.permissionIds.at(itemIndex).get('permissions') as FormArray;
  }

  changeRole() {
    const roleId = this.moduleForm.get('roleId').value;
    this.permissionIds.clear();

    this.permissionsService.getModulesPermissions(roleId).subscribe((modulesPermissions) => {
      this.modulesPermissions = modulesPermissions;
      console.log(this.modulesPermissions);

      modulesPermissions.forEach((module) => {
        const itemForm = this.formBuilder.group({
          id: module.moduleId,
          name: module.moduleName,
          permissions: this.formBuilder.array(
            module.permissions.map(permission => this.formBuilder.group({
              id: permission.permissionId,
              name: permission.action,
              checked: permission.isAllowed || false
            })))
        });
        this.permissionIds.push(itemForm);
      });
    });
    this.rolesService.getRoles().subscribe((roles) => {
      this.roles = roles;
    });
  }

  get permissionIds(): FormArray {
    return this.moduleForm.get('permissionIds') as FormArray;
  }
}
