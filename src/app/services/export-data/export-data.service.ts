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

  exportDataToExcel(json: any, excelFileName: string, columnNames: any): void {
    const flattenedData = this.flattenData(json);
    const mappedData = this.renameColumns(flattenedData, columnNames);
<<<<<<< HEAD
=======
  
    mappedData.push({ 'Sum of Computers': `Sum of computers: ${this.computersLength}` });
    mappedData.push({ 'Sum of Phones': `Sum of phones: ${this.phonesLength}` });
    mappedData.push({ 'Sum of Printers': `Sum of printers: ${this.printersLength}` });
    mappedData.push({ 'Sum of Network Equipment': `Sum of network equipment: ${this.netLength}` });
>>>>>>> 39ba3696e5be5a68965b90ff459682334efc0bf1
    
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mappedData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
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

    const mainItem = this.flattenItem(item);
    delete mainItem.computers_list;
    delete mainItem.phones_list;
    delete mainItem.printers_list;
    delete mainItem.network_equipment_list;

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

    if (computersList.length === 0 && phonesList.length === 0 && printersList.length === 0 && networkEquipmentList.length === 0) {
      result.push(mainItem);
    }

    this.printersLength = printersList.length;
    this.computersLength = computersList.length;
    this.phonesLength = phonesList.length;
    this.netLength = networkEquipmentList.length;

    return result;
  }

  private flattenItem(item: any, prefix: string = '', parentKey: string = '', result: any = {}): any {
    for (const key in item) {
      if (item.hasOwnProperty(key)) {
        const newKey = parentKey ? `${parentKey}.${key}` : key;
        const prefixedKey = prefix ? `${prefix}.${newKey}` : newKey;
        if (Array.isArray(item[key])) {
          result[prefixedKey] = item[key].map((subItem: any) => (typeof subItem === 'object' ? JSON.stringify(subItem) : subItem)).join(', ');
        } else if (typeof item[key] === 'object' && item[key] !== null) {
          this.flattenItem(item[key], prefix, newKey, result);
        } else {
          result[prefixedKey] = item[key];
        }
      }
    }
    return result;
  }
}
