export type RecordCategory = "career" | "team" | "captain" | "format";
export type RecordHolderType = "player" | "team";

export interface CyderCupRecord {
  id: string;
  category: RecordCategory;
  title: string;
  holderType: RecordHolderType;
  playerId?: string;
  teamId?: "navy" | "red";
  holderName: string;
  value: number;
  displayValue: string;
  year?: number;
  description: string;
  sortOrder: number;
}

/**
 * Website-ready snapshot of the workbook's `Feed - Records` output.
 * Keep this shape aligned with the feed so it can be replaced by generated
 * JSON without changing the Records page component.
 */
export const records: CyderCupRecord[] = [
  {
    id: "career-most-wins",
    category: "career",
    title: "Most Career Wins",
    holderType: "player",
    playerId: "navy-steve",
    teamId: "navy",
    holderName: "Steve Wells",
    value: 10,
    displayValue: "10 wins",
    description: "Player with the most career match wins.",
    sortOrder: 10,
  },
  {
    id: "career-best-points-pct",
    category: "career",
    title: "Best Career Points Percentage",
    holderType: "player",
    playerId: "navy-steve",
    teamId: "navy",
    holderName: "Steve Wells",
    value: 0.6666666667,
    displayValue: "66.7%",
    description: "Player with the highest career points percentage.",
    sortOrder: 20,
  },
  {
    id: "career-most-losses",
    category: "career",
    title: "Most Career Losses",
    holderType: "player",
    playerId: "red-dylan",
    teamId: "red",
    holderName: "Dylan Bradley",
    value: 11,
    displayValue: "11 losses",
    description: "Player with the most career match losses.",
    sortOrder: 30,
  },
  {
    id: "career-most-ties",
    category: "career",
    title: "Most Career Ties",
    holderType: "player",
    playerId: "navy-jj",
    teamId: "navy",
    holderName: "JJ Meakings",
    value: 2,
    displayValue: "2 ties",
    description: "Player with the most career tied matches.",
    sortOrder: 40,
  },
  {
    id: "team-most-titles",
    category: "team",
    title: "Most Cyder Cup Titles",
    holderType: "team",
    teamId: "navy",
    holderName: "Team Navy",
    value: 3,
    displayValue: "3 titles",
    description: "Team with the most completed Cyder Cup victories.",
    sortOrder: 50,
  },
  {
    id: "captain-most-wins",
    category: "captain",
    title: "Most Captain Victories",
    holderType: "player",
    playerId: "navy-eric",
    teamId: "navy",
    holderName: "Eric Bleim",
    value: 2,
    displayValue: "2 captain victories",
    description: "Captain with the most Cyder Cup victories.",
    sortOrder: 60,
  },
  {
    id: "singles-most-wins",
    category: "format",
    title: "Most Singles Wins",
    holderType: "player",
    playerId: "red-sam",
    teamId: "red",
    holderName: "Sam Griffiths",
    value: 3,
    displayValue: "3 wins",
    description: "Player with the most historical singles wins.",
    sortOrder: 70,
  },
  {
    id: "singles-best-pct",
    category: "format",
    title: "Best Singles Win Percentage",
    holderType: "player",
    playerId: "red-sam",
    teamId: "red",
    holderName: "Sam Griffiths",
    value: 0.7,
    displayValue: "70.0%",
    description: "Player with the best singles points percentage.",
    sortOrder: 80,
  },
  {
    id: "fourball-most-wins",
    category: "format",
    title: "Most Fourball Wins",
    holderType: "player",
    playerId: "red-sam",
    teamId: "red",
    holderName: "Sam Griffiths",
    value: 3,
    displayValue: "3 wins",
    description: "Player with the most historical fourball wins.",
    sortOrder: 90,
  },
  {
    id: "fourball-best-pct",
    category: "format",
    title: "Best Fourball Win Percentage",
    holderType: "player",
    playerId: "red-sam",
    teamId: "red",
    holderName: "Sam Griffiths",
    value: 0.6,
    displayValue: "60.0%",
    description: "Player with the best fourball points percentage.",
    sortOrder: 100,
  },
  {
    id: "scramble-most-wins",
    category: "format",
    title: "Most Scramble Wins",
    holderType: "player",
    playerId: "navy-steve",
    teamId: "navy",
    holderName: "Steve Wells",
    value: 3,
    displayValue: "3 wins",
    description: "Player with the most historical scramble wins.",
    sortOrder: 110,
  },
  {
    id: "scramble-best-pct",
    category: "format",
    title: "Best Scramble Win Percentage",
    holderType: "player",
    playerId: "navy-steve",
    teamId: "navy",
    holderName: "Steve Wells",
    value: 0.75,
    displayValue: "75.0%",
    description: "Player with the best scramble points percentage.",
    sortOrder: 120,
  },
];

export const recordsByCategory = (category: RecordCategory) =>
  records
    .filter((record) => record.category === category)
    .sort((a, b) => a.sortOrder - b.sortOrder);

