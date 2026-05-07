import { useEffect, useState } from "react";

export function VerifyingScreen() {
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => Math.min(95, p + Math.random() * 15));
    }, 300);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="animate-fade-in py-16 text-center w-full flex flex-col items-center">
      <h2 className="text-xl font-extrabold text-[#3d1766] font-sans mb-6">
        Verificando disponibilidade...
      </h2>
      <div className="w-full max-w-xs h-3 bg-[#3d1766]/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#312e81] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
