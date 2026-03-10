import {
  CUSTOMER_PANEL_DEFAULT_PATH,
  isCustomerPanelPath,
  type CustomerPanelPath,
} from '../../features/customer-panel/pages/CustomerPanelPage';
import type { AppPath, CustomerLoginPath } from './types';

export function normalizePath(pathname: string, search: string): AppPath {
  if (pathname === '/portal/auth/verify') {
    return `/customer-login${search}` as CustomerLoginPath;
  }
  if (pathname.startsWith('/customer-login')) {
    return `${pathname}${search}` as CustomerLoginPath;
  }
  if (pathname === '/password-reset-preview') {
    return '/password-reset-preview';
  }
  if (isCustomerPanelPath(pathname)) {
    return pathname;
  }
  if (pathname.startsWith('/customer-panel')) {
    return CUSTOMER_PANEL_DEFAULT_PATH;
  }
  if (pathname === '/iletisim') {
    return '/iletisim';
  }
  if (pathname === '/takim') {
    return '/takim';
  }
  return '/';
}

export function isCustomerPanelRoute(path: AppPath): path is CustomerPanelPath {
  return path.startsWith('/customer-panel');
}

export function isCustomerLoginRoute(path: AppPath): path is CustomerLoginPath {
  return path.startsWith('/customer-login');
}
