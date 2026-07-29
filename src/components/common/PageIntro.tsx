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
    <section className="relative overflow-hidden border-b border-white/10 bg-[#081b2d]">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        aria-hidden="true"
        style={{
          backgroundImage:
            "repeating-radial-gradient(circle at 85% 15%, transparent 0, transparent 22px, rgba(255,255,255,0.12) 23px, transparent 24px)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-amber-300">
          {eyebrow}
        </p>

        <h1 className="max-w-4xl font-serif text-5xl font-semibold leading-none tracking-tight text-white sm:text-6xl lg:text-7xl">
          {title}
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}