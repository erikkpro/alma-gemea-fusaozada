import { ReactNode } from "react";

export function MysticShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-xl flex-1 flex flex-col">{children}</div>
    </div>
  );
}

export function MysticHeader() {
  return (
    <div className="text-center mb-8 animate-fade-in">
      <div className="inline-flex items-center gap-2 text-gold text-sm uppercase tracking-[0.3em] font-medium mb-3">
        <span>✦</span>
        <span>Alma Gêmea</span>
        <span>✦</span>
      </div>
    </div>
  );
}
