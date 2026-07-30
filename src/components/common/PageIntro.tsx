interface PageIntroProps {
  eyebrow: string;
  title: string;
  description: string;
}

export default function PageIntro({
  eyebrow,
  title,
  description,
}: PageIntroProps) {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#081b2d]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "repeating-radial-gradient(circle at 84% 20%, transparent 0, transparent 44px, rgba(255,255,255,0.7) 45px, transparent 46px)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#04111e]/80 via-transparent to-[#071827]/40"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
        <div className="mb-5 flex items-center gap-4">
          <span className="h-px w-10 bg-amber-300" />

          <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-300">
            {eyebrow}
          </p>
        </div>

        <h1 className="max-w-4xl font-serif text-5xl font-semibold leading-none tracking-tight text-white sm:text-6xl lg:text-7xl">
          {title}
        </h1>

        <p className="mt-7 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}