import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserModel } from './user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit{


  formValue !: FormGroup;
  userModelObj : UserModel = new UserModel();
  userData !: any;
  showAdd!: boolean;
  showUpdate!: boolean;

  constructor(public authService: AuthService, public apiService:ApiService, private route:ActivatedRoute, private formBuilder : FormBuilder) {
  }

  ngOnInit(): void {
    this.formValue = this.formBuilder.group({
      id : [''],
      firstName : [''],
      lastName : [''],
      username : [''],
      password : ['']
    })
  }



  postUserDetails(){
    this.userModelObj.firstName = this.formValue.value.firstName;
    this.userModelObj.lastName = this.formValue.value.lastName;
    this.userModelObj.username = this.formValue.value.username;
    this.userModelObj.password = this.formValue.value.password;
    this.userModelObj.isAdmin = "false";

    this.apiService.postUser(this.userModelObj).subscribe(res=>{
      console.log(res);
      alert("Korisnik je uspesno dodat!");
      this.formValue.reset();
    },
    err=>{
      alert("Greška!");
    }
    )
  }

}
