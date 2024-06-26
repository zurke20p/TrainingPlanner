import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { User } from '../../interfaces/user';

import { ServerRequestService } from '../../services/server-request.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent
{
  http = inject(ServerRequestService)

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]),
    mail: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)])
  });

  async submitForm(): Promise<void> {
    if(!this.registerForm.valid)
      return;

    const user: User = {
      username: this.registerForm.value.name as string,
      mail: this.registerForm.value.mail as string,
      password: this.registerForm.value.password as string
    }
    
    console.log(await this.http.register(user));
  }
}
