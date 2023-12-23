import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcosystemPageComponent } from './ecosystem-page.component';

describe('GamePageComponent', () => {
  let component: EcosystemPageComponent;
  let fixture: ComponentFixture<EcosystemPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcosystemPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EcosystemPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
