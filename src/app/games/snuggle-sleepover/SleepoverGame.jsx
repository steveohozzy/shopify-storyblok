
"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Moon, RotateCcw, Sparkles, Star } from "lucide-react";

const BLANKETS = [
  { name: "Rose Pink", colour: "#eaa5b5", pattern: "🌸" },
  { name: "Mint Dream", colour: "#a9d9c7", pattern: "🌿" },
  { name: "Lavender Sky", colour: "#c5b8e8", pattern: "✦" },
  { name: "Honey Bear", colour: "#f1ce83", pattern: "★" },
];

const PILLOWS = [
  { name: "Cloud", colour: "#ffffff", emoji: "☁️" },
  { name: "Pink Heart", colour: "#f6c6d3", emoji: "💗" },
  { name: "Little Star", colour: "#f5dc91", emoji: "⭐" },
  { name: "Mint", colour: "#c2e6d8", emoji: "🌙" },
];

const ACCESSORIES = [
  { name: "Teddy", emoji: "🧸" },
  { name: "Little Star", emoji: "⭐" },
  { name: "Magic Wand", emoji: "🪄" },
  { name: "Dream Cloud", emoji: "☁️" },
];

export default function SleepoverGame({ buddies = [] }) {
  const [step, setStep] = useState("choose");
  const [selectedBuddy, setSelectedBuddy] = useState(null);
  const [blanket, setBlanket] = useState(BLANKETS[0]);
  const [pillow, setPillow] = useState(PILLOWS[0]);
  const [accessory, setAccessory] = useState(ACCESSORIES[0]);
  const [earnedStars, setEarnedStars] = useState(0);

  function startSleepover() {
    if (!selectedBuddy) return;
    setStep("decorate");
  }

  function tuckInBuddy() {
    setEarnedStars((stars) => stars + 1);
    setStep("finished");
  }

  function playAgain() {
    setStep("choose");
    setSelectedBuddy(null);
    setBlanket(BLANKETS[0]);
    setPillow(PILLOWS[0]);
    setAccessory(ACCESSORIES[0]);
  }

  return (
    <main className="min-h-screen bg-[#fff8f5] px-4 py-8 text-[#004c46] sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 text-center sm:mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#004c46]/10 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] shadow-sm">
            <Moon size={15} />
            A cosy little adventure
          </div>

          <h1 className="font-heading text-4xl font-bold leading-tight sm:text-6xl">
            The Snuggle Sleepover
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#004c46]/75 sm:text-base">
            Pick your buddy, make a dreamy bed, and get ready for the sweetest
            goodnight ever.
          </p>
        </header>

        <div className="mb-8 flex items-center justify-center gap-2">
          {[
            { id: "choose", label: "Choose a buddy" },
            { id: "decorate", label: "Make it cosy" },
            { id: "finished", label: "Sweet dreams" },
          ].map((item, index) => {
            const steps = ["choose", "decorate", "finished"];
            const activeIndex = steps.indexOf(step);
            const isComplete = index < activeIndex;
            const isActive = item.id === step;

            return (
              <div key={item.id} className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    isActive
                      ? "bg-[#00594f] text-white"
                      : isComplete
                        ? "bg-[#c8e7d9] text-[#004c46]"
                        : "bg-white text-[#004c46]/45"
                  }`}
                >
                  {isComplete ? "✓" : index + 1}
                </div>
                <span
                  className={`hidden text-xs font-bold sm:inline ${
                    isActive ? "text-[#004c46]" : "text-[#004c46]/50"
                  }`}
                >
                  {item.label}
                </span>
                {index < 2 && (
                  <div className="mx-1 h-px w-5 bg-[#004c46]/15 sm:w-10" />
                )}
              </div>
            );
          })}
        </div>

        {step === "choose" && (
          <section>
            <div className="mb-5 text-center">
              <h2 className="font-heading text-2xl font-bold sm:text-3xl">
                Who's staying over?
              </h2>
              <p className="mt-2 text-sm text-[#004c46]/70">
                Choose your sleepyhead.
              </p>
            </div>

            {buddies.length === 0 ? (
              <div className="rounded-3xl border border-[#004c46]/10 bg-white p-8 text-center">
                <p className="font-heading text-xl font-bold">
                  Our buddies are having a little nap!
                </p>
                <p className="mt-2 text-sm text-[#004c46]/70">
                  We couldn't load the buddies just now. Please try again in a
                  moment.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {buddies.map((buddy, index) => {
                    const isSelected = selectedBuddy?.id === buddy.id;

                    return (
                      <button
                        key={`${buddy.id}-${index}`}
                        type="button"
                        onClick={() => setSelectedBuddy(buddy)}
                        aria-pressed={isSelected}
                        className={`group overflow-hidden rounded-3xl border-2 bg-white text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${
                          isSelected
                            ? "border-[#00594f] ring-4 ring-[#c8e7d9]"
                            : "border-transparent hover:border-[#004c46]/15"
                        }`}
                      >
                        <div
                          className={`relative aspect-square overflow-hidden ${
                            index % 2 === 0
                              ? "bg-[#f9e6e2]"
                              : "bg-[#e7f2ed]"
                          }`}
                        >
                          {buddy.image ? (
                            <img
                              src={buddy.image}
                              alt={buddy.name}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-5xl">
                              🧸
                            </div>
                          )}
                          {isSelected && (
                            <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#00594f] text-sm font-bold text-white shadow">
                              ✓
                            </span>
                          )}
                        </div>
                        <div className="p-3 sm:p-4">
                          <p className="font-heading text-base font-bold sm:text-lg">
                            {buddy.name}
                          </p>
                          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#004c46]/65 sm:text-sm">
                            {buddy.line || "Ready for a cosy night."}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={startSleepover}
                    disabled={!selectedBuddy}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#00594f] px-7 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#003f39] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Let's get cosy
                    <ArrowRight size={18} />
                  </button>
                </div>
              </>
            )}
          </section>
        )}

        {step === "decorate" && selectedBuddy && (
          <section>
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="overflow-hidden rounded-[32px] border border-[#004c46]/10 bg-[#e7f2ed] p-4 sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-white/80 px-3 py-1.5 text-xs font-bold">
                    {selectedBuddy.name}'s bedroom
                  </span>
                  <span className="text-xl" aria-hidden="true">🌙</span>
                </div>

                <div className="relative flex min-h-[390px] flex-col items-center justify-end overflow-hidden rounded-[25px] bg-gradient-to-b from-[#c9d5f2] via-[#e8d9ef] to-[#f9e6e2] px-3 pt-10">
                  <span className="absolute left-[12%] top-[12%] text-xl text-white">✦</span>
                  <span className="absolute left-[25%] top-[25%] text-sm text-white">✧</span>
                  <span className="absolute right-[17%] top-[16%] text-xl text-white">✦</span>
                  <span className="absolute right-[28%] top-[34%] text-sm text-white">✧</span>

                  <div className="absolute right-[12%] top-[9%] flex h-14 w-14 items-center justify-center rounded-full bg-[#fff5cf] text-3xl shadow-[0_0_35px_rgba(255,245,207,0.7)]">
                    ☾
                  </div>

                  <div className="relative z-10 mb-[-4px] flex flex-col items-center">
                    <div className="relative z-20 mb-[-12px] flex h-16 w-40 items-center justify-center rounded-t-[24px] border-4 border-white/90 bg-white shadow-md">
                      <div
                        className="flex h-11 w-32 items-center justify-center rounded-t-[18px]"
                        style={{ backgroundColor: pillow.colour }}
                      >
                        <span className="text-2xl">{pillow.emoji}</span>
                      </div>
                    </div>

                    <div className="relative flex h-36 w-64 items-start justify-center rounded-t-[38px] border-4 border-white/90 shadow-lg sm:w-72"
                      style={{ backgroundColor: blanket.colour }}
                    >
                      <div className="absolute inset-3 rounded-t-[28px] border border-white/35" />
                      <div className="absolute inset-x-0 top-4 flex justify-around px-4 text-xl text-white/80">
                        <span>{blanket.pattern}</span>
                        <span>{blanket.pattern}</span>
                        <span>{blanket.pattern}</span>
                      </div>

                      {selectedBuddy.image ? (
                        <img
                          src={selectedBuddy.image}
                          alt={selectedBuddy.name}
                          className="relative z-10 mt-[-52px] h-32 w-32 rounded-full object-cover drop-shadow-xl sm:h-36 sm:w-36"
                        />
                      ) : (
                        <span className="relative z-10 mt-[-35px] text-7xl">🧸</span>
                      )}
                    </div>

                    <div className="h-5 w-72 rounded-b-xl bg-[#b88b83] shadow-md" />
                    <div className="flex w-64 justify-between px-4 sm:w-72">
                      <div className="h-10 w-4 rounded-b-md bg-[#b88b83]" />
                      <div className="h-10 w-4 rounded-b-md bg-[#b88b83]" />
                    </div>
                  </div>

                  <div className="relative z-20 mb-5 mt-2 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/80 bg-white/85 text-2xl shadow-md">
                    {accessory.emoji}
                  </div>
                </div>

                <p className="mt-4 text-center text-sm font-medium text-[#004c46]/75">
                  A little bed, a big cuddle, and sweet dreams.
                </p>
              </div>

              <div className="space-y-5">
                <div className="rounded-3xl border border-[#004c46]/10 bg-white p-5 sm:p-6">
                  <h2 className="font-heading text-2xl font-bold">
                    Make it cosy
                  </h2>
                  <p className="mt-1 text-sm text-[#004c46]/65">
                    Pick your favourite things for bedtime.
                  </p>

                  <div className="mt-6">
                    <h3 className="mb-3 text-sm font-bold">1. Choose a blanket</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {BLANKETS.map((item) => (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => setBlanket(item)}
                          aria-pressed={blanket.name === item.name}
                          className={`flex items-center gap-2 rounded-2xl border p-3 text-left text-xs font-bold transition-colors ${
                            blanket.name === item.name
                              ? "border-[#00594f] bg-[#e7f2ed]"
                              : "border-[#004c46]/10 hover:bg-[#fff8f5]"
                          }`}
                        >
                          <span
                            className="flex h-8 w-8 items-center justify-center rounded-xl text-sm"
                            style={{ backgroundColor: item.colour }}
                          >
                            {item.pattern}
                          </span>
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="mb-3 text-sm font-bold">2. Pick a pillow</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {PILLOWS.map((item) => (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => setPillow(item)}
                          aria-pressed={pillow.name === item.name}
                          className={`flex items-center gap-2 rounded-2xl border p-3 text-left text-xs font-bold transition-colors ${
                            pillow.name === item.name
                              ? "border-[#00594f] bg-[#e7f2ed]"
                              : "border-[#004c46]/10 hover:bg-[#fff8f5]"
                          }`}
                        >
                          <span
                            className="flex h-8 w-8 items-center justify-center rounded-xl text-lg"
                            style={{ backgroundColor: item.colour }}
                          >
                            {item.emoji}
                          </span>
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="mb-3 text-sm font-bold">3. Add a bedtime pal</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {ACCESSORIES.map((item) => (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => setAccessory(item)}
                          aria-pressed={accessory.name === item.name}
                          title={item.name}
                          className={`flex flex-col items-center gap-1 rounded-2xl border p-2 transition-colors ${
                            accessory.name === item.name
                              ? "border-[#00594f] bg-[#e7f2ed]"
                              : "border-[#004c46]/10 hover:bg-[#fff8f5]"
                          }`}
                        >
                          <span className="text-2xl">{item.emoji}</span>
                          <span className="text-center text-[10px] font-bold">
                            {item.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setStep("choose")}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#004c46]/20 bg-white px-5 py-3 text-sm font-bold transition-colors hover:bg-[#f9e6e2]"
                  >
                    <ArrowLeft size={17} />
                    Change buddy
                  </button>
                  <button
                    type="button"
                    onClick={tuckInBuddy}
                    className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#00594f] px-5 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-[#003f39]"
                  >
                    Tuck them in
                    <Moon size={17} />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {step === "finished" && selectedBuddy && (
          <section className="mx-auto max-w-2xl overflow-hidden rounded-[32px] border border-[#004c46]/10 bg-white text-center shadow-[0_15px_50px_rgba(0,76,70,0.08)]">
            <div className="relative overflow-hidden bg-gradient-to-br from-[#d5e9e0] via-[#f9e6e2] to-[#e9e1f7] px-6 py-12 sm:px-12 sm:py-16">
              <span className="absolute left-[12%] top-[15%] text-2xl text-white">✦</span>
              <span className="absolute right-[15%] top-[20%] text-xl text-white">✧</span>
              <span className="absolute bottom-[20%] left-[20%] text-lg text-white">✧</span>
              <span className="absolute bottom-[15%] right-[18%] text-2xl text-white">✦</span>

              <div className="relative mx-auto mb-5 flex h-44 w-44 items-center justify-center rounded-full border-8 border-white/80 bg-white/60 shadow-xl sm:h-52 sm:w-52">
                {selectedBuddy.image ? (
                  <img
                    src={selectedBuddy.image}
                    alt={selectedBuddy.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-7xl">🧸</span>
                )}
                <span className="absolute -right-2 top-1 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-[#f5dc91] text-2xl shadow-md">
                  {accessory.emoji}
                </span>
              </div>

              <div className="relative inline-flex items-center gap-2 rounded-full bg-white/85 px-5 py-2 text-sm font-bold shadow-sm">
                <Star size={17} fill="currentColor" />
                Sleepover complete!
              </div>
            </div>

            <div className="px-6 py-8 sm:px-12 sm:py-10">
              <Sparkles className="mx-auto mb-3 text-[#d6a33b]" size={30} />
              <h2 className="font-heading text-3xl font-bold sm:text-4xl">
                Sweet dreams, {selectedBuddy.name}!
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#004c46]/70 sm:text-base">
                Your buddy is tucked up in their {blanket.name.toLowerCase()} blanket,
                resting on their {pillow.name.toLowerCase()} pillow, with their
                little {accessory.name.toLowerCase()} nearby. What a perfect
                sleepover!
              </p>

              <div className="mx-auto my-7 inline-flex items-center gap-3 rounded-2xl bg-[#fff5cf] px-6 py-4">
                <Star className="text-[#d6a33b]" size={28} fill="currentColor" />
                <div className="text-left">
                  <p className="text-2xl font-bold">{earnedStars}</p>
                  <p className="text-xs font-bold text-[#004c46]/70">
                    {earnedStars === 1 ? "Sleepover star earned" : "Sleepover stars earned"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={playAgain}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#00594f] px-6 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-[#003f39]"
                >
                  <RotateCcw size={17} />
                  Play again
                </button>
                <button
                  type="button"
                  onClick={() => setStep("decorate")}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#004c46]/20 bg-white px-6 py-3 text-sm font-bold transition-colors hover:bg-[#e7f2ed]"
                >
                  Try another look
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          </section>
        )}

        <footer className="mt-10 text-center text-xs text-[#004c46]/50">
          <p>Made for little imaginations and very big cuddles.</p>
        </footer>
      </div>
    </main>
  );
}