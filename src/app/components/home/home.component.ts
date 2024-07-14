import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { RouterOutlet } from '@angular/router';


@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [HeaderComponent,RouterOutlet]
})
export class HomeComponent implements OnInit {

    constructor() { }
  
    ngOnInit(): void {
      
    }
  
   
  
  
  }