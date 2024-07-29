import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

export interface StepType {
  label: string;
  fields: FormlyFieldConfig[];
}

@Component({
  selector: 'app-multi-step-form',
  templateUrl: './multi-step-form.component.html',
  styleUrls: ['./multi-step-form.component.css'],
})
export class MultiStepFormComponent {
  isLinear = true;
  multiStepForms!: FormGroup;
  steps!: Array<{
    label: string;
    fields: FormlyFieldConfig[];
    controlName: string;
  
  }>;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.multiStepForms = this.fb.group({
      basic: this.fb.group({
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
      }),
      contact: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
        fax: ['', Validators.required],
      }),
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        pin: ['', Validators.required],
      }),
    });

    this.steps = [
      {
        label: 'Basic Info',
        fields: [
          {
            key: 'firstname',
            type: 'input',
            templateOptions: {
              label: 'First Name',
              placeholder: 'First name',
              required: true,
            },
          },
          {
            key: 'lastname',
            type: 'input',
            templateOptions: {
              label: 'Last Name',
              placeholder: 'Last name',
              required: true,
            },
          },
        ],
        controlName: 'basic',
     
      },
      {
        label: 'Contact Info',
        fields: [
          {
            key: 'email',
            type: 'input',
            templateOptions: {
              label: 'Email',
              placeholder: 'Email',
              required: true,
              type: 'email',
            },
          },
          {
            key: 'phone',
            type: 'input',
            templateOptions: {
              label: 'Phone',
              placeholder: 'Phone',
              required: true,
            },
          },
          {
            key: 'fax',
            type: 'input',
            templateOptions: {
              label: 'Fax',
              placeholder: 'Fax',
              required: true,
            },
          },
        ],
        controlName: 'contact',
      },
      {
        label: 'Address',
        fields: [
          {
            key: 'street',
            type: 'input',
            templateOptions: {
              label: 'Street',
              placeholder: 'Street',
              required: true,
            },
          },
          {
            key: 'city',
            type: 'input',
            templateOptions: {
              label: 'City',
              placeholder: 'City',
              required: true,
            },
          },
          {
            key: 'pin',
            type: 'input',
            templateOptions: {
              label: 'PIN',
              placeholder: 'Pin',
              required: true,
            },
          },
        ],
        controlName: 'address',
    
      },
    ];
  }
 
  getFormGroup(controlName: string): FormGroup | null {
    const control = this.multiStepForms.get(controlName);
    return control instanceof FormGroup ? control : null;
  }
  submit() {
    if (this.multiStepForms.valid) {
      console.log(this.multiStepForms.value);
      // handle submission
    }
  }
  
}
