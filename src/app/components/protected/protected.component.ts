import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { ProtectedModel } from './protected.model';

@Component({
  selector: 'app-protected',
  templateUrl: './protected.component.html',
  styleUrls: ['./protected.component.scss']
})

export class ProtectedComponent implements OnInit {
  formValue !: FormGroup;
  protectedModelObj : ProtectedModel = new ProtectedModel();
  productData !: any;
  showAdd!: boolean;
  showUpdate!: boolean;

  constructor(private formBuilder : FormBuilder, private api : ApiService){
  }

  ngOnInit(): void {
    this.formValue = this.formBuilder.group({
      id : [''],
      name : [''],
      image : [''],
      category : [''],
      material : [''],
      price : [''],
      description : ['']
    })
    this.getAllProducts();
  }

  clickAddProduct(){
    this.formValue.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }

  postProductDetails(){
    this.protectedModelObj.name = this.formValue.value.name;
    this.protectedModelObj.image = this.formValue.value.image;
    this.protectedModelObj.category = this.formValue.value.category;
    this.protectedModelObj.material = this.formValue.value.material;
    this.protectedModelObj.price = Number(this.formValue.value.price);
    this.protectedModelObj.description = this.formValue.value.description;

    this.api.postProduct(this.protectedModelObj).subscribe(res=>{
      console.log(res);
      alert("Product added successfuly");
      let ref = document.getElementById('cancel');
      ref?.click();
      this.formValue.reset();
      this.getAllProducts();
    },
    err=>{
      alert("Something went wrong");
    }
    )
  }

  getAllProducts(){
    this.api.getProduct().subscribe(res=>{
      this.productData = res;
    })
  }

  deleteProduct(row : any){
    this.api.deleteProduct(row.id).subscribe(res=>{
      alert("Product deleted");
      this.getAllProducts();
    })
  }

  onEdit(row: any){
    this.protectedModelObj.id = row.id;
    this.formValue.controls['name'].setValue(row.name);
    this.formValue.controls['image'].setValue(row.image);
    this.formValue.controls['category'].setValue(row.category);
    this.formValue.controls['material'].setValue(row.material);
    this.formValue.controls['price'].setValue(row.price);
    this.formValue.controls['description'].setValue(row.description);
    this.showAdd = false;
    this.showUpdate = true;
  }

  updateProductDetails(){
    this.protectedModelObj.name = this.formValue.value.name;
    this.protectedModelObj.image = this.formValue.value.image;
    this.protectedModelObj.category = this.formValue.value.category;
    this.protectedModelObj.material = this.formValue.value.material;
    this.protectedModelObj.price = Number(this.formValue.value.price);
    this.protectedModelObj.description = this.formValue.value.description;
    this.api.updateProduct(this.protectedModelObj, this.protectedModelObj.id).subscribe(res=>{
      alert("Updated successfuly");
      let ref = document.getElementById('cancel');
      ref?.click();
      this.formValue.reset();
      this.getAllProducts();
    })
  }
}
