import { HttpClient } from '@angular/common/http';
import { Injectable, Input, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Company } from 'src/app/shared/models/companies/companies.dto';
import { TokenService } from '../token/token.service';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  @Input() id!: string;
  // private readonly next = inject(ActivatedRouteSnapshot);

  getCompaniesByUserId(userId: number): Observable<Company[]> {
    return this.http.get<Company[]>(
      environment.API_URL + `/companies/user/${userId}`
    );
  }

  checkCompaniesByUserId(companyId: number): Observable<boolean> {
    const userId = this.tokenService.getDataToken('id');
    return this.http.get<boolean>(
      environment.API_URL + `/companies/${companyId}/user/${userId}`
    );
  }

  getCompanyRouteId(): number {
    // let companyId: number;
    // this.route.paramMap.subscribe(params => {
    //   companyId = +params.get('id');
    // });
    // const iddd = this.next.paramMap.get('id');
    // console.log('---->>>>>>', iddd);
    // this.route.params.subscribe(params => {
    //   console.log(ZZ)
    // });
    // console.log('company ---->>>>>>', this.id);
    return +this.id;
  }
}
