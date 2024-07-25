export interface Disk {
  capacity: number;
  ssd: boolean;
}

export interface RemoteDesktopApp {
  typeId: number;
  userId: string;
  password: string;
}

export interface AddDeviceRequest {
  model: string;
  serialNumber: string;
  deviceName: string;
  ram?: number;
  printerTypeId?: number;
  networkEquipmentTypeId?: number;
  floor?: string;
  ip?: string;
  comments?: string;
  disks?: Disk[];
  workGroupDomain?: string;
  macAddress?: string;
  machineType?: string;
  operatingSystem?: string;
  monitorType?: string;
  phoneNumber?: string;
  outlet?: string;
  antivirus?: string;
  remoteDesktopApps?: RemoteDesktopApp[];
  purchaseDate?: string;
}

export interface EditDeviceRequest {
  id: number;
  model: string;
  serialNumber: string;
  deviceName: string;
  printerTypeId?: number;
  networkEquipmentTypeId?: number;
  floor?: string;
  phoneNumber?: string;
  ram?: number;
  ip?: string;
  disks?: Disk[];
  workGroupDomain?: string;
  macAddress?: string;
  machineType?: string;
  operatingSystem?: string;
  monitorType?: string;
  outlet?: string;
  antivirus?: string;
  remoteDesktopApps?: RemoteDesktopApp[];
  purchaseDate?: string;
  comments?: string;
}
