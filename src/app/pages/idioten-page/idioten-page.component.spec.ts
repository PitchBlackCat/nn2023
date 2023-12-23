import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdiotenPageComponent } from './idioten-page.component';

describe('IdiotenPageComponent', () => {
  let component: IdiotenPageComponent;
  let fixture: ComponentFixture<IdiotenPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdiotenPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IdiotenPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
