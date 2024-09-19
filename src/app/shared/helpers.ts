import { Buffer } from "buffer";
import * as bcrypt from "bcryptjs";
import { Device } from "../interfaces/responses/device-response";
import { PaginatorEnum } from "../enums/paginatorEnum";
import { CommonResponse } from "../interfaces/responses/common-response";
import { WorkStation } from "../interfaces/responses/workstation-response";
import { GetAllUsersResponse, UserData } from "../interfaces/responses/auth-response";

export abstract class Helper {

  public static encode(token: any): string {
    return Buffer.from(token ? token.toString() : '').toString('base64');
  }
  public static decode(token: string): string {
    return Buffer.from(token, 'base64').toString('utf8');
  }
  
  public static hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  public static filterDevices(term: string, devices: Device[]): Device[] {
    const lowerTerm = term.toLowerCase();
    return devices.filter((device: Device) =>
      device.deviceName.toLowerCase().includes(lowerTerm) ||
      (device.ram?.toString().toLowerCase().includes(lowerTerm)) ||
      device.serialNumber.toLowerCase().includes(lowerTerm) ||
      device.model.toLowerCase().includes(lowerTerm)
    );
  }

  public static filterCarriers(term: string, carriers: CommonResponse[]): CommonResponse[] {
    const lowerTerm = term.toLowerCase();
    return carriers.filter((carrier: CommonResponse) => carrier.name.toLowerCase().includes(lowerTerm) || carrier.id.toString().includes(lowerTerm));
  
  }

  public static filterUsers(term: string, users: UserData[]): UserData[] {
    const lowerTerm = term.toLowerCase();
    return users.filter((user: UserData) => 
      user.email.toLowerCase().includes(lowerTerm) || 
      user.roles[0].toLowerCase().includes(lowerTerm) ||
      user.carriers.map(carrier => carrier.name).join().toLowerCase().includes(lowerTerm)
    );
  }
  

  public static filterWorkStations(term: string, workStations: WorkStation[]): WorkStation[] {
    const lowerTerm = term.toLowerCase();
    return workStations.filter((workStation: WorkStation) => 
      workStation.aUnit.name.toLowerCase().includes(lowerTerm) || 
      workStation.id.toString().includes(lowerTerm) ||
      workStation.city?.toLowerCase().includes(lowerTerm) ||
      workStation.employeeFirstName.toLowerCase().includes(lowerTerm) ||
      workStation.employeeLastName.toLowerCase().includes(lowerTerm)
    );
  }

  public static getPageSizeOptions(dataSource: any): number[] {
    const options = Array.from(PaginatorEnum.PAGE_SIZE_OPTIONS);
    options.push(dataSource.data.length);
    return options;
  }
}
