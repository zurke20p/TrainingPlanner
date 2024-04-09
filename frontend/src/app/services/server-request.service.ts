import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { User } from '../interfaces/user';
import { Excersise } from '../interfaces/excersise';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
}) 
export class ServerRequestService {

  constructor(private http: HttpClient) { }
  link = "https://g5f6my-8000.csb.app"

  // FOR USERS
  async register(user : User): Promise<any>
  {
    return await firstValueFrom(this.http.post(`${this.link}/register`, user, { withCredentials: true }));
  }
  async login(user : User): Promise<any>
  {
    return await firstValueFrom(this.http.post(`${this.link}/login`, user, { withCredentials: true }));
  }
  async authentication(): Promise<any>
  {
    return await firstValueFrom(this.http.get(`${this.link}/user/authenticate`, { withCredentials: true }));
  }
  async logout(): Promise<any>
  {
    return await firstValueFrom(this.http.post(`${this.link}/logout`, {}, { withCredentials: true }));
  }

  // FOR EXCERSISES
  async addExcersise(excersise : Excersise): Promise<any>
  {
    return await firstValueFrom(this.http.post(`${this.link}/excersise/add`, excersise, { withCredentials: true }));
  }
  async getExcersises(): Promise<any>
  {
    return await firstValueFrom(this.http.get(`${this.link}/excersise`, { withCredentials: true }));
  }
}
