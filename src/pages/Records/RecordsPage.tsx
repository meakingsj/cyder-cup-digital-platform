import PageIntro from "../../components/common/PageIntro";

export default function RecordsPage() {
  const recordCategories = [
    "Career Points",
    "Singles Record",
    "Four-Ball Record",
    "Scramble Record",
    "Head-to-Head",
    "Longest Unbeaten Streak",
  ];

  return (
    <>
      <PageIntro
        eyebrow="The Record Book"
        title="Cyder Cup Records"
        description="The leading performances and career achievements from every edition of the Cyder Cup."
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recordCategories.map((category) => (
            <article
              key={category}
              className="min-h-40 rounded-sm border border-white/10 bg-white/[0.03] p-6"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-amber-300">
                Record Category
              </p>
              <h2 className="mt-5 font-serif text-2xl text-white">
                {category}
              </h2>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}