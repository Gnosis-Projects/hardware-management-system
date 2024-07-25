import { FormGroup } from '@angular/forms';
import { DeviceType } from '../enums/device-type';

export function updateFormControls(searchForm: FormGroup, searchType: DeviceType): void {
  const filterDtoGroup = searchForm.get('filterDto') as FormGroup;
  const workstationFilterDtoGroup = searchForm.get('workstationFilterDto') as FormGroup;

  if (filterDtoGroup && workstationFilterDtoGroup) {
    if (searchType === DeviceType.PHONE) {
      enableControls(filterDtoGroup, ['deviceName', 'model', 'serialNumber', 'phoneNumber']);
      disableControls(filterDtoGroup, ['ram', 'ip', 'operatingSystem', 'macAddress', 'ssd', 'remoteDesktopAppId', 'printerTypeId', 'networkEquipmentTypeId', 'floor']);
      workstationFilterDtoGroup.disable();
    } else if (searchType === DeviceType.PRINTER) {
      enableControls(filterDtoGroup, ['deviceName', 'model', 'serialNumber', 'printerTypeId']);
      disableControls(filterDtoGroup, ['ram', 'ip', 'operatingSystem', 'macAddress', 'ssd', 'remoteDesktopAppId', 'phoneNumber', 'networkEquipmentTypeId', 'floor']);
      workstationFilterDtoGroup.disable();
    } else if (searchType === DeviceType.NETWORK_EQUIPMENT) {
      enableControls(filterDtoGroup, ['deviceName', 'model', 'serialNumber', 'networkEquipmentTypeId', 'floor']);
      disableControls(filterDtoGroup, ['ram', 'ip', 'operatingSystem', 'macAddress', 'ssd', 'remoteDesktopAppId', 'phoneNumber', 'printerTypeId']);
      workstationFilterDtoGroup.disable();
    } else if (searchType === DeviceType.WORKSTATION) {
      filterDtoGroup.disable();
      workstationFilterDtoGroup.enable();
    } else {
      enableControls(filterDtoGroup, ['ram', 'deviceName', 'model', 'serialNumber', 'ip', 'macAddress', 'operatingSystem', 'ssd', 'remoteDesktopAppId']);
      disableControls(filterDtoGroup, ['printerTypeId', 'phoneNumber', 'networkEquipmentTypeId', 'floor']);
      workstationFilterDtoGroup.disable();
    }
  }
}

function enableControls(formGroup: FormGroup, controls: string[]): void {
  controls.forEach(control => formGroup.get(control)?.enable());
}

function disableControls(formGroup: FormGroup, controls: string[]): void {
  controls.forEach(control => formGroup.get(control)?.disable());
}
