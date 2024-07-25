import { Injectable, signal } from "@angular/core";
import { Helper } from "../../shared/helpers";

@Injectable({
  providedIn: 'root'
})
export class WorkStationStateService {
  private workstationIdSignal = signal<number | null>(null);

  setWorkstationId(workstationId: number) {
      this.workstationIdSignal.set(workstationId);
      const encodedId = Helper.encode(workstationId);
      localStorage.setItem('workstationId', encodedId);
  }

  getWorkstationId(): number | null {
    if (!this.workstationIdSignal()) {
        const storedId = localStorage.getItem('workstationId');
        if (storedId) {
            const decodedId = Helper.decode(storedId);
            const parsedId = parseInt(decodedId, 10);
            this.workstationIdSignal.set(parsedId);
        }
    }
    return this.workstationIdSignal();
}
}