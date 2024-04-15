import { Component, OnInit, inject } from '@angular/core';
import { Location } from '@angular/common';

import { AddFriendComponent } from '../add-friend/add-friend.component';
import { FriendRequestsComponent } from '../friend-requests/friend-requests.component';
import { ServerRequestService } from '../../services/server-request.service';
@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [AddFriendComponent, FriendRequestsComponent],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.css'
})
export class FriendsComponent implements OnInit{
  http = inject(ServerRequestService)
  location=inject(Location)
  async ngOnInit(): Promise<void> {
    const auth = await this.http.authentication();

    if(auth.status != "ok")
      return this.location.back();
  }
}
