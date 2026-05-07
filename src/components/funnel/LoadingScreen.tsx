export function LoadingScreen() {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center py-16 text-center w-full">
      <h2 className="text-xl font-extrabold text-[#3d1766] font-sans mb-6">
        Carregando o seu teste...
      </h2>
      <div className="w-full max-w-xs h-3 bg-[#3d1766]/20 rounded-full overflow-hidden">
        <div className="h-full bg-[#3d1766] rounded-full animate-loading-bar" />
      </div>
    </div>
  );
}
