import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCompaniesComponent } from './home-companies.component';

describe('HomeCompaniesComponent', () => {
  let component: HomeCompaniesComponent;
  let fixture: ComponentFixture<HomeCompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeCompaniesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
