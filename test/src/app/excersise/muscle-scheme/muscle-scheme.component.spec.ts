import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuscleSchemeComponent } from './muscle-scheme.component';

describe('MuscleSchemeComponent', () => {
  let component: MuscleSchemeComponent;
  let fixture: ComponentFixture<MuscleSchemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MuscleSchemeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MuscleSchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
