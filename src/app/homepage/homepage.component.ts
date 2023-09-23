import {
  Component,
  Inject,
  OnInit
} from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from '@angular/fire/auth';
import {FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit{
  constructor(@Inject(Auth) private auth: Auth, private fb: FormBuilder, private router: Router) {}
  ngOnInit(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        if(user.emailVerified){
          this.router.navigate(['dashboard/profile'])
        }
        
      }
    });
  }

  public errormessage: string = "";

  userLogin = this.fb.group({
    username: [''],
    password: ['']
  })

  loginWithEmailPassword() {
    let email = String(this.userLogin.value.username);
    
    let password = String(this.userLogin.value.password);
    try {
      signInWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          if(userCredential.user.emailVerified == true){
            this.router.navigate(['dashboard/profile'])
          }else{
            this.errormessage = "Verify your email."
          }
        })
        .catch((error) => {
          this.errormessage = "Invalid Credential! Please try again."
        });
    } catch (error: any) {
      alert("Login Failed")
    }

  }

  googleLogin(){
    signInWithPopup(this.auth, new GoogleAuthProvider())
    .then((result) =>{
      this.router.navigate(['dashboard/profile'])
    })
    .catch((error)=>{
      console.error('Google Sign-In error:', error);
    })
  }
}