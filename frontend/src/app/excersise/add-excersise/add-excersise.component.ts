import { Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ServerRequestService } from '../../services/server-request.service';

import { Excersise } from '../../interfaces/excersise';
import { MuscleSchemeComponent } from "../muscle-scheme/muscle-scheme.component";

@Component({
    selector: 'app-add-excersise',
    standalone: true,
    templateUrl: './add-excersise.component.html',
    styleUrl: './add-excersise.component.css',
    imports: [ReactiveFormsModule, CommonModule, MuscleSchemeComponent]
})
export class AddExcersiseComponent {
  http = inject(ServerRequestService)

  checkboxes = [
    { name: "Dumbbells", value: "dumbbells" },
    { name: "Machine", value: "machine" },
    { name: "Kettlebells", value: "kettlebells" },
    { name: "Cables", value: "cables" },
    { name: "Plate", value: "plate" },
    { name: "Smith Machine", value: "smith" },
    { name: "Barbell", value: "barbell" },
    { name: "Bodyweight", value: "bodyweight" },
    { name: "Medicine Ball", value: "medBall" },
    { name: "Stretches", value: "stretches" },
    { name: "TRX", value: "trx" },
    { name: "Bosu Ball", value: "bosuBall" },
  ]

  excersiseForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    desc: new FormControl(''),
    type: new FormControl('', [Validators.required]),
    equipment: new FormArray(this.checkboxes.map(el => new FormControl(false))),
    visibility: new FormControl('public'),
    videoTimeStamp: new FormControl(''),
    videoLink: new FormControl(''),
  });

  receiveMuscles(event: Array<object>){
    console.log(event);
  }
  
  async submitForm(): Promise<void> {
    if(!this.excersiseForm.valid)
      return;
    
    const arr = new Array();
    for (const [index, checkbox] of this.checkboxes.entries())
      if(this.excersiseForm.value.equipment![index])
        arr.push(checkbox.value);

    const excersise: Excersise = {
      title: this.excersiseForm.value.title as string,
      desc: this.excersiseForm.value.desc as string,
      type: this.excersiseForm.value.type as string,
      equipment: arr,
      visibility: this.excersiseForm.value.visibility as string,
      videoTimeStamp: this.excersiseForm.value.videoTimeStamp as string,
      videoLink: this.excersiseForm.value.videoLink as string,
    }

    console.log(await this.http.addExcersise(excersise));
  }
}
