import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        
        window.location.reload();
      }
    });
  }
 
}