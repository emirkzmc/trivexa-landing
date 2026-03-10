import type { NavPath } from '../../shared/layout/Navbar';
import type { CustomerPanelPath } from '../../features/customer-panel/pages/CustomerPanelPage';

export type CustomerLoginPath = `/customer-login${string}`;
export type PreviewPath = '/password-reset-preview';
export type AppPath = NavPath | CustomerPanelPath | CustomerLoginPath | PreviewPath;
