import { Component, Inject, OnInit } from '@angular/core';
import {
  Auth,
  onAuthStateChanged
} from '@angular/fire/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{
  public user: any;
  public email: string | null = ""
  constructor(@Inject(Auth) private auth: Auth, private router: Router) {}
  ngOnInit(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        if(user.emailVerified){
          this.email = user.email
          console.log(user.email);
          const uid = user.uid;
        }else{
          this.router.navigate([''])
        }
        
      } else {
        this.router.navigate([''])
      }
    });
  }

  

}
