interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const alignment =
    align === "center"
      ? "mx-auto items-center text-center"
      : "items-start text-left";

  return (
    <div className={`flex max-w-3xl flex-col ${alignment}`}>
      {eyebrow && (
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-8 bg-amber-300" />

          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-300">
            {eyebrow}
          </p>

          {align === "center" && <span className="h-px w-8 bg-amber-300" />}
        </div>
      )}

      <h2 className="font-serif text-4xl font-semibold tracking-tight text-white sm:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mt-5 text-base leading-7 text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}