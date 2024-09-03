import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import { ToastrService } from 'ngx-toastr';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/enrivonment';
import { AuthStateService } from '../../services/state-management/auth-state.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-report-problem',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [MatDialogModule,CommonModule, ReactiveFormsModule,MatButtonModule,MatInputModule, MatFormFieldModule, TranslateModule],
  templateUrl: './report-problem.component.html',
  styleUrl: './report-problem.component.scss'
})
export class ReportProblemComponent {
  reportProblemForm: FormGroup;

constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private authStateService: AuthStateService,
    private dialogRef: MatDialogRef<ReportProblemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.reportProblemForm = this.fb.group({
      description: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.reportProblemForm.valid) {
      const { description } = this.reportProblemForm.value;

      const templateParams = {
        description: description,
        from_name: this.authStateService.user()?.username,
      };

      emailjs.send(environment.SERVICE_ID, environment.TEMPLATE_ID, templateParams, environment.PUBLIC_KEY)
        .then((result: EmailJSResponseStatus) => {
          this.toastr.success(this.translate.instant('successMessages.report.sent.successfully'));
          this.dialogRef.close();
        }, (error) => {
          this.toastr.error('errorMessages.failed.report.problem');
        });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
