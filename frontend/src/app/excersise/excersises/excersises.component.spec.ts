import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcersisesComponent } from './excersises.component';

describe('ExcersisesComponent', () => {
  let component: ExcersisesComponent;
  let fixture: ComponentFixture<ExcersisesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExcersisesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExcersisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
