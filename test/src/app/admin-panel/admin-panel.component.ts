import { Component, OnInit, inject } from '@angular/core';
import { Location } from '@angular/common';

import { ServerRequestService } from '../services/server-request.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent implements OnInit {
  http = inject(ServerRequestService)
  location = inject(Location)

  async ngOnInit(): Promise<void> {
    const auth = await this.http.adminAuthentication();

    if(auth.status != "ok")
      return this.location.back();
  }

}
