import { Component, OnInit, Sanitizer, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

import { DomSanitizer } from '@angular/platform-browser';

import { AddExcersiseComponent } from '../add-excersise/add-excersise.component';

import { ServerRequestService } from '../../services/server-request.service';

import { Excersise } from '../../interfaces/excersise';

@Component({
  selector: 'app-excersises',
  standalone: true,
  imports: [CommonModule, AddExcersiseComponent],
  templateUrl: './excersises.component.html',
  styleUrl: './excersises.component.css'
})
export class ExcersisesComponent implements OnInit {
  http = inject(ServerRequestService)
  location = inject(Location)
  sanitizer = inject(DomSanitizer)

  excersises = new Array()

  async ngOnInit(): Promise<void> {
    const auth = await this.http.authentication();

    if(auth.status != "ok")
      return this.location.back();

    const { status, msg } = await this.http.getExcersises();
    if(status != "ok")
      return this.location.back();

    msg.forEach((el: any) =>
    {
      el.equipment = JSON.parse(el.equipment);
      if(el.videoType == "yt")
        el.videoLink = this.sanitizer.bypassSecurityTrustResourceUrl(el.videoLink);
    });
    this.excersises = msg;
  }
}
