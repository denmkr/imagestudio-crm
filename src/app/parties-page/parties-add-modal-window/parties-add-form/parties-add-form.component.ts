import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { PartiesService } from '../../parties.service';

@Component({
  selector: 'parties-add-form',
  templateUrl: './parties-add-form.component.html',
  styleUrls: ['./parties-add-form.component.css'],
  providers: [PartiesService]
})
export class PartiesAddFormComponent implements OnInit {

  public parties = [
      'Vilnius', 'Kaunas'
  ];

  newPartyForm: FormGroup;
  email: FormControl;
  password: FormControl;
  city: FormControl;

  constructor(public formbuilder: FormBuilder, private partiesService: PartiesService) { }

  createParty(event) {
  	if (this.newPartyForm.controls.password.valid) {
  	  this.partiesService.createNewParty(this.newPartyForm.get("email").value, this.newPartyForm.get("password").value);
      console.log(this.newPartyForm.value);
    }
  }

  ngOnInit() {

  	this.email = new FormControl("", [
  	  Validators.required, 
  	  Validators.pattern("[^ @]*@[^ @]*")
  	]);

    this.password = new FormControl('', [
      Validators.minLength(8), 
      Validators.required
    ]);

    this.city = new FormControl('', [
      Validators.minLength(8), 
      Validators.required
    ]);

  	this.newPartyForm = new FormGroup({
      email: this.email,
      password: this.password,
      city: this.city
    });

  }

}
