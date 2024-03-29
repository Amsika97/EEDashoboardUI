import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authguardGuard: CanActivateFn = (route, state) => {
  const router =inject(Router)
  if(sessionStorage.getItem('userData')){
    return true
  }
  router.navigateByUrl("/login")
  return false;
};
