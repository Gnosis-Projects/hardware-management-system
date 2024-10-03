import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { AUnitService } from '../../../services/aunit.service';
import { CarrierStateService } from '../../../services/state-management/carrier-state.service';
import { CommonResponse } from '../../../interfaces/responses/common-response';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CarrierService } from '../../../services/carrier.service';

@Component({
  selector: 'app-add-aunit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule,
    MatDialogModule,
    MatSelectModule
  ],
  templateUrl: './add-aunit-dialog.component.html',
  styleUrls: ['./add-aunit-dialog.component.scss']
})
export class AddAunitDialogComponent implements OnInit {
  unitForm: FormGroup;
  carriers: CommonResponse[] = [];
  hideCarrierSelection = false;
  selectedCarrier: CommonResponse | null | undefined;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialogRef: MatDialogRef<AddAunitDialogComponent>,
    private aUnitService: AUnitService,
    private carrierService: CarrierService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private carrierStateService: CarrierStateService
  ) {
    this.unitForm = this.fb.group({
      carrier: ['', Validators.required],
      unitName: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadCarriers();
    this.setupCarrierValueChanges();
    this.selectedCarrier = this.carrierStateService.getSelectedCarrier();
    if(this.selectedCarrier && this.router.url !== '/admin'){
      this.hideCarrierSelection = true;
      this.unitForm.get('carrier')?.clearValidators();
    }
  }
  
  private loadCarriers(): void {
    const carriersFromState = this.carrierStateService.getAllCarriers();
    
    if (carriersFromState) {
      this.carriers = carriersFromState;
    } else {
      this.carrierService.getAllCarriers()
        .subscribe(response => {
          if (response.success) {
            this.carrierStateService.setAllCarriers(response.data);
            this.carriers = response.data;
          } else {
            console.error(response.message);
          }
        });
    }
  }

  private setupCarrierValueChanges(): void {
    this.unitForm.get('carrier')?.valueChanges.subscribe(carrier => {
      if (carrier) {
        this.unitForm.get('unitName')?.enable();
      } else {
        this.unitForm.get('unitName')?.disable();
      }
    });
  }

  onSave(): void {
    if (this.unitForm.valid) {
      const carrierId = this.unitForm.value.carrier || this.selectedCarrier?.id;
      const unitName = this.unitForm.value.unitName;
      this.aUnitService.addAUnit(carrierId, unitName).subscribe({
        next: (response) => {
          this.dialogRef.close({ isConfirmed: true, value: response.data });
          this.toastr.success(this.translate.instant('successMessages.aunit.created.successfully'));
        },
        error: () => {
          this.toastr.error(this.translate.instant('errorMessages.aunit.not.created'));
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close({ isConfirmed: false });
  }
}
