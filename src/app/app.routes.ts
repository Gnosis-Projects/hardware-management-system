import { Routes } from '@angular/router';
import { AuthStateGuard } from './guards/authState.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/carriers', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./modules/auth/login/login.component').then(m => m.LoginComponent), data: { breadcrumb: 'Login' }},
  { path: 'carriers', loadComponent: () => import('./modules/carriers/carrier-list/carrier-list.component').then(m => m.CarrierListComponent), data: { breadcrumb: 'Carriers' }, canActivate: [AuthStateGuard] },
  { path: 'admin', loadComponent: () => import('./modules/admin/admin.component').then(m => m.AdminComponent), data: { breadcrumb: 'Admin' }, canActivate: [AuthStateGuard] },
  { path: 'selectedCarrier', loadComponent: () => import('./modules/carriers/carrier-detail/carrier-detail.component').then(m => m.CarrierDetailComponent), data: { breadcrumb: 'Carrier Detail' }, canActivate: [AuthStateGuard] },
  { path: 'selectedDevice', loadComponent: () => import('./modules/devices/device-detail/device-detail.component').then(m => m.DeviceDetailComponent), data: { breadcrumb: 'Device Detail' }, canActivate: [AuthStateGuard] },
  { path: 'selectedDevice/edit', loadComponent: () => import('./modules/devices/edit-device/edit-device.component').then(m => m.EditDeviceComponent), data: { breadcrumb: 'Edit Device' }, canActivate: [AuthStateGuard] },
  { path: 'workstation', loadComponent: () => import('./modules/workstations/workstation-detail/workstation-detail.component').then(m => m.WorkstationDetailComponent), data: { breadcrumb: 'Workstation Detail' }, canActivate: [AuthStateGuard] },
  { path: 'view-history', loadComponent: () => import('./modules/devices/device-history/device-history.component').then(m => m.DeviceHistoryComponent), data: { breadcrumb: 'Device History' }, canActivate: [AuthStateGuard] },
  { path: 'user-details', loadComponent: () => import('./modules/admin/user-details/user-details.component').then(m => m.UserDetailsComponent), data: { breadcrumb: 'User Details' }, canActivate: [AuthStateGuard] },
  { path: 'my-profile', loadComponent: () => import('./modules/auth/my-profile/my-profile.component').then(m => m.MyProfileComponent), data: { breadcrumb: 'My Profile' }, canActivate: [AuthStateGuard] },
  { path: '**', redirectTo: '/carriers', pathMatch: 'full' },
];
