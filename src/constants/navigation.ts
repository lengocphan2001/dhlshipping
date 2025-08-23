import { NavItem } from '../types';

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'home',
    label: 'Trang chủ',
    icon: 'home',
    path: '/'
  },
  {
    id: 'import',
    label: 'Nhập hàng',
    icon: 'import',
    path: '/import'
  },
  {
    id: 'export',
    label: 'Xuất hàng',
    icon: 'export',
    path: '/export'
  },
  {
    id: 'account',
    label: 'Tài khoản',
    icon: 'account',
    path: '/account'
  }
];
