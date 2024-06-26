import { Component, inject } from '@angular/core';
import { ServerRequestService } from '../../services/server-request.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-friend-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './friend-requests.component.html',
  styleUrl: './friend-requests.component.css'
})
export class FriendRequestsComponent {
  http = inject(ServerRequestService);

  displayrequests : boolean = false;
  sentFriendRequests : Array<string> = [];
  receivedFriendRequests : Array<string> = [];

  async showRequests(): Promise<void>{
    const res = await this.http.getFriendRequests();
    console.log(res)
    this.sentFriendRequests = res.msg[0];
    this.receivedFriendRequests = res.msg[1];
    this.displayrequests = true;
  }

  hideRequests(): void{
    this.displayrequests = false;
    this.sentFriendRequests = [];
    this.receivedFriendRequests = [];
  }

  async cancelRequest(nickName : string, sent : boolean): Promise<void>{
    const res = await this.http.cancelFriendRequest(nickName, sent);
    console.log(res)

    if(res.status == "ok"){
      let index = this.sentFriendRequests.indexOf(nickName);
      if (index !== -1) {
        this.sentFriendRequests.splice(index, 1);
      }

      index = this.receivedFriendRequests.indexOf(nickName);
      if (index !== -1) {
        this.receivedFriendRequests.splice(index, 1);
      }
    }
  }
  async acceptRequest(nickName : string): Promise<void>{
    const res = await this.http.acceptFriendRequest(nickName);
    console.log(res)

    if(res.status == "ok"){
      let index = this.receivedFriendRequests.indexOf(nickName);
      if (index !== -1) {
        this.receivedFriendRequests.splice(index, 1);
      }
    }
  }

}
