import {
  DollarSign,
  Camera,
  Gamepad2,
  BatteryCharging,
  Smartphone,
  Headphones,
  Star,
  TrendingUp,
  Zap,
  Shield,
  LucideProps,
  ForwardRefExoticComponent,
  RefAttributes,
} from "lucide-react";

export type Icon = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;

export const iconList = [
  "DollarSign",
  "Camera",
  "Gamepad2",
  "BatteryCharging",
  "Smartphone",
  "Headphones",
  "Star",
  "TrendingUp",
  "Zap",
  "Shield",
];

export const iconMap: { [key: string]: Icon } = {
  DollarSign,
  Camera,
  Gamepad2,
  BatteryCharging,
  Smartphone,
  Headphones,
  Star,
  TrendingUp,
  Zap,
  Shield,
};