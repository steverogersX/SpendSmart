const Logo: React.FC = (): React.ReactElement => {
  return (
    <div className="flex items-center gap-1">
      <span className="font-mono text-2xl font-bold text-emerald-500 transition-colors group-hover:text-emerald-400">
        $
      </span>
      <span className="text-[20px] font-semibold tracking-tight text-foreground">
        Spend
        <span className="text-emerald-500 transition-colors group-hover:text-emerald-400">
          Smart
        </span>
      </span>
    </div>
  );
};

export default Logo;
