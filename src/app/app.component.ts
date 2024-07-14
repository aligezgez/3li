import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { DataSharingService } from './DataSharingService';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,  
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DataSharingService]
})
export class AppComponent implements OnInit {
  title = 'boti';
  authService = inject(AuthService);


  ngOnInit(): void {}
}
