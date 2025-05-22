import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinningGearLogoProps {
  size?: number;
  className?: string;
}

export const SpinningGearLogo = ({ size = 24, className }: SpinningGearLogoProps) => {
  return (
    <div className={cn("relative", className)}>
      <Settings 
        size={size} 
        className="text-grindos-purple animate-spin-slow" 
      />
    </div>
  );
};

export default SpinningGearLogo;
