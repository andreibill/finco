import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  Briefcase,
  Building2,
  Calculator,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Clock,
  Download,
  Eye,
  EyeOff,
  Facebook,
  File,
  FileArchive,
  FileText,
  Folder,
  FolderOpen,
  Inbox,
  Info,
  Instagram,
  Link,
  Linkedin,
  Lock,
  LogOut,
  Mail,
  MailPlus,
  MapPin,
  Menu,
  MoreHorizontal,
  Phone,
  Receipt,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Upload,
  UserPlus,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import "./Icon.css";

// Pastram API-ul cu `name` string din prototip (iconLeft="mail", name="eye-off").
// Importam explicit doar iconitele folosite (tree-shaking) si le mapam dupa nume.
const ICON_MAP: Record<string, LucideIcon> = {
  "alert-circle": AlertCircle,
  "alert-triangle": AlertTriangle,
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  "bar-chart-3": BarChart3,
  bell: Bell,
  briefcase: Briefcase,
  "building-2": Building2,
  calculator: Calculator,
  check: Check,
  "check-circle-2": CheckCircle2,
  "chevron-down": ChevronDown,
  "chevron-right": ChevronRight,
  circle: Circle,
  clock: Clock,
  download: Download,
  eye: Eye,
  "eye-off": EyeOff,
  facebook: Facebook,
  file: File,
  "file-archive": FileArchive,
  "file-text": FileText,
  folder: Folder,
  "folder-open": FolderOpen,
  inbox: Inbox,
  info: Info,
  instagram: Instagram,
  link: Link,
  linkedin: Linkedin,
  lock: Lock,
  "log-out": LogOut,
  mail: Mail,
  "mail-plus": MailPlus,
  "map-pin": MapPin,
  menu: Menu,
  "more-horizontal": MoreHorizontal,
  phone: Phone,
  receipt: Receipt,
  "refresh-cw": RefreshCw,
  search: Search,
  settings: Settings,
  "shield-check": ShieldCheck,
  upload: Upload,
  "user-plus": UserPlus,
  users: Users,
  x: X,
};

export type IconProps = {
  name: string;
  size?: number;
  stroke?: number;
  className?: string;
};

export function Icon({ name, size = 16, stroke = 1.75, className }: IconProps) {
  const Cmp = ICON_MAP[name] ?? Circle;
  return (
    <span className={`icon ${className ?? ""}`}>
      <Cmp size={size} strokeWidth={stroke} />
    </span>
  );
}
