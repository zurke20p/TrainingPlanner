import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { User } from '../../interfaces/user';

import { ServerRequestService } from '../../services/server-request.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent 
{
  http = inject(ServerRequestService)

  loginForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
    password: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)])
  });

  async submitForm() {
    if(!this.loginForm.valid)
      return;

    const user: User = {
      username: this.loginForm.value.name as string,
      mail: "",
      password: this.loginForm.value.password as string
    }
    
    console.log(await this.http.login(user));
  }
}
