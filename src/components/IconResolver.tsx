import { icons } from "lucide-react";

interface IconResolverProps {
  name: string;
  className?: string;
}

export const IconResolver = ({ name, className }: IconResolverProps) => {
  const LucideIcon = icons[name as keyof typeof icons] || icons.Wrench;

  return <LucideIcon className={className} />;
};
