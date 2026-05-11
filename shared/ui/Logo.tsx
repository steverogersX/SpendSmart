import Link from "next/link";

const Logo: React.FC = (): React.ReactElement => {
  return (
    <Link href="/" className="group flex items-center gap-2">
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
    </Link>
  );
};

export default Logo;
