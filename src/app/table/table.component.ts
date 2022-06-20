import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { MatTableDataSource } from '@angular/material/table';
export interface PeriodicElement {
  name: string;
  usertype: string;
  entity: string;
  status: boolean;
  action: Array<string>;
  id: number;
}

// Interface Select Entity
interface SelectForm {
  value: string;
  viewValue: string;
}

// Interface Form
interface FormData {
  email: string;
  firstname: string;
  lastname: string;
  entity: string;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  updateDataStaff: any = {};
  updateData: boolean = false;
  formSubmit: any = {};
  newData: Array<object> = [];
  data: PeriodicElement[] = [];
  constructor(
    public ApiService: ApiService,
    private _formBuilder: FormBuilder
  ) {}

  // Email Form
  email = new FormControl('', [Validators.required, Validators.email]);

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  // Civility Form
  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl('auto' as FloatLabelType);
  options = this._formBuilder.group({
    hideRequired: this.hideRequiredControl,
    floatLabel: this.floatLabelControl,
  });
  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value || 'auto';
  }

  // Select Etity, Company, User Type
  entities: SelectForm[] = [{ value: 'Company', viewValue: 'Company' }];
  companies: SelectForm[] = [{ value: 'McDonald', viewValue: 'McDonald' }];
  statusstaff: SelectForm[] = [
    { value: 'true', viewValue: 'Active' },
    { value: 'false', viewValue: 'Off' },
  ];
  userTypes: SelectForm[] = [
    { value: 'Hr', viewValue: 'HR' },
    { value: 'Mentor', viewValue: 'Mentor' },
  ];

  // Crud Data
  ngOnInit(): void {
    this.addData();
  }
  newAddData(data: any) {
    let newObj: any = {};
    newObj['name'] = `${data.firstname} ${data.lastname} ${data.civility}`;
    newObj['usertype'] = data.usertype;
    newObj['entity'] = data.entity;
    newObj['action'] = ['mode_edit', 'delete'];
    newObj['id'] = data.id;
    if (data.status === 'true') {
      newObj['status'] = 'check_circle';
    } else {
      newObj['status'] = 'cancel';
    }
    this.data.push(newObj);
    this.showUser();
  }

  newUpdateData(data: any, dataCurrent: any) {
    let getDataCurrent: any = data.filter(
      (dt: any) => dt.id === dataCurrent.id
    );

    this.updateDataStaff = getDataCurrent[0];
  }
  addData(dataUser: any = []) {
    this.ApiService.getAll().subscribe((res) => {
      this.data = [];

      if (!this.updateData) {
        res.map((data: any) => {
          this.newAddData(data);
        });
      } else {
        this.newUpdateData(res, dataUser);
      }
    });
  }

  displayedColumns: string[] = [
    'name',
    'usertype',
    'entity',
    'status',
    'action',
  ];

  dataSource = new MatTableDataSource<PeriodicElement>();
  showUser() {
    this.dataSource.data = this.data;
  }
  getIdStaff(id: number) {
    this.ApiService.removeData(id).subscribe((res) => {
      this.addData();
    });
  }

  updateStaff(dataUser: PeriodicElement) {
    this.updateData = true;
    this.onShow();
    this.addData(dataUser);
  }
  // Handle Event
  onChange(e: any) {
    let buttonSubmit: any = document.querySelector('.btn-submit');
    let newFormSubmit: any = { ...this.formSubmit };
    let getIdSelect: any = e.source;
    if (!this.updateData) {
      newFormSubmit['id'] = new Date().getTime();
    } else {
      newFormSubmit['id'] = this.updateDataStaff.id;
    }

    if (getIdSelect !== undefined) {
      newFormSubmit[getIdSelect.id] = e.value;
      this.formSubmit = newFormSubmit;
    } else {
      if (e.target.name === 'civility') {
        newFormSubmit[e.target.name] = e.target.defaultValue;
        this.formSubmit = newFormSubmit;
      } else {
        newFormSubmit[e.target.name] = e.target.value;
        this.formSubmit = newFormSubmit;
      }
    }

    if (
      Object.keys(this.formSubmit).length >= 6 &&
      !Object.values(this.formSubmit).includes('')
    ) {
      buttonSubmit.removeAttribute('data-dis');
      buttonSubmit.setAttribute('data-dis', 'false');
      buttonSubmit.classList.remove('mat-button-disabled');
    } else {
      buttonSubmit.removeAttribute('data-dis');
      buttonSubmit.setAttribute('data-dis', 'true');
      buttonSubmit.classList.add('mat-button-disabled');
    }
  }
  // Event Handler
  popUp() {
    let elForm: any = document.querySelector('.wrap-form');
    let textUpdate = document.querySelector('.update-data-user');
    if (!this.updateData) {
      textUpdate?.classList.remove('active-data');
      textUpdate?.classList.add('close-data');
    } else {
      textUpdate?.classList.add('active-data');
      textUpdate?.classList.remove('close-data');
    }
    if (elForm.classList.contains('el-show')) {
      elForm.classList.remove('el-show');
      elForm.classList.add('el-hide');
    } else {
      elForm.classList.add('el-show');
      elForm.classList.remove('el-hide');
    }
  }

  onShow(e: any = null) {
    if (e === null) {
      this.popUp();
    } else {
      this.updateData = false;
      this.popUp();
    }
  }

  onSubmitButton() {
    let elForm: any = document.querySelector('.wrap-form');
    let buttonSubmit: any = document.querySelector('.btn-submit');
    if (buttonSubmit.getAttribute('data-dis') === 'false') {
      if (!this.updateData) {
        this.ApiService.createData(this.formSubmit).subscribe((res) => {
          this.addData();
          this.onShow();
        });
      } else {
        for (let property in this.formSubmit) {
          this.updateDataStaff[property] = this.formSubmit[property];
        }

        this.ApiService.updateData(
          this.updateDataStaff.id,
          this.updateDataStaff
        ).subscribe((res) => {
          this.updateData = false;
          this.addData();
          this.onShow();
        });
      }
    }
  }
}
