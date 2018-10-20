import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {  deviceFrm: any;
  interfaceFrm: any;
  deviceData: any = [];
  visible: boolean = false;
  formData: any;
  interfaceObj: any = [];
  selectedInterfaceId: any;
  submitAttempt: boolean = false;
  constructor(private formBuilder: FormBuilder) {

    this.deviceFrm = formBuilder.group({
      'sNo': [undefined],
      'hostName': ['', [Validators.required, Validators.pattern("www.[a-z0-9.-]+\.[a-z]{2,4}$")]],
      'loopBack': ['', [Validators.required, Validators.pattern("^([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])$")]]
    });
    this.interfaceFrm = formBuilder.group({
      'ifSrNo': [undefined],
      'sNo': [undefined],
      'interfaceName': ['', Validators.required],
      'ipAddress': ['', [Validators.required, Validators.pattern("^([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])$")]]
    });
  }

  ngOnInit() {
    this.onLoad();
  }

  onLoad() {
    if (localStorage.deviceData) {
      this.deviceData = JSON.parse(localStorage.deviceData);
    }
  }

  editRow(data,formType) {
    formType == 'interfaceFrm' ?  this.interfaceFrm.patchValue(data) :this.deviceFrm.patchValue(data);
  }

  onSubmit(form) {
    this.submitAttempt = true;
    if (this.deviceFrm.valid) {
      if (form.sNo) {
        let itemIndex = this.deviceData.findIndex(item => item.sNo == form.sNo);
        this.deviceData[itemIndex] = form;
      } else {
        form.sNo = this.deviceData.length + 1;
        this.deviceData.push(form);
      }
      localStorage.setItem('deviceData', JSON.stringify(this.deviceData));
      this.submitAttempt = false;
      this.deviceFrm.reset();
      this.onLoad();
    }
  }

  submitIfValues(form) {
    this.submitAttempt = true;
    if (this.interfaceFrm.valid) {
      if (localStorage.interfaceObj) {
        this.interfaceObj = JSON.parse(localStorage.interfaceObj);
        if (form.ifSrNo) {
          let itemIndex = this.interfaceObj.findIndex(item => item.ifSrNo == form.ifSrNo);
          this.interfaceObj[itemIndex] = form;
        } else {
          form.ifSrNo = this.interfaceObj.length + 1;
          form.sNo = this.selectedInterfaceId;
          this.interfaceObj.push(form);
        }
      } else {
        form.ifSrNo = this.interfaceObj.length + 1;
        form.sNo = this.selectedInterfaceId;
        this.interfaceObj.push(form);
      }

      localStorage.setItem('interfaceObj', JSON.stringify(this.interfaceObj));
      this.loadInterfaceData(form);
      this.submitAttempt = false;
      this.interfaceFrm.reset();
    }
  }

  onDelete(data,arrType) {
    let selectedInterface = JSON.parse(localStorage.interfaceObj);
    if(arrType == 'deviceData'){
      this.deviceData.splice(this.deviceData.indexOf(data), 1);
      localStorage.setItem('deviceData', JSON.stringify(this.deviceData));
      const newArray = selectedInterface.filter(obj => obj.sNo != data.sNo);
      selectedInterface = newArray;
      localStorage.setItem('interfaceObj', JSON.stringify(selectedInterface));
      this.onLoad();
    }else if(arrType == 'interfaceObj'){
      selectedInterface.splice(this.interfaceObj.indexOf(data), 1);
      localStorage.setItem('interfaceObj', JSON.stringify(selectedInterface));
      this.loadInterfaceData(data);
    }
  }

  showDetails(data) {
    this.visible = true;
    this.loadInterfaceData(data);
  }

  loadInterfaceData(data) {
    this.selectedInterfaceId = data.sNo;
    let selectedInterface: any = [];
    if (localStorage.interfaceObj) {
      this.interfaceObj = JSON.parse(localStorage.interfaceObj);
      this.interfaceObj.forEach(interfaceObj => {
        if (interfaceObj.sNo == data.sNo) {
          selectedInterface.push(interfaceObj);
        }
      });
      this.interfaceObj = selectedInterface;
    }
  }

  close() {
    this.visible = false;
    this.submitAttempt = false;
  }
}
