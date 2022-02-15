import { Injectable, NgZone } from '@angular/core';
import firebase from 'firebase/compat/app';
import { User, UserDetails } from "./user";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';
import '@codetrix-studio/capacitor-google-auth';
import { Plugins } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userData: any;
  constructor(
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    public alertController: AlertController
  ) {
    this.ngFireAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    })
  }
  // Login in with email/password
  SignIn(email, password) {
    return this.ngFireAuth.signInWithEmailAndPassword(email, password)
  }
  // Register user with email/password
  RegisterUser(email, password) {
    return this.ngFireAuth.createUserWithEmailAndPassword(email, password)
  }

  // Recover password
  ResetPassword(passwordResetEmail) {
    return this.ngFireAuth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        // window.alert('Password reset email has been sent, please check your inbox.');
      }).catch((error) => {
        window.alert(error)
      })
  }
  // Returns true when user is looged in
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }
  // Returns true when user's email is verified
  get isEmailVerified(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user.emailVerified !== false) ? true : false;
  }

  // Sign in with Gmail
  GoogleAuth() {
    return this.AuthLogin(new firebase.auth.GoogleAuthProvider());;
    // const result = await GoogleAuth.signIn();
    // if (result) { 
    //   console.log(result);
    //  }
  }

  async googleSignup() {
    const googleUser = await Plugins.GoogleAuth.signIn(null) as any;
    console.log('my user: ', googleUser);
    this.setUserDetails(googleUser.displayName,"","",googleUser.email,"")
    this.router.navigate(['/folder/Home']);
  }

  // Auth providers
  AuthLogin(provider) {
    return this.ngFireAuth.signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['/folder/Home']);
        })
        console.log(result.user);
        this.SetUserData(result.user);
      }).catch((error) => {
        window.alert(error)
      })
  }

  redirectApp(){
    return this.ngFireAuth.signInWithRedirect(new firebase.auth.GoogleAuthProvider())
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['/folder/Home']);
        })
        console.log(result);
        // this.SetUserData(result);
      }).catch((error) => {
        window.alert(error)
      })

  }

  // Store user in localStorage
  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    return userRef.set(userData, {
      merge: true
    })
  }
  // Sign-out 
  SignOut() {
    return this.ngFireAuth.signOut().then(() => {
      localStorage.removeItem('user');
      // this.router.navigate(['login']);
    })
  }

  showAlert(title,message, btnName) {
    const alert = this.alertController.create({
      cssClass: 'my-custom-class',
      header: title,
      message: message,
      buttons: [
        {
          text: btnName,
          id: 'confirm-button',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    }).then(alert => alert.present());
  }

  setUserDetails(firstName,lastName,mobileNo,emailId,address){
    const userData: UserDetails = {
      firstName: firstName,
      email: emailId,
      lastName: lastName,
      address: address,
      mobileNo: mobileNo
    }
    localStorage.setItem("userDetails",JSON.stringify(userData));
    JSON.parse(localStorage.getItem('userDetails'));
    console.log("localStorage USerdetails ", userData);
  }
}