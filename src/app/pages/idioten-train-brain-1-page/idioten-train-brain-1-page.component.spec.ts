import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdiotenTrainBrain1PageComponent } from './idioten-train-brain-1-page.component';

describe('IdiotenTrainBrain1PageComponent', () => {
  let component: IdiotenTrainBrain1PageComponent;
  let fixture: ComponentFixture<IdiotenTrainBrain1PageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdiotenTrainBrain1PageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IdiotenTrainBrain1PageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
