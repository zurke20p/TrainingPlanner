import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-muscle-scheme',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './muscle-scheme.component.html',
  styleUrl: './muscle-scheme.component.css'
})
export class MuscleSchemeComponent implements AfterViewInit{
  checkboxes = [
    { name: "Neck", value: "neck", checked: false},
  ]
  muscleForm = new FormGroup({
    muscles: new FormArray(this.checkboxes.map(el => new FormControl(el.checked))),
  });
  paths = [];
  @ViewChild('svgObject')
  svgObject!: ElementRef;

  ngAfterViewInit(): void {
    this.svgObject.nativeElement.addEventListener('load', () => {
      const svgDoc = this.svgObject.nativeElement.contentDocument;
      const paths = svgDoc.querySelectorAll('path');

      paths.forEach((path: any) => {
        path.addEventListener('click', (event: MouseEvent) => {
          const target = event.target as HTMLElement;
          // console.log(target.id);
          this.changeCheckBox(target)
        });
      });
    });
  }
  changeCheckBox(target: HTMLElement): void{
    const muscleName = target.id.split("_").length == 1 ? null : target.id.split("_")[1];
    if(muscleName == null)
      return;

    this.muscleForm.setControl("muscles", new FormArray(this.checkboxes.map(el => el.value == muscleName ? new FormControl(!(el.checked)) : new FormControl(el.checked))));
    this.checkboxes = this.checkboxes.map(el => el.value == muscleName ? {name: el.name, value: el.value, checked: !(el.checked)} : {name: el.name, value: el.value, checked: el.checked});
      
    console.log()
    
  }
}
