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

  public types = [
      'Партнер', 'Клиент'
  ];

  newPartyForm: FormGroup;

  type: FormControl;
  category: FormControl;
  organization: FormControl;
  email: FormControl;
  contact: FormControl;
  position: FormControl;
  phone: FormControl;
  comment: FormControl;

  constructor(public formbuilder: FormBuilder, private partiesService: PartiesService) { }

  createParty(event) {
    if (this.newPartyForm.controls.email.valid) {
      this.newPartyForm.controls.organization;
  	  this.partiesService.createNewParty(this.newPartyForm.get("type").value, this.newPartyForm.get("category").value, 
        this.newPartyForm.get("organization").value, this.newPartyForm.get("email").value, this.newPartyForm.get("contact").value,
        this.newPartyForm.get("position").value, this.newPartyForm.get("phone").value, this.newPartyForm.get("comment").value);
      
      console.log(this.newPartyForm.value);
      // this.newPartyForm.reset();
    }
  }

  ngOnInit() {
  	this.email = new FormControl("", [
  	  Validators.required, 
  	  Validators.pattern("[^ @]*@[^ @]*")
  	]);
    this.category = new FormControl('', [
      Validators.required
    ]);
    this.organization = new FormControl('', [
      Validators.required
    ]);
    this.contact = new FormControl('', [
      Validators.required
    ]);
    this.position = new FormControl('', [
      Validators.required
    ]);
    this.phone = new FormControl('', [
      Validators.required,
      Validators.pattern("[0-9]*")
    ]);
    this.comment = new FormControl('', [
      Validators.required
    ]);
    this.type = new FormControl('', [
      Validators.required
    ]);

  	this.newPartyForm = new FormGroup({
      type: this.type,
      category: this.category,
      organization: this.organization,
      email: this.email,
      contact: this.contact,
      position: this.position,
      phone: this.phone,
      comment: this.comment,
    });
  }

}
