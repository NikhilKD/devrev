import {
  Component,
  Inject
} from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup
} from '@angular/fire/auth';
import {
  FormBuilder
} from '@angular/forms';
import {
  Router
} from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  errormessage: string = "";
  message: string = "";
  constructor(@Inject(Auth) private auth: Auth, private fb: FormBuilder, private router: Router) {}
  usersignup = this.fb.group({
    username: [''],
    password: ['']
  })
  signUpWithEmailPassword() {
    let email = String(this.usersignup.value.username);
    let password = String(this.usersignup.value.password);
    createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        sendEmailVerification(userCredential.user)
          .then((response) => {
            this.errormessage = ""
            this.message = "Please verify your email and Login."
          })
          .catch((error) => {
            this.errormessage = "Please enter a valid email."
            this.message = ""
          })
      })
      .catch((error) => {
        this.errormessage = "Email already exists."
        this.message = ""
      });


  }


  googleSignup(){
    signInWithPopup(this.auth, new GoogleAuthProvider())
    .then((result) =>{
      this.router.navigate(['dashboard/profile'])
    })
    .catch((error)=>{
      
    })
  }
}
