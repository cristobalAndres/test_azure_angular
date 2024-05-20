import { Component, inject } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { UsersService } from 'src/app/services/users/users.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash, faEdit, faXmark, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { LoaderComponent } from 'src/app/shared/components/loader/loader.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserDto } from 'src/app/shared/models/users/user.dto';
import { ToastrService } from 'ngx-toastr';
import { SharedComponentsModule } from '../../shared/components/shared-components.module';
import { BtnLoadingComponent } from 'src/app/shared/components/btn-loading/btn-loading.component';
import { ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RolesService } from 'src/app/services/roles/roles.service';
import { RolesDto } from 'src/app/shared/models/roles/roles.dto';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { SharedDirectivesModule } from 'src/app/shared/directives/shared-directives.module';
import { CompaniesService } from 'src/app/services/companies/companies.service';
import { TokenService } from 'src/app/services/token/token.service';
import { Company, CompanySelect } from 'src/app/shared/models/companies/companies.dto';

@Component({
  selector: 'app-users',
  standalone: true,
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  imports: [
    CommonModule,
    NgxDatatableModule,
    FontAwesomeModule,
    NgbTooltipModule,
    LoaderComponent,
    NgbModule,
    SharedComponentsModule,
    BtnLoadingComponent,
    ReactiveFormsModule,
    SelectDropDownModule,
    FormsModule,
    SharedDirectivesModule,
  ]
})
export class UsersComponent {
  private readonly usersService = inject(UsersService);
  private readonly modalService = inject(NgbModal);
  private readonly toastr = inject(ToastrService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly rolesService = inject(RolesService);
  private readonly companiesService = inject(CompaniesService);
  private readonly tokenService = inject(TokenService);
  permissionsService = inject(PermissionsService);
  singleSelect = [];
  config = {
    displayKey: 'name', // if objects array passed which key to be displayed defaults to description
    search: true,
    limitTo: 0,
    height: '250px',
    enableSelectAll: true,
    searchBy: ['name'],
  };

  dataModel: CompanySelect[] = [];

  user: UserDto;
  roles: RolesDto[] = [];
  actionSelected: 'CREATE' | 'EDIT' | 'DELETE';

  loading = false;
  faTrash = faTrash;
  faEdit = faEdit;
  faXmark = faXmark;
  faUserPlus = faUserPlus;

  rows = [];
  columns = [];

  pagination = {
    currentPage: 1,
    itemsPerPage: 10,
    totalElements: 0,
    totalPages: 0
  };

  userForm: FormGroup;

  ngOnInit() {
    const userId = this.tokenService.getDataToken('id');
    this.companiesService.getCompaniesByUserId(+userId).subscribe((data) => {
      this.dataModel = data.map((company) => ({
        id: company.id,
        name: company.name
      }));
    });
    this.userForm = this.formBuilder.group({
      name: [null, Validators.required],
      lastName: [null, Validators.required],
      secondLastName: [null],
      email: [null, [Validators.required, Validators.email]],
      roleId: [null, Validators.required]
    });

    this.loadRoles();
    this.loadPage(this.pagination.currentPage);
  }

  loadRoles() {
    this.rolesService.getRoles().subscribe((response) => {
      this.roles = response;
    });
  }

  loadPage(page: number) {
    this.loading = true;
    this.usersService.getUsers(page, this.pagination.itemsPerPage).subscribe((response) => {
      this.rows = response.data;
      this.pagination.totalElements = response.pagination.totalElements;
      this.pagination.currentPage = response.pagination.currentPage;

      if (this.pagination.currentPage === 1 ||
        this.pagination.currentPage > this.pagination.totalPages) {
        this.pagination.totalPages = response.pagination.totalPages;
      }
      this.loading = false;
    });
  }

  open(content, data?: UserDto, action?: 'CREATE' | 'EDIT' | 'DELETE') {
    this.user = null;
    this.userForm.reset();
    this.singleSelect = [];
    this.actionSelected = action;
    if (data) {
      this.user = data;
    }

    if (action === 'EDIT') {
      this.loadUserEdit(data);
      this.singleSelect = data.companies.map((company) => ({
        id: company.id,
        name: company.name
      }));
    }

    this.modalService.open(content, { backdrop: 'static', keyboard: false })
      .result.then((result) => {
        console.log(result);
      }, (reason) => {
        console.log('Err!', reason);
      });
  }

  loadUserEdit(user: UserDto) {
    this.userForm.patchValue({
      name: user.name,
      lastName: user.lastName,
      secondLastName: user.secondLastName,
      email: user.email,
      roleId: user.roleId
    });
  }

  findRoleNameById(roleId: number) {
    return this.roles.find(role => role.id === roleId)?.name;
  }

  createUser() {
    this.loading = true;
    this.userForm.value.roleId = parseInt(this.userForm.value.roleId);
    this.usersService.createUser(this.userForm.value).subscribe(() => {
      this.toastr.success('Usuario creado correctamente!', 'Exito!', { progressBar: true });
      this.loadPage(this.pagination.currentPage);
      this.loading = false;
      this.userForm.reset();
      this.modalService.dismissAll();
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

  editUser() {
    this.loading = true;
    this.userForm.value.roleId = parseInt(this.userForm.value.roleId);
    this.usersService.editUser(this.user.id, this.userForm.value).subscribe(() => {
      this.toastr.success('Usuario editado correctamente!', 'Exito!', { progressBar: true });
      this.loadPage(this.pagination.currentPage);
      this.loading = false;
      this.userForm.reset();
      this.modalService.dismissAll();
    }, error => {
      let message = 'Error al editar el usuario!';
      if (error?.error?.message && error.error.message === 'USER_NOT_FOUND') {
        message = 'Usuario no encontrado!';
      }

      if (error?.error?.message && error.error.message === 'EMAIL_ALREADY_IN_USE') {
        message = 'Email en uso!';
      }

      console.error(error);
      this.toastr.error(message, 'Error!', { progressBar: true });
      this.loading = false;
    });
  }

  deleteUser() {
    this.loading = true;
    this.usersService.deleteUser(this.user.id).subscribe(() => {
      this.toastr.success('Usuario eliminado correctamente!', 'Exito!', { progressBar: true });
      this.loadPage(this.pagination.currentPage);
      this.loading = false;
      this.modalService.dismissAll();
    }, error => {
      console.error(error);
      this.toastr.error('Error al eliminar el usuario!', 'Error!', { progressBar: true });
      this.loading = false;
      this.modalService.dismissAll();
    });
  }

  selectionChanged(event) {
    console.log('event ->', event);
  }
}
