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
import { CarrierTableComponent } from '../../tables/carrier-table/carrier-table.component';
import { CarrierService } from '../../../services/carrier.service';
import { take } from 'rxjs';
import { ApiResponse } from '../../../interfaces/responses/api-response';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialogRef: MatDialogRef<AddAunitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private aUnitService: AUnitService,
    private carrierService: CarrierService,
<<<<<<< HEAD
    private translate: TranslateService,
=======
>>>>>>> 39ba3696e5be5a68965b90ff459682334efc0bf1
    private toastr: ToastrService,
    private carrierStateService: CarrierStateService
  ) {
    this.unitForm = this.fb.group({
      carrier: ['', Validators.required],
<<<<<<< HEAD
      unitName:  [data.unitName || '', Validators.required]
=======
      unitName: [{ value: '', disabled: true }, Validators.required]
    });
  }

  ngOnInit() {

    const isSelectedCarrierRoute = this.router.url === '/selectedCarrier'
    if (isSelectedCarrierRoute) {
      this.handleSelectedCarrierRoute();
    } else {
      this.loadCarriers();
      this.setupCarrierValueChanges();
    }
  }

  private handleSelectedCarrierRoute(): void {
    this.hideCarrierSelection = true;
    const carrierControl = this.unitForm.get('carrier');
    if (carrierControl) {
      carrierControl.clearValidators();
      carrierControl.updateValueAndValidity();
    }
    this.unitForm.get('unitName')?.enable();
  }
  
  private loadCarriers(): void {
    const carriersFromState = this.carrierStateService.getAllCarriers();
    if (carriersFromState) {
      this.carriers = carriersFromState;
    } else {
      this.carrierService.getAllCarriers()
        .pipe(take(1))
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
>>>>>>> 39ba3696e5be5a68965b90ff459682334efc0bf1
    });
  }

  ngOnInit() {

    const isSelectedCarrierRoute = this.router.url === '/selectedCarrier'
    if (isSelectedCarrierRoute) {
      this.handleSelectedCarrierRoute();
    } else {
      this.loadCarriers();
      this.setupCarrierValueChanges();
    }
  }

  private handleSelectedCarrierRoute(): void {
    this.hideCarrierSelection = true;
    const carrierControl = this.unitForm.get('carrier');
    if (carrierControl) {
      carrierControl.clearValidators();
      carrierControl.updateValueAndValidity();
    }
    this.unitForm.get('unitName')?.enable();
  }
  
  private loadCarriers(): void {
    const carriersFromState = this.carrierStateService.getAllCarriers();
    if (carriersFromState) {
      this.carriers = carriersFromState;
    } else {
      this.carrierService.getAllCarriers()
        .pipe(take(1))
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
<<<<<<< HEAD

=======
>>>>>>> 39ba3696e5be5a68965b90ff459682334efc0bf1
      let carrierId = this.unitForm.value.carrier;
      if(!carrierId) {
        carrierId = this.carrierStateService.getSelectedCarrier()?.id;
      }
<<<<<<< HEAD
      
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
      this.dialogRef.close({ isConfirmed: true, value: { unitName } });
=======
      const unitName = this.unitForm.value.unitName;
      this.aUnitService.addAUnit(carrierId, unitName).subscribe({
        next: (response: ApiResponse<CommonResponse>) => {
          if (response.success) {
            this.dialogRef.close({ isConfirmed: true, value: response.data });
            this.toastr.success('successMessages.aunit.added.successfully')
          } else {
            this.toastr.error('errorMessages.aunit.not.created')
          }
        },
      })
>>>>>>> 39ba3696e5be5a68965b90ff459682334efc0bf1
    }
  }

  onCancel(): void {
    this.dialogRef.close({ isConfirmed: false });
  }
}
