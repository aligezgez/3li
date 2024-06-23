import { Component, inject , OnInit } from '@angular/core';
import { DataSharingService } from './DataSharingService';
import { AuthService } from './auth.service';
import { RouterOutlet } from '@angular/router';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { HomeComponent } from './components/home/home.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,AngularFireStorageModule,HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers:[DataSharingService]
})
export class AppComponent {
  title = 'boti';
  authService = inject(AuthService)
  

  ngOnInit(): void{}
  
}
