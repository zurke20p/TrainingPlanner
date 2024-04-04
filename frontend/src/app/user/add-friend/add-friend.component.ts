import { Component, inject } from '@angular/core';

import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ServerRequestService } from '../../services/server-request.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-friend',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-friend.component.html',
  styleUrl: './add-friend.component.css'
})
export class AddFriendComponent {
  potentialFriendList : Array<string> = [];

  http = inject(ServerRequestService);

  searchForm = new FormGroup({
    nickName : new FormControl(''),
  });

  async submitForm(): Promise<void> {
    const res = await this.http.searchFriends(this.searchForm.value.nickName as string);

    if(res.status == "err")
      this.potentialFriendList = [];
    else
      this.potentialFriendList = res.msg;
  }
  async sendFriendRequest(nickName : string): Promise<void>{
    const res = await this.http.sendFriendRequest(nickName as string);
    console.log(res)
    this.submitForm()
  }
}
