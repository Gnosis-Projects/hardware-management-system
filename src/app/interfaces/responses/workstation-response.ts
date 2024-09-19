  import { CommonResponse } from "./common-response";
  import { Device } from "./device-response";


  export interface WorkStation {
    carrier: CommonResponse;
    aUnit: CommonResponse;
    id: number;
    employeeLastName: string;
    employeeFirstName: string;
    email?: string;
    personalPhone?: string;
    socketNumber?: string;
    address?: string;
    workstationNumber?: string;
    department: string;
    city?: string;
    computers_list: Device[];
    printers_list: Device[];
    phones_list: Device[];
    network_equipment_list: Device[];
    servers_list: Device[];
  }

  export interface WorkStationResponse {
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    firstPage: string;
    lastPage: string;
    totalPages: number;
    nextPage: string | null;
    previousPage: string | null;
    data: WorkStation[];
    success: boolean;
    message: string;
  }

  export interface SingleWorkStationResponse {
    data: WorkStation;
    success: boolean;
    message: string;
  }
