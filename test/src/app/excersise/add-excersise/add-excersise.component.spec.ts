import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExcersiseComponent } from './add-excersise.component';

describe('AddExcersiseComponent', () => {
  let component: AddExcersiseComponent;
  let fixture: ComponentFixture<AddExcersiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddExcersiseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddExcersiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
