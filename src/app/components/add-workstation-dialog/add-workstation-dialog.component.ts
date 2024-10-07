import { Component, inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonResponse } from '../../interfaces/responses/common-response';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { AuthStateService } from '../../services/state-management/auth-state.service';
import { AUnitService } from '../../services/aunit.service';
import { WorkStationService } from '../../services/workstation.service';
import { WorkstationRequest } from '../../interfaces/requests/workstation/add-workstation-request';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CarrierStateService } from '../../services/state-management/carrier-state.service';
import { DepartmentsService } from '../../services/departments.service';
import { MunicipalOfficesService } from '../../services/municipalOffices.service';
 
@Component({
  selector: 'app-add-workstation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatOptionModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    TranslateModule,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './add-workstation-dialog.component.html',
  styleUrls: ['./add-workstation-dialog.component.scss']
})
export class AddWorkStationDialogComponent implements OnInit {

  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<AddWorkStationDialogComponent>);
  data = inject(MAT_DIALOG_DATA);

  @Input() aUnits: CommonResponse[] = [];
  @Input() carriers: CommonResponse[] = [];
  filteredAUnits: CommonResponse[] = [];
  isSuperAdmin: boolean = false;
  addWorkStationForm: FormGroup;
  disableCarrierInput: boolean = false;
  isSubmitting: boolean = false;
  carrierId: number = 0
  municipalOffices: CommonResponse[] = []
  departments: CommonResponse[] = []


  constructor(
    private authStateService: AuthStateService, 
    private router: Router, 
    private aUnitService: AUnitService,
    private carrierState:CarrierStateService,
    private workStationService: WorkStationService,
    private municipalService: MunicipalOfficesService,
    private departmentsService: DepartmentsService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.addWorkStationForm = this.fb.group({
      carrierId: [''],
      aUnitId: ['', Validators.required],
      departmentId:  [{ value: null, disabled: true }],
      municipalOfficeId: [''],
      employeeFirstName: ['', Validators.required],
      employeeLastName: ['', Validators.required],
      workstationNumber: [''],
      socketNumber: [''],
      email: [''],
      personalPhone: [''],
      address: [''],
      city: ['',  Validators.required]
    });

    this.carriers = this.data.carriers;
    this.aUnits = this.data.aUnits;
    this.isSuperAdmin = this.data.isSuperAdmin;
    this.filteredAUnits = this.isSuperAdmin ? [] : this.aUnits;
  }

  ngOnInit(): void {
    this.isSuperAdmin = this.authStateService.isSuperAdmin();
    if (!this.isSuperAdmin) {
      this.addWorkStationForm.get('carrierId')?.clearValidators();
      this.filteredAUnits = this.aUnits;
    }
    if (this.data) {
      this.addWorkStationForm.patchValue(this.data);
    }
    if (this.router.url === '/selectedCarrier') {
      this.disableCarrierInput = true;
      this.addWorkStationForm.get('carrierId')?.disable();
      this.municipalService.getAllByCarrier(this.carrierId).subscribe((response)=>{
        this.municipalOffices = response.data
      })
    }
    if(this.isSuperAdmin){
      this.municipalService.getAllByCarrier(this.carrierId).subscribe((response)=>{
        this.municipalOffices = response.data
      })
    }

    this.addWorkStationForm.get('municipalOfficeId')?.valueChanges.subscribe(municipalOfficeId => {
      this.onOfficeChange(municipalOfficeId);
    });
  }

  onOfficeChange(municipalOfficeId: number): void {
    if (municipalOfficeId) {
      this.departmentsService.getAllByMunicipalOffice(municipalOfficeId).subscribe(deps => {
        this.departments = deps.data;
        this.addWorkStationForm.get('departmentId')?.enable();
        this.addWorkStationForm.patchValue({ departmentId: null });
      });
    } else {
      this.departments = [];
    }
  }

  onCarrierChange(carrierId: number): void {
    this.carrierId = carrierId
    this.aUnitService.getAUnitsByCarrierId(carrierId).subscribe((response) => {
      if (response.success) {
        this.filteredAUnits = response.data;
        this.addWorkStationForm.get('aUnitId')?.reset();
      }
    });
    this.municipalService.getAllByCarrier(carrierId).subscribe(offices => {
      this.municipalOffices = offices.data;
    });

  }

  onSave(): void {
    if (this.addWorkStationForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const formData = this.addWorkStationForm.value;

      const departmentId = formData.departmentId;

      const workstationRequest: WorkstationRequest = {
        employeeLastName: formData.employeeLastName,
        employeeFirstName: formData.employeeFirstName,
        email: formData.email,
        socketNumber: formData.socketNumber,
        workstationNumber: formData.workstationNumber,
        personalPhone: formData.personalPhone,
        city: formData.city,
        address: formData.address
      };

      this.workStationService.addWorkStation(Number(formData.aUnitId), departmentId, workstationRequest)
        .subscribe((response) => {
          this.isSubmitting = false;
          if (response.success) {
            this.toastr.success(this.translate.instant('successMessages.workstation.added.successfully'));
            this.dialogRef.close({ isConfirmed: true, value: response.data[response.data.length - 1].id });
          } else {
            this.toastr.error(this.translate.instant('errorMessages.unexpected.error'));
          }
        }, error => {
          this.isSubmitting = false;
          this.toastr.error(this.translate.instant('errorMessages.unexpected.error'));
        });
    }  
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
