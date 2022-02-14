import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthenticationService } from '../shared/authentication-service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.page.html',
  styleUrls: ['./login-page.page.scss'],
})
export class LoginPagePage implements OnInit {

  constructor(private router: Router, private authService: AuthenticationService, private alertController: AlertController) { }

  ngOnInit() {
  }

  /**Register User */
  onSubmit() {
    this.router.navigate(['registration']);
  }

  /**Login */
  logIn(email, password) {
    console.log("Email",email.value);
    if (email.value && password.value) {
      this.authService.SignIn(email.value, password.value)
        .then((res) => {
            this.router.navigate(['/folder/Home']);
        }).catch((error) => {
          
            this.authService.showAlert("Failed",error.message, "Ok")
        })
    } else {
      this.authService.showAlert("Failed","Invalid Email Id /Password", "Ok")
    }
  }

  /**Login with Gmail */
  loginWithGmail(){
    this.authService.GoogleAuth();
    const user = JSON.parse(localStorage.getItem('user'));
    console.log("userdata",user);
  }

  
}
