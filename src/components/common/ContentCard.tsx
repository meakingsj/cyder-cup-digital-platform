import type { ReactNode } from "react";

interface ContentCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function ContentCard({
  children,
  className = "",
  hover = false,
}: ContentCardProps) {
  return (
    <article
      className={[
        "relative overflow-hidden rounded-sm border border-white/10",
        "bg-white/[0.035]",
        hover
          ? "transition duration-300 hover:-translate-y-1 hover:border-amber-300/35 hover:bg-white/[0.055]"
          : "",
        className,
      ].join(" ")}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent"
        aria-hidden="true"
      />

      {children}
    </article>
  );
}