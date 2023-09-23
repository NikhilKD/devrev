import { Component, Inject } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {

  constructor(@Inject(Auth) private auth: Auth, private router: Router) {}

  appSignOut(){
    signOut(this.auth).then(() => {
      this.router.navigate([''])
    }).catch((error) => {
      alert(error);
    });
  }

}
