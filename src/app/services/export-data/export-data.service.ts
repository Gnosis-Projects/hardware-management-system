import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { environment } from '../../../environments/enrivonment';

@Injectable({
  providedIn: 'root'
})
export class ExportDataService {

  constructor() { }

  public printersLength = 0;
  public computersLength = 0;
  public phonesLength = 0;
  public netLength = 0;
  public serversLength = 0;

  private extractWorkstationData(data: any): any {
    return {
      aUnit: data.aUnit ? data.aUnit.name : '',
      address: data.address || '',
      carrier: data.carrier ? data.carrier.name : '',
      city: data.city || '',
      department: data.department || '',
      email: data.email || '',
      employeeFirstName: data.employeeFirstName || '',
      employeeLastName: data.employeeLastName || '',
      id: data.id || '',
      workstationNumber: data.workstationNumber || '',
      socketNumber: data.socketNumber || ''
    };
  }

  exportDataToExcel(json: any, excelFileName: string, columnNames: any): void {
    const flattenedData = this.flattenData(json);
    const mappedData = this.renameColumns(flattenedData, columnNames);
    
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mappedData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  exportDataToExcelWithSheets(json: any, excelFileName: string, columnNames: any): void {
    const filteredJson = json.map((item: any) => {
      return {
        ...item,
        computers_list: item.computers_list.filter((c: any) => !c.toBeDestroyed),
        printers_list: item.printers_list.filter((p: any) => !p.toBeDestroyed),
        phones_list: item.phones_list.filter((ph: any) => !ph.toBeDestroyed),
        network_equipment_list: item.network_equipment_list.filter((ne: any) => !ne.toBeDestroyed),
        servers_list: item.servers_list.filter((s: any) => !s.toBeDestroyed),
      };
    });
  
    // Extract and map data
    const workstationsList = [this.extractWorkstationData(filteredJson[0])];
    const computersList = this.flattenData(filteredJson[0].computers_list || []);
    const printersList = this.flattenData(filteredJson[0].printers_list || []);
    const phonesList = this.flattenData(filteredJson[0].phones_list || []);
    const networkEquipmentList = this.flattenData(filteredJson[0].network_equipment_list || []);
    const serversList = this.flattenData(filteredJson[0].servers_list || []);
  
    const mappedWorkstationsList = this.renameColumns(workstationsList, columnNames);
    const mappedComputersList = this.renameColumns(computersList, columnNames);
    const mappedPrintersList = this.renameColumns(printersList, columnNames);
    const mappedPhonesList = this.renameColumns(phonesList, columnNames);
    const mappedNetworkEquipmentList = this.renameColumns(networkEquipmentList, columnNames);
    const mappedServersList = this.renameColumns(serversList, columnNames);
  
    const workstationsSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mappedWorkstationsList);
    const computersSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mappedComputersList);
    const printersSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mappedPrintersList);
    const phonesSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mappedPhonesList);
    const networkEquipmentSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mappedNetworkEquipmentList);
    const serversSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mappedServersList);
  
    const workbook: XLSX.WorkBook = {
      Sheets: {
        'Θέση Εργασίας': workstationsSheet,
        'Υπολογιστές': computersSheet,
        'Εκτυπωτές': printersSheet,
        'Τηλέφωνα': phonesSheet,
        'Δικτυακός Εξοπλισμός': networkEquipmentSheet,
        'Servers': serversSheet
      },
      SheetNames: ['Θέση Εργασίας', 'Υπολογιστές', 'Εκτυπωτές', 'Τηλέφωνα', 'Δικτυακός Εξοπλισμός', 'Servers']
    };
  
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: environment.EXCEL_TYPE });
    saveAs(data, fileName + '_export_' + new Date().getTime() + environment.EXCEL_EXTENSION);
  }

  private renameColumns(data: any[], columnNames: any): any[] {
    return data.map(item => {
      const renamedItem: any = {};
      for (const key in item) {
        if (columnNames[key]) {
          renamedItem[columnNames[key]] = item[key];
        } else {
          renamedItem[key] = item[key];
        }
      }
      return renamedItem;
    });
  }

  private flattenData(data: any): any[] {
    let result: any[] = [];

    if (Array.isArray(data)) {
      data.forEach(item => {
        const flattenedItems = this.flattenItemWithNestedArrays(item);
        result = result.concat(flattenedItems);
      });
    } else {
      const flattenedItems = this.flattenItemWithNestedArrays(data);
      result = result.concat(flattenedItems);
    }

    return result;
  }

  private flattenItemWithNestedArrays(item: any): any[] {
    let result: any[] = [];

    const computersList = item.computers_list || [];
    const phonesList = item.phones_list || [];
    const printersList = item.printers_list || [];
    const networkEquipmentList = item.network_equipment_list || [];
    const serversList = item.servers_list || []

    const mainItem = this.flattenItem(item);
    delete mainItem.computers_list;
    delete mainItem.phones_list;
    delete mainItem.printers_list;
    delete mainItem.network_equipment_list;
    delete mainItem.servers_list;

    computersList.forEach((computer: any) => {
      const flattenedComputer = this.flattenItem(computer, 'computer');
      result.push({ ...mainItem, ...flattenedComputer });
    });

    phonesList.forEach((phone: any) => {
      const flattenedPhone = this.flattenItem(phone, 'phone');
      result.push({ ...mainItem, ...flattenedPhone });
    });

    printersList.forEach((printer: any) => {
      const flattenedPrinter = this.flattenItem(printer, 'printer');
      result.push({ ...mainItem, ...flattenedPrinter });
    });

    networkEquipmentList.forEach((networkEquipment: any) => {
      const flattenedNetworkEquipment = this.flattenItem(networkEquipment, 'network_equipment');
      result.push({ ...mainItem, ...flattenedNetworkEquipment });
    });

    serversList.forEach((server: any) => {
      const flattenedServers = this.flattenItem(server, 'server');
      result.push({ ...mainItem, ...flattenedServers });
    });


    if (computersList.length === 0 && phonesList.length === 0 && printersList.length === 0 && networkEquipmentList.length === 0 && serversList.length === 0) {
      result.push(mainItem);
    }

    this.printersLength = printersList.length;
    this.computersLength = computersList.length;
    this.phonesLength = phonesList.length;
    this.netLength = networkEquipmentList.length;
    this.serversLength = serversList.length;

    return result;
  }

  private flattenItem(item: any, prefix: string = '', parentKey: string = '', result: any = {}): any {
    for (const key in item) {
      if (item.hasOwnProperty(key)) {
        const newKey = parentKey ? `${parentKey}.${key}` : key;
        const prefixedKey = prefix ? `${prefix}.${newKey}` : newKey;
        
        if (item[key] === false) {
          result[prefixedKey] = 'OXI';
        } 
        else if (key === 'computerPrinters' && Array.isArray(item[key])) {
          const printerNames = item[key].map((printer: any) => {
            if (printer.name === 'δικτυακός') {
              return `${printer.name} (${printer.ipAddress})`;
            }
            return printer.name;
          }).join(', ');
          result[prefixedKey] = printerNames;
        } 

        else if (key === 'remoteDesktopApps' && Array.isArray(item[key])) {
          const remoteApps = item[key].map((ra: any) => {

              return `${ra.name} (${ra?.userId})`;
            
          }).join(', ');
          result[prefixedKey] = remoteApps;
        } 
        else if (key === 'disks') {
          if (Array.isArray(item[key])) {
            item[key].forEach((subItem: any, index: number) => {
              if (typeof subItem === 'object') {
                for (const subKey in subItem) {
                  result[`${prefixedKey}.${index + 1}.${subKey}`] = subItem[subKey];
                }
              } else {
                result[`${prefixedKey}.${index + 1}`] = subItem;
              }
            });
          } else if (typeof item[key] === 'object' && item[key] !== null) {
            for (const subKey in item[key]) {
              result[`${prefixedKey}.${subKey}`] = item[key][subKey];
            }
          }
        } 
        // Handle nested arrays or objects
        else if (typeof item[key] === 'object' && item[key] !== null) {
          if (Array.isArray(item[key])) {
            result[prefixedKey] = item[key].map((subItem: any) => 
              (typeof subItem === 'object' ? JSON.stringify(subItem) : subItem)
            ).join(', ');
          } else {
            for (const subKey in item[key]) {
              result[`${prefixedKey}.${subKey}`] = item[key][subKey];
            }
          }
        } 
        // Default case for non-object properties
        else {
          result[prefixedKey] = item[key];
        }
      }
    }
    return result;
  }
  
}
