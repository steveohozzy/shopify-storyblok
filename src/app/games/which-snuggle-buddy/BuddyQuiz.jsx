
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  RotateCcw,
  Sparkles,
  Star,
} from "lucide-react";

const QUESTIONS = [
  {
    title: "What's your perfect day?",
    subtitle: "Imagine a day that's all yours...",
    answers: [
      { label: "Exploring somewhere new", emoji: "🌳", scores: { fox: 3, badger: 2 } },
      { label: "Cosy blankets and a good book", emoji: "📚", scores: { bunny: 3, otter: 1 } },
      { label: "Playing games with everyone", emoji: "🎉", scores: { dog: 3, otter: 2 } },
      { label: "Splashing about and having fun", emoji: "💦", scores: { otter: 3, fox: 1 } },
      { label: "Discovering hidden treasures", emoji: "🔎", scores: { badger: 3, fox: 2 } },
    ],
  },
  {
    title: "Your friend feels a little sad. What do you do?",
    subtitle: "Everyone needs a friend sometimes.",
    answers: [
      { label: "Give them the biggest cuddle", emoji: "🫂", scores: { bunny: 3, dog: 2 } },
      { label: "Make them laugh with a silly game", emoji: "🤹", scores: { otter: 3, dog: 2 } },
      { label: "Help them find a solution", emoji: "🧩", scores: { badger: 3, fox: 1 } },
      { label: "Take them on a little adventure", emoji: "🌈", scores: { fox: 3, otter: 1 } },
      { label: "Sit beside them and listen", emoji: "💗", scores: { bunny: 2, dog: 2, badger: 1 } },
    ],
  },
  {
    title: "Which magical place would you visit?",
    subtitle: "Pick the world that calls to you.",
    answers: [
      { label: "A forest full of secrets", emoji: "🍄", scores: { fox: 2, badger: 3 } },
      { label: "A cloud castle in the sky", emoji: "☁️", scores: { bunny: 2, fox: 2 } },
      { label: "A sparkling underwater kingdom", emoji: "🐚", scores: { otter: 3, dog: 1 } },
      { label: "A garden full of flowers", emoji: "🌸", scores: { bunny: 3, dog: 1 } },
      { label: "A friendly village full of games", emoji: "🏡", scores: { dog: 3, otter: 2 } },
    ],
  },
  {
    title: "What's your special superpower?",
    subtitle: "Every buddy has their own kind of magic.",
    answers: [
      { label: "Being brave and curious", emoji: "🦊", scores: { fox: 3, badger: 1 } },
      { label: "Making everyone feel loved", emoji: "💞", scores: { bunny: 3, dog: 2 } },
      { label: "Finding a way through any problem", emoji: "🧭", scores: { badger: 3, fox: 1 } },
      { label: "Turning an ordinary day into fun", emoji: "🎈", scores: { otter: 3, dog: 2 } },
      { label: "Always being there for your friends", emoji: "🐾", scores: { dog: 3, bunny: 2 } },
    ],
  },
  {
    title: "Choose your perfect cosy evening.",
    subtitle: "The day is done. Time to snuggle!",
    answers: [
      { label: "A bedtime story and soft pillows", emoji: "🌙", scores: { bunny: 3, badger: 1 } },
      { label: "A blanket fort and secret mission", emoji: "🏕️", scores: { fox: 2, badger: 3 } },
      { label: "A film night with all your friends", emoji: "🍿", scores: { dog: 3, otter: 2 } },
      { label: "A bubble bath and splashy fun", emoji: "🛁", scores: { otter: 3, bunny: 1 } },
      { label: "Dreaming up tomorrow's adventures", emoji: "✨", scores: { fox: 3, badger: 2 } },
    ],
  },
];

const FALLBACK_BUDDIES = [
  { id: "fox", name: "Fabian Fox", animal: "fox", emoji: "🦊", colour: "#ed9b62", tagline: "A curious little dreamer.", description: "You're full of curiosity and always ready to discover something wonderful." },
  { id: "bunny", name: "Bella Bunny", animal: "bunny", emoji: "🐰", colour: "#e9c6cf", tagline: "A soft and sleepy sweetheart.", description: "You bring warmth, kindness and a little bit of magic wherever you go." },
  { id: "badger", name: "Brooke Badger", animal: "badger", emoji: "🦡", colour: "#9295a5", tagline: "A gentle little explorer.", description: "You're thoughtful, resourceful and always ready to solve a little mystery." },
  { id: "dog", name: "Dottie Dog", animal: "dog", emoji: "🐶", colour: "#d8ad7b", tagline: "Your very best bedtime friend.", description: "You're loyal, caring and happiest when the people you love are smiling." },
  { id: "otter", name: "Oakley Otter", animal: "otter", emoji: "🦦", colour: "#ad8069", tagline: "A cuddly, cosy adventurer.", description: "You're playful, full of energy and know how to make every day special." },
];

function getBuddyKey(buddy) {
  const text = [
    buddy?.id,
    buddy?.animal,
    buddy?.name,
    buddy?.category,
  ].filter(Boolean).join(" ").toLowerCase();

  const keys = ["badger", "bunny", "rabbit", "fox", "dog", "otter"];

  return keys.find((key) => text.includes(key)) || "fox";
}

function getImageUrl(image) {
  if (typeof image === "string") return image;
  return image?.filename || image?.url || "";
}

export default function BuddyQuiz({ buddies = [] }) {
  const [answers, setAnswers] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const availableBuddies = useMemo(() => {
    const source = buddies.length ? buddies : FALLBACK_BUDDIES;

    return source.map((buddy) => {
      const fallback = FALLBACK_BUDDIES.find(
        (item) => item.id === getBuddyKey(buddy)
      );

      return {
        ...fallback,
        ...buddy,
        animal: buddy.animal || fallback?.animal || getBuddyKey(buddy),
        emoji: fallback?.emoji || "🧸",
        colour: fallback?.colour || "#e9e4ff",
        tagline:
          buddy.tagline ||
          buddy.line ||
          fallback?.tagline ||
          "A very special Snuggle Buddy.",
        description:
          buddy.description ||
          fallback?.description ||
          "A lovely friend with their own special kind of magic.",
        image: getImageUrl(buddy.image),
        quizKey: getBuddyKey(buddy),
      };
    });
  }, [buddies]);

  const result = useMemo(() => {
    const scores = {};

    availableBuddies.forEach((buddy) => {
      scores[buddy.quizKey] = 0;
    });

    answers.forEach((answerIndex, questionNumber) => {
      const answer = QUESTIONS[questionNumber]?.answers[answerIndex];

      if (!answer) return;

      Object.entries(answer.scores).forEach(([key, points]) => {
        if (key in scores) scores[key] += points;
      });
    });

    return availableBuddies.reduce((best, buddy) => {
      if (!best || scores[buddy.quizKey] > scores[best.quizKey]) {
        return buddy;
      }

      return best;
    }, null);
  }, [answers, availableBuddies]);

  const question = QUESTIONS[questionIndex];
  const progress = showResult
    ? 100
    : (questionIndex / QUESTIONS.length) * 100;

  function chooseAnswer(index) {
    setSelectedAnswer(index);
  }

  function continueQuiz() {
    if (selectedAnswer === null) return;

    const nextAnswers = [...answers];
    nextAnswers[questionIndex] = selectedAnswer;
    setAnswers(nextAnswers);
    setSelectedAnswer(null);

    if (questionIndex === QUESTIONS.length - 1) {
      setShowResult(true);
    } else {
      setQuestionIndex((current) => current + 1);
    }
  }

  function goBack() {
    if (showResult) {
      setShowResult(false);
      setQuestionIndex(QUESTIONS.length - 1);
      setSelectedAnswer(answers[QUESTIONS.length - 1] ?? null);
      return;
    }

    if (questionIndex === 0) return;

    setQuestionIndex((current) => current - 1);
    setSelectedAnswer(answers[questionIndex - 1] ?? null);
  }

  function restartQuiz() {
    setAnswers([]);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#fffaf7] px-4 py-6 text-[#403451] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex items-center justify-between gap-3">
          <Link href="/games" className="flex items-center gap-2 text-sm font-bold text-[#766583] transition hover:text-[#65558f]">
            <ArrowLeft size={17} />
            <span className="hidden sm:inline">Back to the Playroom</span>
            <span className="sm:hidden">Playroom</span>
          </Link>

          <div className="flex items-center gap-2 rounded-full border border-white bg-white px-3 py-2 text-xs font-bold text-[#917ba1] shadow-sm sm:px-4">
            <Heart size={15} className="text-[#d98eb2]" fill="currentColor" />
            FIND YOUR BUDDY
          </div>
        </header>

        <section className="overflow-hidden rounded-[32px] border-4 border-white bg-gradient-to-br from-[#f2eaff] via-[#fff0f6] to-[#e8f8f1] shadow-[0_20px_70px_rgba(99,70,110,0.10)]">
          <div className="h-2 bg-white/70">
            <div
              className="h-full rounded-r-full bg-gradient-to-r from-[#c99edb] to-[#86cdb5] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {!showResult ? (
            <div className="p-5 sm:p-10">
              {questionIndex === 0 ? (
                <>
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-white/70 text-6xl shadow-sm">
                    🧸
                  </div>

                  <div className="mx-auto mt-5 max-w-2xl text-center">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/75 px-4 py-2 text-xs font-bold tracking-widest text-[#a278a7]">
                      <Sparkles size={14} />
                      YOUR LITTLE PERSONALITY QUIZ
                    </span>

                    <h1 className="mt-5 font-heading text-4xl font-bold leading-tight sm:text-6xl">
                      Which Snuggle Buddy are you?
                    </h1>

                    <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#81718c] sm:text-base">
                      Answer five fun questions about your personality,
                      discover your special kind of magic and meet the
                      buddy who is just like you.
                    </p>
                  </div>
                </>
              ) : null}

              <div className="mx-auto mt-8 max-w-2xl">
                <div className="mb-5 flex items-center justify-between text-xs font-bold text-[#8d7b99]">
                  <span>QUESTION {questionIndex + 1} OF {QUESTIONS.length}</span>
                  <span>{Math.round(((questionIndex + 1) / QUESTIONS.length) * 100)}% of the way</span>
                </div>

                <h2 className="font-heading text-2xl font-bold sm:text-3xl">
                  {question.title}
                </h2>

                <p className="mt-2 text-sm text-[#8b7a95]">
                  {question.subtitle}
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {question.answers.map((answer, index) => {
                    const active = selectedAnswer === index;

                    return (
                      <button
                        key={answer.label}
                        type="button"
                        onClick={() => chooseAnswer(index)}
                        aria-pressed={active}
                        className={`flex min-h-[78px] items-center gap-4 rounded-2xl border-2 p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                          active
                            ? "border-[#9981c9] bg-white shadow-md ring-4 ring-[#dcd0f2]/60"
                            : "border-white bg-white/65 hover:border-[#e3d7ee]"
                        }`}
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f7eff9] text-2xl">
                          {answer.emoji}
                        </span>
                        <span className="flex-1 text-sm font-semibold leading-5 text-[#574764]">
                          {answer.label}
                        </span>
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                          active
                            ? "border-[#8e79bc] bg-[#8e79bc] text-white"
                            : "border-[#e2d8e8]"
                        }`}>
                          {active ? <span className="text-xs">✓</span> : null}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-7 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={questionIndex === 0}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-bold text-[#887692] transition hover:bg-white/70 disabled:invisible"
                  >
                    <ArrowLeft size={16} />
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={continueQuiz}
                    disabled={selectedAnswer === null}
                    className="inline-flex items-center gap-2 rounded-full bg-[#65558f] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#65558f]/20 transition hover:bg-[#514276] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {questionIndex === QUESTIONS.length - 1
                      ? "Reveal my buddy"
                      : "Next question"}
                    <ArrowRight size={17} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 text-center sm:p-10">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-bold tracking-widest text-[#8b70a4]">
                <Sparkles size={15} />
                YOUR BUDDY MATCH IS HERE
              </div>

              <h1 className="mx-auto mt-5 max-w-2xl font-heading text-4xl font-bold leading-tight sm:text-5xl">
                You're a little bit like...
              </h1>

              {result ? (
                <div className="mx-auto mt-7 max-w-xl overflow-hidden rounded-[30px] border-4 border-white bg-white/80 shadow-lg">
                  <div
                    className="relative flex min-h-[245px] items-center justify-center overflow-hidden"
                    style={{
                      background: `radial-gradient(circle at center, #ffffff 0%, ${result.colour} 100%)`,
                    }}
                  >
                    <span className="absolute left-8 top-8 text-3xl">✦</span>
                    <span className="absolute right-8 top-10 text-2xl">♡</span>
                    {result.image ? (
                      <img
                        src={result.image}
                        alt={result.name}
                        className="relative z-10 max-h-64 w-56 object-contain drop-shadow-md"
                      />
                    ) : (
                      <span className="relative z-10 text-8xl" role="img" aria-label={result.name}>
                        {result.emoji}
                      </span>
                    )}
                    <span className="absolute bottom-5 right-8 text-3xl">✨</span>
                  </div>

                  <div className="px-6 pb-7 pt-5 sm:px-9">
                    <div className="mb-3 flex justify-center gap-1 text-[#e8b94e]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={17} fill="currentColor" />
                      ))}
                    </div>

                    <h2 className="font-heading text-3xl font-bold sm:text-4xl">
                      {result.name}
                    </h2>

                    <p className="mt-2 font-semibold text-[#9877a8]">
                      {result.tagline}
                    </p>

                    <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#80728a]">
                      {result.description}
                    </p>

                    <div className="mt-5 rounded-2xl bg-[#f6effa] p-4 text-sm leading-6 text-[#756181]">
                      <Heart size={16} className="mb-2 inline text-[#d98eb2]" fill="currentColor" />
                      {" "}Your perfect buddy match! Keep being wonderfully you.
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mt-6 text-sm text-[#81718c]">
                  We couldn't find a buddy match just yet. Please try again.
                </p>
              )}

              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={restartQuiz}
                  className="inline-flex items-center gap-2 rounded-full border border-[#e5d9ec] bg-white px-6 py-3.5 text-sm font-bold text-[#65558f] transition hover:bg-[#f8f2fb]"
                >
                  <RotateCcw size={16} />
                  Try again
                </button>

                <Link
                  href="/games"
                  className="inline-flex items-center gap-2 rounded-full bg-[#65558f] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#65558f]/20 transition hover:bg-[#514276]"
                >
                  Back to the Playroom
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
