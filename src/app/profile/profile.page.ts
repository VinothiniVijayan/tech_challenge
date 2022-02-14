import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import {  CameraResultType,CameraSource } from '@capacitor/camera';
import { Plugins } from '@capacitor/core';
import { User } from '../shared/user';
import { AuthenticationService } from '../shared/authentication-service';

const { Camera } = Plugins;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  public base64Image: string;
  userDetails:string;
  firstName:string;
  lastName:string;
  mobileNo:number;
  address:string;
  emailId:string;
  isEdit:boolean = false;
  
  constructor(public photoService:PhotoService,private authService:AuthenticationService) { }

  ngOnInit() {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    console.log("profile userDetails",userDetails);
    this.firstName = userDetails.firstName;
    this.lastName = userDetails.lastName;
    this.mobileNo = userDetails.mobileNo;
    this.address = userDetails.address;
    this.emailId = userDetails.email;
    const userData = localStorage.getItem('profilePic');
    if(userData){
      this.base64Image = userData;
    }
  }

  public async uploadProfPic() {
    // Take a photo
    console.log("Upload pic")
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    this.base64Image = capturedPhoto.webPath;
    
    localStorage.setItem("profilePic",this.base64Image);
  }

  editDetails(){
    console.log("Edit details");
    this.isEdit = true;
  }

  saveDetails(){
    if (this.firstName && this.lastName && this.mobileNo && this.emailId && this.address) {
      this.authService.setUserDetails(this.firstName, this.lastName, this.mobileNo , this.emailId, this.address);
      this.authService.showAlert("Success","Profile Details changed Successfully","Ok");
      this.isEdit = false;
    } else {
      this.authService.showAlert("Failed","Invalid details entered", "Ok");
    }
  }

  changePassword(){
    this.authService.ResetPassword(this.emailId).then((res) =>{
      this.authService.showAlert("Success","Password reset email has been sent, please check your inbox.","Ok");
    }).catch((err) =>{
      this.authService.showAlert("Failed",err.message,"Ok");
    })
  }
}
