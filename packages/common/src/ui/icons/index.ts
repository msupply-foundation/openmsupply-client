export { ArrowLeftIcon } from './ArrowLeft';
export { ArrowRightIcon } from './ArrowRight';
export { BookIcon } from './Book';
export { CartIcon } from './Cart';
export { CheckboxCheckedIcon } from './CheckboxChecked';
export { CheckboxEmptyIcon } from './CheckboxEmpty';
export { CheckboxIndeterminateIcon } from './CheckboxIndeterminate';
export { CheckIcon } from './Check';
export { ChevronDownIcon } from './ChevronDown';
export { CircleIcon } from './Circle';
export { ClockIcon } from './Clock';
export { CloseIcon } from './Close';
export { CopyIcon } from './Copy';
export { CustomersIcon } from './Customers';
export { DashboardIcon } from './Dashboard';
export { DeleteIcon } from './Delete';
export { DownloadIcon } from './Download';
export { EditIcon } from './Edit';
export { HomeIcon } from './Home';
export { InfoIcon } from './Info';
export { InvoiceIcon } from './Invoice';
export { MenuDotsIcon } from './MenuDots';
export { MessagesIcon } from './Messages';
export { MSupplyGuy } from './MSupplyGuy';
export { PlusCircleIcon } from './PlusCircle';
export { PowerIcon } from './Power';
export { PrinterIcon } from './Printer';
export { RadioIcon } from './Radio';
export { ReportsIcon } from './Reports';
export { RewindIcon } from './Rewind';
export { SaveIcon } from './Save';
export { SettingsIcon } from './Settings';
export { SortAscIcon } from './SortAsc';
export { SortDescIcon } from './SortDesc';
export { StockIcon } from './Stock';
export { SuppliersIcon } from './Suppliers';
export { ToolsIcon } from './Tools';
export { TranslateIcon } from './Translate';
export { TruckIcon } from './Truck';
export { UnhappyMan } from './UnhappyMan';
export { UserIcon } from './User';
export { XCircleIcon } from './XCircle';
export { MedicineIcon } from './MedicineIcon';

type Color =
  | 'inherit'
  | 'action'
  | 'disabled'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning';

export interface SvgIconProps {
  color: Color;
  fontSize?: 'small' | 'medium' | 'large' | 'inherit';
}
