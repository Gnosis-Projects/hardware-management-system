import { inject, Injectable, signal } from '@angular/core';
import { CommonResponse } from '../../interfaces/responses/common-response';
import { Helper } from '../../shared/helpers';
import { of, mergeMap } from 'rxjs';
import { CarrierService } from '../carrier.service';
import { MunicipalOfficesService } from '../municipalOffices.service';

@Injectable({
  providedIn: 'root',
})
export class ExtraStateService {

  officeService = inject(MunicipalOfficesService);
  allMunicipalOffices = signal<CommonResponse[] | null>(null);
  allDepartments = signal<CommonResponse[] | null>(null);
  allOfficesForFilter = signal<CommonResponse[]>([]);

  setAllMunicipalOffices(municipalOffices: CommonResponse[]): void {
    this.allMunicipalOffices.set(municipalOffices);
    const encodedOffices = Helper.encode(JSON.stringify(municipalOffices));
    localStorage.setItem('municipalOffices', encodedOffices);
  }

  getAllMunicipalOffices(): CommonResponse[] | null {
    return this.allMunicipalOffices();
  }

  setAllDepartments(departments: CommonResponse[]): void {
    this.allDepartments.set(departments);
    const encodedDepartments = Helper.encode(JSON.stringify(departments));
    localStorage.setItem('departments', encodedDepartments);
  }

  getAllDepartments(): CommonResponse[] | null {
    return this.allDepartments();
  }

  getAllOfficesForFilter(): CommonResponse[] | null {
    return this.allOfficesForFilter();
  }

  getMunicipalOfficesFromLocalStorage(): CommonResponse[] | null {
    const encodedOfficesData = localStorage.getItem('municipalOffices');
    if (encodedOfficesData) {
      const officesData = Helper.decode(encodedOfficesData);
      return JSON.parse(officesData);
    }
    return null;
  }

  getDepartmentsFromLocalStorage(): CommonResponse[] | null {
    const encodedDepartmentsData = localStorage.getItem('departments');
    if (encodedDepartmentsData) {
      const departmentsData = Helper.decode(encodedDepartmentsData);
      return JSON.parse(departmentsData);
    }
    return null;
  }
  fetchAndStoreMunicipalOffices(): Promise<CommonResponse[]> {
    let allOffices: CommonResponse[] = [];
  
    const ids = Array.from({ length: 10 }, (_, i) => i + 1);
  
    return new Promise((resolve, reject) => {
      of(...ids)
        .pipe(
          mergeMap((id) => this.officeService.getAllByCarrier(id)) // Merge requests for each ID
        )
        .subscribe({
          next: (response) => {
            if (response.success && response.data) {
              allOffices = [...allOffices, ...response.data];  // Append data to the array
              const currentOffices = this.allOfficesForFilter() ?? []; // Get the current value of the signal (default to empty array)
              this.allOfficesForFilter.set([...currentOffices, ...response.data]); // Append data to the signal
            }
          },
          error: (err) => {
            console.error(`Error fetching data for carrier ID: ${err}`);
            reject(err); // Reject the Promise on error
          },
          complete: () => {
            const encodedOffices = Helper.encode(JSON.stringify(allOffices));
            localStorage.setItem('municipalOffices', encodedOffices);
            resolve(allOffices);
          },
        });
    });
  }
  
}
