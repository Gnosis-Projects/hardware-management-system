import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthStateService } from '../services/state-management/auth-state.service';
import { TranslateService } from '@ngx-translate/core';
import { WorkStationStateService } from '../services/state-management/workstation-state.service';
import { DeviceStateService } from '../services/state-management/device-state.service';
import { CarrierStateService } from '../services/state-management/carrier-state.service';
import { Location } from '@angular/common';

export const AuthStateGuard: CanActivateFn = (route, state) => {
  const authStateService = inject(AuthStateService);
  const router = inject(Router);
  const workStationStateService = inject(WorkStationStateService);
  const deviceStateService = inject(DeviceStateService);
  const carrierStateService = inject(CarrierStateService);
  const location = inject(Location);
  const routePath = route.routeConfig?.path;
  const isSuperAdmin = authStateService.isSuperAdmin();
  const isLoggedIn = authStateService.isLoggedIn();
  const hasMultipleCarriers = authStateService.hasMultipleCarriers();

  // General authentication checks
  if (!isLoggedIn) {
    router.navigate(['/login']);
    return false;
  }

  // Redirects based on roles and paths
  const redirectTo = (path: string) => {
    router.navigate([path]);
    return false;
  };

  // Handle login and admin routes
  if ((routePath === 'login' || state.url.startsWith('/login')) && isLoggedIn) {
    return isSuperAdmin ? redirectTo('/admin') : (hasMultipleCarriers ? redirectTo('/carriers') : redirectTo('/selectedCarrier'));
  }

  if (state.url.startsWith('/admin') && !isSuperAdmin) {
    return redirectTo('/selectedCarrier');
  }
  // State-specific checks
  if (routePath === 'workstation' && !workStationStateService.getWorkstationId() && isSuperAdmin) {
    return redirectTo('/carriers');
  }

  if (routePath === 'workstation' && !workStationStateService.getWorkstationId() && !isSuperAdmin) {
    location.back();
  }

  if (routePath === 'selectedDevice' && !deviceStateService.getSelectedDeviceId()) {
    location.back();
  }

  if (routePath === 'selectedCarrier' && !carrierStateService.getSelectedCarrier() && isSuperAdmin) {
    return redirectTo('/carriers');
  }

  if (routePath === 'user-details' && !authStateService.getViewUser()) {
    return isSuperAdmin ? redirectTo('/admin') : redirectTo('/selectedCarrier');
  }


  return true;
};
