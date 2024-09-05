import { NetworkDiskInfo, OperatingSystem, PhoneType, ServerDiskType } from "../requests/device-request";
import { CommonResponse } from "./common-response";
import { WorkStation } from "./workstation-response";

export interface ActionType {
  id: number;
  name: string;
}

export interface Disk {
  capacity: number;
  ssd: boolean;
}

export interface PrinterType {
  id: number;
  name: string;
}

export interface NetworkEquipmentType {
  id: number;
  name: string;
}

export interface ComputerPrinter{
  id: number;
  typeId: number;
  ipAddress?: string;
}


export interface RemoteDesktopApp {
  name: string;
  typeId: number;
  userId: string;
  password: string;
}

export interface NetworkEquipmentIpResponse{
  id: number;
  ip: string;
  name: string;
}


export interface Device {
  id: number;
  model: string;
  serialNumber: string;
  deviceName: string;
  ram?: number;
  ip?: string;
  phoneNumber?: string;
  disks?: Disk[];
  printerType?: PrinterType;
  phoneType?:PhoneType;
  networkEquipmentType?: NetworkEquipmentType;
  networkEquipmentIP?: NetworkEquipmentIpResponse;
  floor?: string;
  workGroupDomain?: string;
  refurbished?: boolean;
  networkEquipmentFloor?: string;
  serverDiskType?: ServerDiskType;
  paperSize?: string;
  macAddress?: string;
  machineType?: string;
  routerPassword?: string;
  routerUsername?: string;
  operatingSystem?: OperatingSystem
  computerPrinters?: ComputerPrinter[]
  netWorkDisk?:boolean;
  monitorType?: string;
  outlet?: string;
  antivirus?: string;
  remoteDesktopApps?: RemoteDesktopApp[];
  purchaseDate?: string;
  checkDateTime?: string;
  aUnit: CommonResponse;
  carrier: CommonResponse;
  workStation?: WorkStation;
  networkDiskInfo?: NetworkDiskInfo;
  comments?: string;
}

export interface SingleDeviceResponse {
  data: Device;
  success: boolean;
  message: string;
}

export interface DeviceHistory {
  ram?: number;
  id: number;
  username: string;
  employeeLastName: string;
  employeeFirstName: string;
  email: string;
  personalPhone: string;
  deviceName: string;
  model: string;
  serialNumber: string;
  actionType: ActionType;
  paperSize?: string;
  checkDateTime: string;
  comments: string;
  ip?: string;
  macAddress?: string;
  operatingSystemId?: number;
  operatingSystem?: string;
  monitorType?: string;
  outlet?: string;
  antivirus?: string;
  remoteDesktopApps?: RemoteDesktopApp[];
}




export interface DeviceHistoryResponse {
  data: DeviceHistory[];
  success: boolean;
  message: string;
}

export interface DeviceListResponse {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  firstPage: string;
  lastPage: string;
  totalPages: number;
  nextPage: string | null;
  previousPage: string | null;
  data: Device[];
  success: boolean;
  message: string;
}
