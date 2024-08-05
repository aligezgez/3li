import { Component, ElementRef, OnInit, ViewChild, Inject,PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';
import 'firebase/database'; 
import { getApps, initializeApp } from 'firebase/app';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SidebarService } from './sidebar.service';
import { FormsModule } from '@angular/forms';
import { User } from '../../user.interface';
import { isPlatformBrowser } from '@angular/common';
import { getStorage, ref, uploadString, getDownloadURL, uploadBytesResumable } from 'firebase/storage';



@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterModule,CommonModule,FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [
    trigger('fadeInOut', [
      state('true', style({ transform: 'translateX(0)', opacity: 1 })),
      state('false', style({ transform: 'translateX(-250px)', opacity: 0 })),
      transition('true <=> false', [
        animate('300ms ease-in-out')
      ])
    ])
  ],
  providers: [AuthService] 
})

export class dashboardComponent implements OnInit  {
  
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  constructor(private authService: AuthService, private router: Router,private sidebarService: SidebarService ,  @Inject(PLATFORM_ID) private platformId: Object ) {}

  username: string | null = null;
  sidebarVisible = true;
  users: any[] = [];
  filteredUsers: any[] = [];
  searchQuery: string = '';
  profileImageUrl: string | null = null;
  private storage = getStorage();

  firebaseConfig = {
    apiKey: "AIzaSyD9Tpq9T_gl8tpuCdpTPKIrS0cfBTwhAQE",
    authDomain: "convo-310a6.firebaseapp.com",
    databaseURL: "https://convo-310a6-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "convo-310a6",
    storageBucket: "convo-310a6.appspot.com",
    messagingSenderId: "762195961453",
    appId: "1:762195961453:web:6bf922d2b6e7b6d7f44164",
    measurementId: "G-0LR343DP4N"
  };
  
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImageUrl = e.target.result; 
        this.saveProfileImage(this.profileImageUrl!); 
      };
      reader.readAsDataURL(file);
  
      
      this.uploadProfileImage(file);
    }
  }
  
  uploadProfileImage(file: File) {
    const userId = this.authService['getUserId']();
    const storageRef = ref(this.storage, `profileImages/${userId}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error('Upload failed:', error);
      },
      () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          this.saveProfileImage(downloadURL); // Save the image URL to local storage
        });
      }
    );
  }
  

  sendrequest(user:User):void {
    user.friendrequest=!user.friendrequest;
  }

  toggleSidebar():void{
    console.log(this.sidebarVisible);
    this.sidebarVisible=!this.sidebarVisible;
    console.log(this.sidebarVisible);
  }


  

  onInputChange(): void {
    if (this.searchQuery.trim().length > 0 ) {
      console.log('Input detected:', this.searchQuery);
      
      this.searchUsers();
    } else {
      console.log('Input cleared.');
      this.filteredUsers = [];
    }
  }

  ngOnInit() {
    
    if (isPlatformBrowser(this.platformId)) {
      
      this.loadProfileImage();
    }

      
    this.username = this.authService.getUsername(); 
    console.log('Username in DashboardComponent:', this.username);

    this.fetchUsers();

    if (!getApps().length) {
      initializeApp(this.firebaseConfig);
    }

    this.sidebarService.sidebarVisibility$.subscribe((isVisible: boolean) => {
      console.log(isVisible)
      this.sidebarVisible = isVisible;
    });
    
  }

  

  saveProfileImage(imageUrl: string) {
    localStorage.setItem('profileImageUrl', imageUrl);
    console.log('Profile image saved:', imageUrl);
  }


  loadProfileImage() {
    const storedImageUrl = localStorage.getItem('profileImageUrl');
    if (storedImageUrl) {
      this.profileImageUrl = storedImageUrl;
      console.log('Profile image loaded:', storedImageUrl);
    } else {
      this.profileImageUrl = 'assets/images/user.png'; 
    }
  }


  fetchUsers(): void {
    this.sidebarService.getUsers().subscribe(users => {
      this.users = users.map(user => ({
        ...user,
        profileImageUrl: user.profileImageUrl || 'assets/images/user.png'
      }));
      this.filteredUsers = this.users.filter(user => user.name.toLowerCase() !== this.username?.toLowerCase());
    }, error => {
      console.error('Error fetching users:', error);
    });
  }
  

  searchUsers(): void {
    console.log('10')
    const query = this.searchQuery.toLowerCase();
    this.filteredUsers = this.users.filter(user => user.name.toLowerCase().startsWith(query) && user.name.toLowerCase() !== this.username?.toLowerCase() ) ;
  }


  logout(): void {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']); 
    });
  }

 
}

