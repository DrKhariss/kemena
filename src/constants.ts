export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export const TRIVIA_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Which lyric is correct?",
    options: [
      "Intentional, somebody call on ifeoma",
      "International, somebody call on ifeoma",
      "International, somebody call on ijeoma",
      "International, somebody call my ifeoma "
    ],
    correctAnswer: 2
  },
  {
    id: 2,
    question: "Which song came first?",
    options: [
      "Evelyn Vibration",
      "Bola",
      "Never come back",
      "Rainy day"
    ],
    correctAnswer: 3
  },
  {
    id: 3,
    question: "What is Kemena’s producer tag?",
    options: [
      "Hmm... oshe!",
      "Yeah yeah Kemena",
      "Oh yeah Oshe!",
      "Yeah Yeah Oshe!"
    ],
    correctAnswer: 0
  },
  {
    id: 4,
    question: "Kemena has only one female collaboration on record. Who is she?",
    options: [
      "Teni (Nigeria)",
      "Tsuni",
      "Nikita Keringe (Kenya)",
      "Kold AF"
    ],
    correctAnswer: 2
  },
  {
    id: 5,
    question: "Kemena has only one female feature on record. What country is she from?",
    options: [
      "Uganda",
      "Ghana",
      "Kenya",
      "Rwanda"
    ],
    correctAnswer: 2
  },
  {
    id: 6,
    question: "Which song features the lyric: Baby shebi you go drink Origin? Cause money no reach Hennessy",
    options: [
      "Only You",
      "Ye",
      "High Tension",
      "Evelyn Vibration"
    ],
    correctAnswer: 1
  },
  {
    id: 7,
    question: "Which of these songs was NOT produced by Kemena?",
    options: [
      "Isi Mbido",
      "Wicked Now",
      "Mind",
      "My Baby"
    ],
    correctAnswer: 0
  },
  {
    id: 8,
    question: "'It’s only a matter of time, Alhaji go link up' This line is from which song?",
    options: [
      "Inugo",
      "Pick up",
      "Amara",
      "Down"
    ],
    correctAnswer: 1
  },
  {
    id: 9,
    question: "'Cause I close work by after 6 sometimes' is a line from which song?",
    options: [
      "Casablanca",
      "9-5",
      "Inugo",
      "Bola"
    ],
    correctAnswer: 1
  },
  {
    id: 10,
    question: "What is the nature of Kemena’s music business?",
    options: [
      "Signed to a local record label",
      "Signed to a major label",
      "Self-owned label structure",
      "Signed to an independent investor"
    ],
    correctAnswer: 2
  },
  {
    id: 11,
    question: "Kemena uses autotune in his music. ",
    options: [
      "True",
      "False"
    ],
    correctAnswer: 0
  },
  {
    id: 12,
    question: "Which statement is correct about Kemena’s headline shows?",
    options: [
      "He had his first headline show in 2019",
      "He performed a headline show in 2021",
      "He has never done an official headline show yet",
      "He has done multiple headline shows"
    ],
    correctAnswer: 2
  },
  {
    id: 13,
    question: "What was Kemena’s first ever released single?",
    options: [
      "Blind",
      "Bad Thing",
      "Vertigo",
      "Motion"
    ],
    correctAnswer: 1
  },
  {
    id: 14,
    question: "Which producer has officially worked on Kemena’s songs as an artiste (besides himself)?",
    options: [
      "Oxygen Mix",
      "JVXN of Mavin Records",
      "Sarz",
      "WalahiSteph"
    ],
    correctAnswer: 1
  },
  {
    id: 15,
    question: "Kemena is originally from Enugu State.",
    options: [
      "True", 
      "False"
    ],
    correctAnswer: 1
  },
  {
    id: 16,
    question: "What is Kemena’s state of origin?",
    options: [
      "Enugu State",
      "Anambra State",
      "Lagos State",
      "Imo State"
    ],
    correctAnswer: 1
  },
  {
    id: 17,
    question: "As it today, Kemena has not headlined his own show.",
    options: [
      "True",
      "False"
    ],
    correctAnswer: 0
  },
  {
    id: 18,
    question: "Which of these colors would Kemena prefer?",
    options: [
      "Yellow",
      "Blood red",
      "Black",
      "Dark Green"
    ],
    correctAnswer: 2
  },
  {
    id: 19,
    question: "When is Kemena’s birthday?",
    options: [
      "June 24",
      "October 14",
      "June 26",
      "September 17"
    ],
    correctAnswer: 0
  },
  {
    id: 20,
    question: "Which of these artists does Kemena have a song with?",
    options: [
      "Ric Hassani",
      "Ogranya",
      "Dwin,the stoic",
      "Sute iwar"
    ],
    correctAnswer: 2
  },
  {
    id: 21,
    question: "Which is Kemena’s most favorite emoji on social media?",
    options: [
      "❤️",
      "🧣",
      "💫",
      "🧊"
    ],
    correctAnswer: 1
  },
  {
    id: 22,
    question: "Who is featured on the Bond cover art?",
    options: [
      "A model",
      "Kemena",
      "A stock image actor",
      "A designer illustration"
    ],
    correctAnswer: 1
  },
  {
    id: 23,
    question: "What is Kemena’s real state of origin?",
    options: [
      "Ric Hassani",
      "Ogranya",
      "Dwin,the stoic",
      "Sute iwar"
    ],
    correctAnswer: 2
  },
  {
    id: 24,
    question: "What is the name of Kemena’s current manager?",
    options: [
      "Akinyemi law",
      "Oxygen mix",
      "Bizzle osikoya",
      "Giwa Morenikeji"
    ],
    correctAnswer: 3
  },
  {
    id: 25,
    question: "What does B.O.N.D stand for in Kemena’s meaning?",
    options: [
      "Bedroom Producer/ On His Own Lane / Never Blow / Doing His Thing",
      "Bedroom Artist / On His Own Wave / Never Stop / Doing Big Things",
      "Between Our Needs & Desires",
      "Better On New Days"
    ],
    correctAnswer: 0
  },
  {
    id: 26,
    question: "Bond is more than an album title. It is also:",
    options: [
      "An acronym",
      "His hometown",
      "His relationship",
      "A childhood nickname"
    ],
    correctAnswer: 0
  },
  {
    id: 27,
    question: "What was kemena first project?",
    options: [
      "Bond the album",
      "Ibadan",
      "Vertigo",
      "Bad thing"
    ],
    correctAnswer: 2
  },
  {
    id: 28,
    question: "Bond was Kemena’s first ever project.",
    options: [
      "True",
      "False"
    ],
    correctAnswer: 1
  },
  {
    id: 29,
    question: "What is Kemena's real name?",
    options: [
      "Ken Mena",
      "Ekene Nkemena",
      "Oghene Kemena",
      "Kenenna Ejike"
    ],
    correctAnswer: 1
  },
  {
    id: 30,
    question: "What is the official name of Kemena Fans",
    options: [
      "Kemena Vibes",
      "The Stans",
      "Kemenarmy",
      "K-Fans"
    ],
    correctAnswer: 2
  },
];

export const getRankData = (score: number) => {
  const ranks = [
    { score: 10, rank: "General", remark: "This is Elite performance!" },
    { score: 9, rank: "Colonel", remark: "High-level command! You clearly know your stuff." },
    { score: 8, rank: "Major", remark: "Nice! A Strong performance!" },
    { score: 7, rank: "Captain", remark: "You have a Solid understanding." },
    { score: 6, rank: "Lieutenant", remark: "Very Decent knowledge" },
    { score: 5, rank: "Sergeant", remark: "Average performance." },
    { score: 4, rank: "Corporal", remark: "Below average. You’re still learning." },
    { score: 3, rank: "Private First Class", remark: "You have basic understanding. Still in early training." },
    { score: 2, rank: "Private", remark: "Your training is just beginning." },
    { score: 1, rank: "Recruit", remark: "Just enlisted. You’re at the very beginning." },
    { score: 0, rank: "Civilian", remark: "Not ready for the field yet." }
  ];
  return ranks.find(r => r.score === score) || ranks[ranks.length - 1];
};
