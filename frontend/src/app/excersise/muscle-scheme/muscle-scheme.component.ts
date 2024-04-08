import { AfterViewInit, Component, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
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
    { name: "Shoulders-front-deltoid", value: "shoulders-front-deltoid", checked: false},
    // { name: "Shoulders-side-deltoid", value: "shoulders-side-deltoid", checked: false},
    { name: "Shoulders-rear-deltoid", value: "shoulders-rear-deltoid", checked: false},
    // { name: "Upper chest", value: "upper-chest", checked: false},
    { name: "Chest", value: "chest", checked: false},
    { name: "Abominals", value: "abs", checked: false},
    { name: "Obliques", value: "obliques", checked: false},
    { name: "Lats", value: "lats", checked: false},
    { name: "Traps", value: "traps", checked: false},
    { name: "Rotatores", value: "rotatores", checked: false},
    { name: "Spinal erectors", value: "spinal-erectors", checked: false},
    { name: "Biceps short head", value: "biceps-short-head", checked: false},
    { name: "Biceps long head", value: "biceps-long-head", checked: false},
    { name: "Triceps lateral head", value: "triceps-lateral-head", checked: false},
    { name: "Triceps medial head", value: "triceps-medial-head", checked: false},
    { name: "Triceps long head", value: "triceps-long-head", checked: false},
    { name: "Forearms", value: "forearms", checked: false},
    { name: "Hands", value: "hands", checked: false},
    { name: "Thighs", value: "thighs", checked: false},
    { name: "Inner thighs", value: "inner-thighs", checked: false},
    { name: "Glutes", value: "glutes", checked: false},
    { name: "Hamstrings", value: "hamstrings", checked: false},
    { name: "Calves", value: "calves", checked: false},
    { name: "Anterior", value: "anterior", checked: false},
  ]

  muscleForm = new FormGroup({
    muscles: new FormArray(this.checkboxes.map(el => new FormControl(el.checked))),
  });

  paths = [];

  @Output() changedMuscleEvent = new EventEmitter<Array<object>>();

  @ViewChild('svgObject')
  svgObject!: ElementRef;

  ngAfterViewInit(): void {
    this.svgObject.nativeElement.addEventListener('load', () => {
      const svgDoc = this.svgObject.nativeElement.contentDocument;
      this.paths = svgDoc.querySelectorAll('path');

      this.paths.forEach((path: any) => {
        path.addEventListener('click', (event: MouseEvent) => {
          const target = event.target as HTMLElement;
          console.log(target.id);
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
    this.paths.forEach((path) => {

      if((path['id'] as string).includes("_")){
        this.checkboxes.forEach(el => {
          if(el.value == (path['id'] as string).split("_")[1])
            (path as HTMLElement).style.fill = el.checked ? "#e01616" : "#3f3f3f";
        })
      }
    })
    
    this.changedMuscleEvent.emit(this.checkboxes);
  }
}
