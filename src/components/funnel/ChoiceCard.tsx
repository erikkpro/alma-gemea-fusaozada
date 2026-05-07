import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  onClick: () => void;
  children: ReactNode;
  selected?: boolean;
  className?: string;
};

export function ChoiceCard({ onClick, children, selected, className }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left bg-gradient-card border border-border rounded-2xl p-4 sm:p-5",
        "transition-all duration-300 ease-out hover:border-gold hover:shadow-gold hover:-translate-y-0.5",
        "active:scale-[0.98] cursor-pointer flex items-center gap-4",
        "animate-fade-in-up",
        selected && "border-gold shadow-gold",
        className,
      )}
    >
      {children}
    </button>
  );
}
