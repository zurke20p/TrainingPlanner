import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { User } from '../interfaces/user';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
}) 
export class ServerRequestService {

  constructor(private http: HttpClient) { }
  link = "http://localhost:8000"

  async register(user : User)
  {
    return await firstValueFrom(this.http.post(`${this.link}/register`, user, { withCredentials: true }));
  }
  async login(user : User)
  {
    return await firstValueFrom(this.http.post(`${this.link}/login`, user, { withCredentials: true }));
  }
}
