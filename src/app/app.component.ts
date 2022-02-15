import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { AlertController } from '@ionic/angular';
import { AuthenticationService } from './shared/authentication-service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/folder/Home', icon: 'home' },
    { title: 'Profile', url: '/profile', icon: 'person-circle' },
    { title: 'Logout', url: '/folder/Home', icon: 'log-out' }
  ];
  versionCode: string | number;
  username: string = "";

  constructor(private appVersion: AppVersion, private alertController: AlertController, public authService: AuthenticationService, private router: Router) {
    this.appVersion.getVersionCode().then(value => {
      this.versionCode = value;
    }).catch(err => {
      console.log(err);
    });
    console.log("AppvErsion", this.appVersion.getVersionCode())

    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (userDetails) {
      this.username = userDetails.firstName + " " + userDetails.lastName;
    }

    
  }

  logout(title) {
    if (title == "Logout") {
      const alert = this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Confirm!',
        message: 'Are you sure want to logout?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            id: 'cancel-button',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Okay',
            id: 'confirm-button',
            handler: () => {
              console.log('Confirm Okay');
              this.authService.SignOut()
                .then(res => {
                  console.log(res);
                  this.router.navigate(['login-page']);
                  this.authService.showAlert("","Logged out Successfully", "Ok")
                })
                .catch(error => {
                  console.log(error);
                })
            }
          }

        ]
      }).then(alert => alert.present());
    }
  }

}
