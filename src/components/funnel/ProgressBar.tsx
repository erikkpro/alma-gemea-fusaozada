type Props = {
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: Props) {
  const pct = Math.min(100, Math.round((current / total) * 100));
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center text-xs text-muted-foreground mb-2 font-medium tracking-wide">
        <span className="text-gold uppercase">Passo {current} de {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-gold transition-all duration-500 ease-out shadow-gold"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
