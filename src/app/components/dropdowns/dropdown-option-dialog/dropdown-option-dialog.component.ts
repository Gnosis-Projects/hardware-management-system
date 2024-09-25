import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DropdownService } from '../../../services/dropdown.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,MatSelectModule,MatInputModule,MatDialogModule, MatButtonModule,TranslateModule,MatFormFieldModule,FormsModule],
  selector: 'app-dropdown-option-dialog',
  templateUrl: './dropdown-option-dialog.component.html',
  styleUrls: ['./dropdown-option-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DropdownOptionDialogComponent implements OnInit {
  addOptionForm: FormGroup;
  dropdownTypes = [
    { label: 'Λειτουργικό Σύστημα', value: 'operatingSystem' },
    { label: 'Τύπος Δίσκου', value: 'serverDiskType' },
    { label: 'Τύπος τηλεφώνου', value: 'phoneType' },
    { label: 'Τύπος IP', value: 'ipType' },
    { label: 'Εφαρμογή απομακρυσμένης επιφάνειας εργασίας', value: 'remoteDesktopAppType' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DropdownOptionDialogComponent>,
    private dropdownService: DropdownService,
    private toastr: ToastrService
  ) {
    this.addOptionForm = this.fb.group({
      dropdownType: ['', Validators.required],
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSave(): void {
    if (this.addOptionForm.valid) {
      const { dropdownType, name } = this.addOptionForm.value;

      let addObservable;
      switch (dropdownType) {
        case 'operatingSystem':
          addObservable = this.dropdownService.addOperatingSystem({ name });
          break;
        case 'diskType':
          addObservable = this.dropdownService.addDiskType({ name });
          break;
        case 'phoneType':
          addObservable = this.dropdownService.addPhoneType({ name });
          break;
        case 'serverDiskType':
          addObservable = this.dropdownService.addServerDiskType({ name });
          break;
        case 'ipType':
          addObservable = this.dropdownService.addIPType({ name });
          break;
        case 'remoteDesktopAppType':
          addObservable = this.dropdownService.addRemoteDesktopAppType({ name });
          break;
        default:
          return;
      }

      addObservable.subscribe(
        (response) => {
          if (response.success) {
            this.dialogRef.close(true);
          } else {
            this.toastr.error(response.message || 'Failed to add option');
          }
        },
        (error) => {
          this.toastr.error('An error occurred');
        }
      );
    } else {
      this.addOptionForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

