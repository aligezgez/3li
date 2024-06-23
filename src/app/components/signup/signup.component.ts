import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";


@Component({
    selector: 'app-signup',
    standalone: true,
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.css',
    imports: [HeaderComponent]
})
export class SignupComponent {

}
