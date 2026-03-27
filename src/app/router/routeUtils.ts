import type { CustomerPanelPath } from '../../features/customer-panel/model/types';
import { CUSTOMER_PANEL_DEFAULT_PATH } from '../../features/customer-panel/model/constants';
import { CUSTOMER_PANEL_PATHS, CUSTOMER_PANEL_PROJECT_DETAIL_PREFIX, CUSTOMER_PANEL_CONTRACT_DETAIL_PREFIX } from '../../features/customer-panel/model/types';

export function isCustomerPanelPath(pathname: string): pathname is CustomerPanelPath {
    return (CUSTOMER_PANEL_PATHS as readonly string[]).includes(pathname)
        || pathname.startsWith(CUSTOMER_PANEL_PROJECT_DETAIL_PREFIX)
        || pathname.startsWith(CUSTOMER_PANEL_CONTRACT_DETAIL_PREFIX);
}
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
  if (pathname === '/gizlilik-politikasi') {
    return '/gizlilik-politikasi';
  }
  if (pathname === '/kullanici-politikasi') {
    return '/kullanici-politikasi';
  }
  return '/';
}

export function isCustomerPanelRoute(path: AppPath): path is CustomerPanelPath {
  return path.startsWith('/customer-panel');
}

export function isCustomerLoginRoute(path: AppPath): path is CustomerLoginPath {
  return path.startsWith('/customer-login');
}
