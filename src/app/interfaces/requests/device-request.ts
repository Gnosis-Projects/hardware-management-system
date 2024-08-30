export interface Disk {
  capacity: number;
  ssd: boolean;
}

export interface NetworkDiskInfo {
  name: string;
  diskArray: string;
  diskSize: number;
  ip: string;
  brand: string;
  supplier: string;
  purchaseDate: string;
}

export interface RemoteDesktopApp {
  name: string;
  typeId: number;
  userId: string;
  password: string;
}

export interface PrinterType {
  id: number;
  name: string;
}

export interface OperatingSystem {
  id: number;
  name: string;
}

export interface RemoteDesktopAppType {
  id: number;
  name: string;
}

export interface PhoneType {
  id: number;
  name: string;
}

export interface ServerDiskType {
  id: number;
  name: string;
}

export interface IpType{
  id:number;
  name:string;
}
export interface NetworkEquipmentIp{
  ipTypeId: number;
  ip: string;
}

export interface AddDeviceRequest {
  model: string;
  serialNumber: string;
  deviceName: string;
  ram?: number;
  supplier?: string;
  printerTypeId?: number;
  networkEquipmentTypeId?: number;
  floor?: string;
  ip?: string;
  comments?: string;
  disks?: Disk[];
  refurbished?: boolean;
  workGroupDomain?: string;
  macAddress?: string;
  machineType?: string;
  operatingSystemId?: number;
  netWorkDisk?: boolean;
  monitorType?: string;
  networkEquipmentFloor?: string;
  paperSize?: string;
  phoneNumber?: string;
  phoneSocket?: string;
  phoneTypeId?: number;
  outlet?: string;
  antivirus?: string;
  remoteDesktopApps?: RemoteDesktopApp[];
  purchaseDate?: string;
  networkEquipmentIp?: NetworkEquipmentIp;
  serverDiskTypeId?: number;
  diskRotations?: number;
  networkDisk?: boolean;
  switchAddress?: string;
}

export interface EditDeviceRequest {
  id: number;
  model: string;
  serialNumber: string;
  deviceName: string;
  printerTypeId?: number;
  networkEquipmentTypeId?: number;
  floor?: string;
  networkEquipmentFloor?: string;
  phoneNumber?: string;
  ram?: number;
  ip?: string;
  ssd?: boolean;
  disks?: Disk[];
  netWorkDisk?: boolean;
  workGroupDomain?: string;
  macAddress?: string;
  paperSize?: string;
  machineType?: string;
  refurbished?: boolean;
  operatingSystemId?: number;
  monitorType?: string;
  outlet?: string;
  antivirus?: string;
  remoteDesktopApps?: RemoteDesktopApp[];
  remoteDesktopApp?: number;
  purchaseDate?: string;
  comments?: string;
  phoneSocket?: string;
  phoneTypeId?: number;
  serverDiskTypeId?: number;
  diskRotations?: number;
  networkDisk?: boolean;
  networkEquipmentIp?: NetworkEquipmentIp;
  switchAddress?: string;
}
