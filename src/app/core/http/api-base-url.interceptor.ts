import { HttpInterceptorFn } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';

export const apiBaseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const isAbsoluteUrl = /^https?:\/\//i.test(req.url);

  if (isAbsoluteUrl) {
    return next(req);
  }

  const shouldPrefixApi =
    req.url.startsWith('/customers') ||
    req.url.startsWith('/orders') ||
    req.url.startsWith('/dashboard');

  if (!shouldPrefixApi) {
    return next(req);
  }

  return next(
    req.clone({
      url: `${API_BASE_URL}${req.url}`
    })
  );
};