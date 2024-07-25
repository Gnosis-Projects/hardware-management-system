import { Injectable, signal } from "@angular/core";
import { CommonResponse } from "../../interfaces/responses/common-response";

@Injectable({
  providedIn: 'root'
})
export class AUnitStateService {
    aUnitsMap = signal<{ [carrierId: number]: CommonResponse[] }>({});
    aUnitsVisibilityMap = signal<{ [carrierId: number]: boolean }>({});
    aUnitId = signal<number | null>(null);

  setAUnits(carrierId: number, aUnits: CommonResponse[]) {
    const currentMap = this.aUnitsMap();
    currentMap[carrierId] = aUnits;
    this.aUnitsMap.set(currentMap);
  }

  getAUnits(carrierId: number): CommonResponse[] | undefined {
    return this.aUnitsMap()[carrierId];
  }

  setAUnitId(aUnitId: number) {
    this.aUnitId.set(aUnitId);
  }

  getAUnitId(): number | null {
    return this.aUnitId();
  }

  toggleAUnitsVisibility(carrierId: number) {
    const visibilityMap = this.aUnitsVisibilityMap();
    visibilityMap[carrierId] = !visibilityMap[carrierId];
    this.aUnitsVisibilityMap.set(visibilityMap);
  }

  getAUnitsVisibility(carrierId: number): boolean {
    return this.aUnitsVisibilityMap()[carrierId] || false;
  }
  
}
