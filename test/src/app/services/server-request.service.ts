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
  link = "http://localhost:8000"

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

  // FOR FRIENDS
  async searchFriends(nickName : string): Promise<any>
  {
    return await firstValueFrom(this.http.post(`${this.link}/getPotentialFriends`, {nickName}, { withCredentials: true }));
  }
  async sendFriendRequest(nickName : string): Promise<any>
  {
    return await firstValueFrom(this.http.post(`${this.link}/sendFriendRequest`, {nickName}, { withCredentials: true }));
  }
  async getFriendRequests(): Promise<any>
  {
    return await firstValueFrom(this.http.post(`${this.link}/getFriendRequests`, {}, { withCredentials: true }));
  }
  async cancelFriendRequest(nickName : string, sent: boolean): Promise<any>
  {
    return await firstValueFrom(this.http.post(`${this.link}/cancelFriendRequest`, {nickName, sent}, { withCredentials: true }));
  }
  async acceptFriendRequest(nickName : string): Promise<any>
  {
    return await firstValueFrom(this.http.post(`${this.link}/acceptFriendRequest`, {nickName}, { withCredentials: true }));
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

  // FOR ADMIN
  async loginAdmin(object : any): Promise<any>
  {
    return await firstValueFrom(this.http.post(`${this.link}/admin/login`, object, { withCredentials: true }));
  }
  async adminAuthentication(): Promise<any>
  {
    return await firstValueFrom(this.http.get(`${this.link}/admin/authenticate`, { withCredentials: true }));
  }
}
