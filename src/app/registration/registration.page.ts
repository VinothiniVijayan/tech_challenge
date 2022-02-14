import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup,Validators,FormControl} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../shared/authentication-service';
import { User, UserDetails } from '../shared/user';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

  firstName:string;
  lastName:string;
  mobileNo:number;
  address:string;
  emailId:string;
  password:string;
  confirmPwd:string;

  // validations_form: FormGroup;
  errorMessage: string = '';

  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ]
  };
  constructor(
    private authService: AuthenticationService,
    // private formBuilder: FormBuilder,
    private router:Router) { }

  ngOnInit() {
    // this.validations_form = this.formBuilder.group({
    //   email: new FormControl('', Validators.compose([
    //     Validators.required,
    //     Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
    //   ])),
    //   password: new FormControl('', Validators.compose([
    //     Validators.minLength(5),
    //     Validators.required
    //   ]))
    // });
  }

  registerAccount(){
    if (this.firstName && this.lastName && this.mobileNo && this.emailId && this.address && this.password && this.confirmPwd) {
      if(this.password == this.confirmPwd){
      this.authService.RegisterUser(this.emailId, this.password)
        .then((res) => {
          this.authService.setUserDetails(this.firstName, this.lastName, this.mobileNo , this.emailId, this.address);
          this.authService.showAlert("","Account created successfully", "Ok");
          this.router.navigate(['login-page']);
        }).catch((error) => {
          let msg = error.message;
          if (msg.indexOf("email-already-in-use") != -1) {
            this.authService.showAlert("Failed","The email address is already in use.", "Ok");
          } else {
            this.authService.showAlert("Failed",error.message, "Ok");
          }
        })
      } else{
        this.authService.showAlert("Failed","Passwords should be same","Ok");
      }
    } else {
      this.authService.showAlert("Failed","Invalid details entered", "Ok");
    }
  }


}
