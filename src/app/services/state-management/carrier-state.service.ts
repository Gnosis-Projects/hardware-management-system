import { Injectable, signal } from "@angular/core";
import { CommonResponse } from "../../interfaces/responses/common-response";
import { Helper } from "../../shared/helpers";

@Injectable({
  providedIn: 'root'
})
export class CarrierStateService {
  allCarriers = signal<CommonResponse[] | null>(null);
  selectedCarrier = signal<CommonResponse | null>(this.getCarrierFromLocalStorage());

  setAllCarriers(carriers: CommonResponse[]): void {
    this.allCarriers.set(carriers);
    const encodedCarriers = Helper.encode(JSON.stringify(carriers));
    localStorage.setItem('carriers', encodedCarriers);
  }

  getAllCarriers(): CommonResponse[] | null {
    return this.allCarriers();
  }
  
  setSelectedCarrier(carrier: CommonResponse): void {
    this.selectedCarrier.set(carrier);
    const encodedCarrier = Helper.encode(JSON.stringify(carrier));
    localStorage.setItem('carrier', encodedCarrier);
  }

  getSelectedCarrier(): CommonResponse | null {
    return this.selectedCarrier();
  }

   getCarrierFromLocalStorage(): CommonResponse | null {
    const encodedCarrierData = localStorage.getItem('carrier');
    if (encodedCarrierData) {
      const carrierData = Helper.decode(encodedCarrierData);
      return JSON.parse(carrierData);
    }
    return null;
  }
}
