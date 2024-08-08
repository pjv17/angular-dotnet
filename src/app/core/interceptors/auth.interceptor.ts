import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Inject the CookieService
  const cookieService = inject(CookieService);

  const urlParams = new URLSearchParams(req.url.split('?')[1]);
  const addAuth = urlParams.get('addAuth') === 'true';
  
  // Clone the request and add the Authorization header
    const authRequest = addAuth ? req.clone({
      setHeaders: {
        Authorization: cookieService.get('Authorization')
      }
    })
    : req;

    // Pass the cloned request to the next handler
  return next(authRequest);

};
