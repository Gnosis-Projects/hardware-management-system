import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { environment } from '../../../environments/enrivonment';

@Injectable({
  providedIn: 'root'
})
export class ExportDataService {

  constructor() { }

  exportDataToExcel(json: any, excelFileName: string, columnNames: any): void {
    const flattenedData = this.flattenData(json);
    const mappedData = this.renameColumns(flattenedData, columnNames);
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
        const flattenedItem = this.flattenItem(item);
        result.push(flattenedItem);
      });
    } else {
      const flattenedItem = this.flattenItem(data);
      result.push(flattenedItem);
    }

    return result;
  }

  private flattenItem(item: any, parentKey: string = '', result: any = {}): any {
    for (const key in item) {
      if (item.hasOwnProperty(key)) {
        const newKey = parentKey ? `${parentKey}.${key}` : key;
        if (Array.isArray(item[key])) {
          if (key === 'remoteDesktopApps') {
            result[newKey] = item[key].map((subItem: any) => `${subItem.name} (${subItem.userId})`).join(', ');
          }
          else if(key === 'disks'){
            result[newKey] = item[key].map((subItem: any) => `${subItem.capacity} GB HDD / ${subItem.ssd ? 'SSD' : 'Δεν έχει SSD'}`).join(', ');
          } 
          else {
            result[newKey] = item[key].map((subItem: any) => (typeof subItem === 'object' ? JSON.stringify(subItem) : subItem)).join(', ');
          }
        } else if (typeof item[key] === 'object' && item[key] !== null) {
          this.flattenItem(item[key], newKey, result);
        } else {
          result[newKey] = item[key];
        }
      }
    }
    return result;
  }
}
