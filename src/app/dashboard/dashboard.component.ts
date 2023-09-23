import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{



  constructor(private router: Router, private cds: DashboardService, @Inject(Auth) private auth: Auth){
  }



  public user: any;
  public email: string | null = ""
  ngOnInit(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        if(user.emailVerified){
          this.cds.changeUser(String(user.email))
        }else{
          this.router.navigate([''])
        }
        
      } else {
        this.router.navigate([''])
      }
    });
  }


  routeChange(){
    this.cds.activeData(String(this.router.url))
  }
}
