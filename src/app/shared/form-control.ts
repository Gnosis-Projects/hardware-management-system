import { FormGroup } from '@angular/forms';
import { DeviceType } from '../enums/device-type';

export function updateFormControls(searchForm: FormGroup, searchType: DeviceType): void {
  const filterDtoGroup = searchForm.get('filterDto') as FormGroup;
  const workstationFilterDtoGroup = searchForm.get('workstationFilterDto') as FormGroup;

  if (filterDtoGroup && workstationFilterDtoGroup) {
    switch (searchType) {
      case DeviceType.PHONE:
        enableControls(filterDtoGroup, ['deviceName', 'model', 'serialNumber', 'phoneNumber', 'phoneSocket', 'phoneTypeId']);
        disableControls(filterDtoGroup, ['ram', 'ip', 'operatingSystemId', 'macAddress', 'ssd', 'remoteDesktopAppId', 'printerTypeId', 'networkEquipmentTypeId', 'floor', 'serverDiskTypeId', 'diskRotations', 'networkDisk']);
        workstationFilterDtoGroup.disable();
        break;

      case DeviceType.PRINTER:
        enableControls(filterDtoGroup, ['deviceName', 'model', 'serialNumber', 'printerTypeId', 'refurbished', 'paperSize']);
        disableControls(filterDtoGroup, ['ram', 'ip', 'operatingSystemId', 'macAddress', 'ssd', 'remoteDesktopAppId', 'phoneNumber', 'networkEquipmentTypeId', 'floor', 'serverDiskTypeId', 'diskRotations', 'networkDisk']);
        workstationFilterDtoGroup.disable();
        break;

      case DeviceType.SERVER:
        enableControls(filterDtoGroup, ['deviceName', 'model', 'serialNumber', 'operatingSystemId', 'serverDiskTypeId', 'diskRotations', 'networkDisk', 'antivirus']);
        disableControls(filterDtoGroup, ['ram', 'ip', 'macAddress', 'ssd', 'remoteDesktopAppId', 'phoneNumber', 'printerTypeId', 'networkEquipmentTypeId', 'floor']);
        workstationFilterDtoGroup.disable();
        break;

      case DeviceType.NETWORK_EQUIPMENT:
        enableControls(filterDtoGroup, ['deviceName', 'model', 'serialNumber', 'networkEquipmentTypeId', 'floor']);
        disableControls(filterDtoGroup, ['ram', 'ip', 'operatingSystemId', 'macAddress', 'ssd', 'remoteDesktopAppId', 'phoneNumber', 'printerTypeId', 'serverDiskTypeId', 'diskRotations', 'networkDisk']);
        workstationFilterDtoGroup.disable();
        break;

      case DeviceType.WORKSTATION:
        filterDtoGroup.disable();
        workstationFilterDtoGroup.enable();
        break;

      default:
        // Assuming the default is for computers
        enableControls(filterDtoGroup, ['deviceName', 'model', 'serialNumber', 'ram', 'ip', 'macAddress', 'ssd', 'operatingSystemId', 'remoteDesktopAppId', 'refurbished']);
        disableControls(filterDtoGroup, ['printerTypeId', 'phoneNumber', 'networkEquipmentTypeId', 'floor', 'serverDiskTypeId', 'diskRotations', 'networkDisk']);
        workstationFilterDtoGroup.disable();
        break;
    }
  }
}

function enableControls(formGroup: FormGroup, controls: string[]): void {
  controls.forEach(control => formGroup.get(control)?.enable());
}

function disableControls(formGroup: FormGroup, controls: string[]): void {
  controls.forEach(control => formGroup.get(control)?.disable());
}
