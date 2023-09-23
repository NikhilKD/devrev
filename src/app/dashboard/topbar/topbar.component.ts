import { Component, Inject, OnInit } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit{
  email = ""
  constructor(@Inject(Auth) private auth: Auth, private router: Router, private cds: DashboardService) {}
  ngOnInit(): void {
    this.cds.getUsername().subscribe((res)=>{
      this.email = res.split('@')[0]
    })
  }

  appSignOut(){
    signOut(this.auth).then(() => {
      this.router.navigate([''])
    }).catch((error) => {
      alert(error);
    });
  }

}
