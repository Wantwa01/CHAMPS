import React from 'react';
import { 
  DashboardIcon, 
  CalendarIcon, 
  MapPinIcon, 
  ChatIcon, 
  RecordsIcon, 
  UserIcon, 
  ArrowRightIcon, 
  StethoscopeIcon, 
  AmbulanceIcon, 
  ShieldCheckIcon, 
  LogoutIcon, 
  ArrowLeftIcon, 
  XIcon, 
  BrandIcon, 
  ArrowUpIcon, 
  ArrowDownIcon, 
  ChartBarIcon, 
  UsersIcon, 
  ClipboardDocumentListIcon, 
  EllipsisVerticalIcon, 
  MailIcon, 
  LockIcon,
  EyeIcon,
  EyeSlashIcon
} from './Icons';

type IconName = 
  | 'dashboard' 
  | 'calendar' 
  | 'map' 
  | 'chat' 
  | 'records' 
  | 'user' 
  | 'arrowRight' 
  | 'stethoscope' 
  | 'ambulance' 
  | 'shieldCheck' 
  | 'logout' 
  | 'arrowLeft' 
  | 'x' 
  | 'brand' 
  | 'arrow-up' 
  | 'arrow-down' 
  | 'chart-bar' 
  | 'users' 
  | 'clipboard-document-list' 
  | 'ellipsis-vertical'
  | 'mail'
  | 'lock'
  | 'eye'
  | 'eye-slash';

interface IconProps {
  name: IconName;
  className?: string;
}

const ICONS: Record<IconName, React.FC<{ className?: string }>> = {
  'dashboard': DashboardIcon,
  'calendar': CalendarIcon,
  'map': MapPinIcon,
  'chat': ChatIcon,
  'records': RecordsIcon,
  'user': UserIcon,
  'arrowRight': ArrowRightIcon,
  'stethoscope': StethoscopeIcon,
  'ambulance': AmbulanceIcon,
  'shieldCheck': ShieldCheckIcon,
  'logout': LogoutIcon,
  'arrowLeft': ArrowLeftIcon,
  'x': XIcon,
  'brand': BrandIcon,
  'arrow-up': ArrowUpIcon,
  'arrow-down': ArrowDownIcon,
  'chart-bar': ChartBarIcon,
  'users': UsersIcon,
  'clipboard-document-list': ClipboardDocumentListIcon,
  'ellipsis-vertical': EllipsisVerticalIcon,
  'mail': MailIcon,
  'lock': LockIcon,
  'eye': EyeIcon,
  'eye-slash': EyeSlashIcon,
};

export const Icon: React.FC<IconProps> = ({ name, className = 'w-6 h-6' }) => {
  const IconComponent = ICONS[name];
  return IconComponent ? <IconComponent className={className} /> : null;
};
