import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { ServerRequestService } from '../services/server-request.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  http = inject(ServerRequestService)
  location = inject(Location)

  adminForm = new FormGroup({
    passwordF: new FormControl('', [Validators.required]),
    passwordS: new FormControl('', [Validators.required])
  });

  async ngOnInit(): Promise<void> {
    const auth = await this.http.adminAuthentication();

    if(auth.status == "ok")
      return this.location.go("/admin/panel");
  }

  async submitForm() {
    const object = {
      passwordF: this.adminForm.value.passwordF as string,
      passwordS: this.adminForm.value.passwordS as string
    }
    
    console.log(await this.http.loginAdmin(object));
  }
}
