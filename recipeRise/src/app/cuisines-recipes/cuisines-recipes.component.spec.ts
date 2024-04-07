import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuisinesRecipesComponent } from './cuisines-recipes.component';

describe('CuisinesRecipesComponent', () => {
  let component: CuisinesRecipesComponent;
  let fixture: ComponentFixture<CuisinesRecipesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CuisinesRecipesComponent]
    });
    fixture = TestBed.createComponent(CuisinesRecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
