import { LucideIcon } from "lucide-react";

export type Category = "Writing" | "Tech/Dev" | "Math/Finance" | "Images" | "Misc";

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: Category;
  iconName: string;
  isPlaceholder?: boolean;
  keywords?: string[]; // New field for better discovery
}
