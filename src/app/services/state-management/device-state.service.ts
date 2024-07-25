import { Injectable, signal } from '@angular/core';
import { DeviceHistoryResponse, SingleDeviceResponse } from '../../interfaces/responses/device-response';
import { Helper } from '../../shared/helpers';
import { DeviceType } from '../../enums/device-type';

@Injectable({
  providedIn: 'root'
})
export class DeviceStateService {
  private readonly localStorageKey = 'selectedDeviceId';
  private readonly deviceTypeKey = 'selectedDeviceType';
  private readonly historyLocalStorageKey = 'devHistory';
  private readonly selectedDeviceKey = 'selectedDevice';

  selectedDeviceId = signal<number | null>(this.getDeviceIdFromLocalStorage());
  selectedDevice = signal<SingleDeviceResponse | null>(this.getDeviceFromLocalStorage());
  deviceHistory = signal<DeviceHistoryResponse | null>(this.getDeviceHistoryFromLocalStorage());
  selectedDeviceType = signal<DeviceType | null>(this.getDeviceTypeFromLocalStorage());

  setSelectedDeviceId(deviceId: number, deviceType:DeviceType): void {
    this.selectedDeviceId.set(deviceId);
    const encodedId = Helper.encode(deviceId.toString());
    localStorage.setItem(this.localStorageKey, encodedId);
    localStorage.setItem(this.deviceTypeKey, deviceType);
    this.clearDeviceHistory(); 
}

  getSelectedDeviceId(): number | null {
    return this.selectedDeviceId();
  }

  getSelectedDeviceType(): DeviceType | null{
    return localStorage.getItem(this.deviceTypeKey) as DeviceType;
  }

  private getDeviceIdFromLocalStorage(): number | null {
    const encodedId = localStorage.getItem(this.localStorageKey);
    if (encodedId) {
      const decodedId = Helper.decode(encodedId);
      return parseInt(decodedId, 10);
    }
    return null;
  }

  updateLocalStorageDeviceId(deviceId: number): void {
    const encodedId = Helper.encode(deviceId.toString());
    localStorage.setItem(this.localStorageKey, encodedId);
  }

  setDeviceHistory(history: DeviceHistoryResponse): void {
    this.deviceHistory.set(history);
    const encodedHistory = Helper.encode(JSON.stringify(history));
    localStorage.setItem(this.historyLocalStorageKey, encodedHistory);
  }

  getDeviceHistory(): DeviceHistoryResponse | null {
    return this.deviceHistory();
  }

  private getDeviceHistoryFromLocalStorage(): DeviceHistoryResponse | null {
    const encodedHistoryData = localStorage.getItem(this.historyLocalStorageKey);
    if (encodedHistoryData) {
      const historyData = Helper.decode(encodedHistoryData);
      return JSON.parse(historyData);
    }
    return null;
  }

  private getDeviceTypeFromLocalStorage():DeviceType | null {
    return localStorage.getItem(this.deviceTypeKey) as DeviceType | null;
  }

  setSelectedDevice(device: SingleDeviceResponse): void {
    this.selectedDevice.set(device);
    const encodedDevice = Helper.encode(JSON.stringify(device));
    localStorage.setItem(this.selectedDeviceKey, encodedDevice);
  }

  getSelectedDevice(): SingleDeviceResponse | null {
    return this.selectedDevice();
  }

  private getDeviceFromLocalStorage(): SingleDeviceResponse | null {
    const encodedDeviceData = localStorage.getItem(this.selectedDeviceKey);
    if (encodedDeviceData) {
      const deviceData = Helper.decode(encodedDeviceData);
      return JSON.parse(deviceData);
    }
    return null;
  }

  clearDeviceHistory(): void {
    localStorage.removeItem(this.historyLocalStorageKey);
    this.deviceHistory.set(null);
  }
}
