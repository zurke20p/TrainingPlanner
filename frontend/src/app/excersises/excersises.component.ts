import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';

import { ServerRequestService } from '../services/server-request.service';

import { Excersise } from '../interfaces/excersise';

@Component({
  selector: 'app-excersises',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './excersises.component.html',
  styleUrl: './excersises.component.css'
})
export class ExcersisesComponent implements OnInit {
  http = inject(ServerRequestService)
  location = inject(Location)

  async ngOnInit(): Promise<void> {
    const auth = await this.http.authentication();

    if(auth.status != "ok")
      this.location.back();
  }

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
  
  async submitForm(): Promise<void> {
    // if(!this.excersiseForm.valid)
    //   return;
    
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
