import ContentCard from "../../components/common/ContentCard";
import PageIntro from "../../components/common/PageIntro";
import SectionHeading from "../../components/common/SectionHeading";

const recordCategories = [
  {
    number: "01",
    title: "Career Points",
    description: "The highest cumulative points totals in Cyder Cup history.",
  },
  {
    number: "02",
    title: "Singles Record",
    description: "Career performance in individual singles match play.",
  },
  {
    number: "03",
    title: "Four-Ball Record",
    description: "Career performance in net four-ball team matches.",
  },
  {
    number: "04",
    title: "Scramble Record",
    description: "Career performance in the opening team scramble.",
  },
  {
    number: "05",
    title: "Head-to-Head",
    description: "Historical results between individual singles opponents.",
  },
  {
    number: "06",
    title: "Longest Unbeaten Streak",
    description: "The longest stretches without a match-play defeat.",
  },
];

export default function RecordsPage() {
  return (
    <>
      <PageIntro
        eyebrow="The Record Book"
        title="Cyder Cup Records"
        description="The leading performances and career achievements from every edition of the Cyder Cup."
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="Career Leaders"
          title="The records that define the competition"
          description="Official values will be calculated from the Cyder Cup historical databook."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recordCategories.map((category) => (
            <ContentCard
              key={category.title}
              hover
              className="min-h-56 p-6"
            >
              <p className="text-xs font-bold tracking-[0.25em] text-amber-300">
                {category.number}
              </p>

              <h2 className="mt-5 font-serif text-2xl text-white">
                {category.title}
              </h2>

              <p className="mt-4 text-sm leading-6 text-slate-400">
                {category.description}
              </p>
            </ContentCard>
          ))}
        </div>
      </section>
    </>
  );
}