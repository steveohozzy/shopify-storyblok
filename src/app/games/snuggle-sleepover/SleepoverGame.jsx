
"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Moon,
  RotateCcw,
  Sparkles,
  Star,
} from "lucide-react";

const BUDDIES = [
  { id: "fox", name: "Fabian Fox", animal: "fox", colour: "#ed9b62", belly: "#fff0dc", ears: "#bd6448", muzzle: "#fff5e9", description: "A curious little dreamer." },
  { id: "bunny", name: "Bella Bunny", animal: "bunny", colour: "#e9c6cf", belly: "#fff1ed", ears: "#d991a9", muzzle: "#fff7f3", description: "A soft and sleepy sweetheart." },
  { id: "badger", name: "Brooke Badger", animal: "badger", colour: "#9295a5", belly: "#e7e7ee", ears: "#666b80", muzzle: "#f7f2ed", description: "A gentle little explorer." },
  { id: "dog", name: "Dottie Dog", animal: "dog", colour: "#d8ad7b", belly: "#fff0d8", ears: "#a87550", muzzle: "#fff4e8", description: "Your very best bedtime friend." },
  { id: "otter", name: "Oakley Otter", animal: "otter", colour: "#ad8069", belly: "#f5dfc9", ears: "#805844", muzzle: "#f9eadb", description: "A cuddly, cosy adventurer." },
];

const ESSENTIALS = [
  { id: "pillow", name: "Pillow", emoji: "🛏️", hint: "Look where you rest your head", x: "8%", y: "68%" },
  { id: "blanket", name: "Blanket", emoji: "🧺", hint: "Look in the laundry basket", x: "76%", y: "76%" },
  { id: "book", name: "Storybook", emoji: "📖", hint: "Look on the bookshelf", x: "9%", y: "32%" },
  { id: "teddy", name: "Teddy", emoji: "🧸", hint: "Look inside the toy box", x: "70%", y: "56%" },
];

const STORIES = [
  { id: "moon", title: "The Sleepy Moon", emoji: "🌙", description: "A gentle adventure through a sky full of stars.", colour: "#e8e3fa" },
  { id: "forest", title: "The Cosy Forest", emoji: "🌳", description: "Meet woodland friends getting ready for bed.", colour: "#dcefe4" },
  { id: "ocean", title: "Dreams Under the Sea", emoji: "🐳", description: "Float through a magical underwater dream.", colour: "#dcecf8" },
];

const BLANKETS = [
  { name: "Rose Pink", colour: "#eaa5b5", pattern: "🌸" },
  { name: "Mint Dream", colour: "#a9d9c7", pattern: "🌿" },
  { name: "Lavender Sky", colour: "#c5b8e8", pattern: "✦" },
  { name: "Honey Bear", colour: "#f1ce83", pattern: "★" },
];

const PILLOWS = [
  { name: "Cloud", colour: "#fffdfb", emoji: "☁️" },
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


const NIGHT_STARS = [
  { x: "14%", y: "39%", delay: "0.7s" },
  { x: "78%", y: "47%", delay: "1.9s" },
  { x: "42%", y: "61%", delay: "1.2s" },
  { x: "88%", y: "23%", delay: "2.5s" },
  { x: "23%", y: "73%", delay: "0.3s" },
];

const SKY_STARS = Array.from({ length: 65 }, (_, index) => ({
  x: `${((index * 47 + 13) % 97) + 1}%`,
  y: `${((index * 31 + 7) % 88) + 2}%`,
  size: index % 7 === 0 ? 4 : index % 3 === 0 ? 3 : 2,
  opacity: index % 4 === 0 ? 0.8 : index % 3 === 0 ? 0.55 : 0.3,
  delay: `${(index % 9) * 0.45}s`,
}));


function CartoonBuddy({ animal, className = "" }) {
  const buddy = BUDDIES.find((item) => item.animal === animal) || BUDDIES[0];
  const { colour, belly, ears, muzzle } = buddy;

  return (
    <svg
      viewBox="0 0 220 240"
      role="img"
      aria-label={`Cute cartoon ${animal}`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="110" cy="222" rx="62" ry="9" fill="#004c46" opacity=".10" />

      <ellipse cx="110" cy="174" rx="61" ry="57" fill={colour} />

      <ellipse cx="77" cy="203" rx="23" ry="16" fill={colour} />
      <ellipse cx="143" cy="203" rx="23" ry="16" fill={colour} />

      <ellipse cx="110" cy="178" rx="39" ry="42" fill={belly} />

      {animal === "fox" && (
        <>
          <path d="M57 87 L44 25 Q43 15 54 22 L88 56 Z" fill={colour} stroke={ears} strokeWidth="3" strokeLinejoin="round" />
          <path d="M163 87 L176 25 Q177 15 166 22 L132 56 Z" fill={colour} stroke={ears} strokeWidth="3" strokeLinejoin="round" />
          <path d="M56 54 L52 34 L73 56 Z" fill="#f9d0b4" />
          <path d="M164 54 L168 34 L147 56 Z" fill="#f9d0b4" />
        </>
      )}

      {animal === "bunny" && (
        <>
          <path d="M77 75 Q51 7 75 9 Q98 10 98 76 Z" fill={colour} stroke={ears} strokeWidth="3" />
          <path d="M143 75 Q169 7 145 9 Q122 10 122 76 Z" fill={colour} stroke={ears} strokeWidth="3" />
          <path d="M79 59 Q67 22 77 22 Q89 24 91 62 Z" fill="#f7aebf" />
          <path d="M141 59 Q153 22 143 22 Q131 24 129 62 Z" fill="#f7aebf" />
        </>
      )}

      {animal === "badger" && (
        <>
          <path d="M62 78 Q39 38 63 38 Q82 39 84 70 Z" fill={colour} stroke={ears} strokeWidth="3" />
          <path d="M158 78 Q181 38 157 38 Q138 39 136 70 Z" fill={colour} stroke={ears} strokeWidth="3" />
          <path d="M106 53 Q110 43 114 53 L118 70 L102 70 Z" fill="#f8f3ed" />
        </>
      )}

      {animal === "dog" && (
        <>
          <path d="M65 61 Q28 40 43 88 Q49 111 76 96 Z" fill={ears} stroke="#8e6347" strokeWidth="3" />
          <path d="M155 61 Q192 40 177 88 Q171 111 144 96 Z" fill={ears} stroke="#8e6347" strokeWidth="3" />
          <path d="M54 69 Q44 57 47 77 Q51 89 64 89 Z" fill="#eac6a1" />
          <path d="M166 69 Q176 57 173 77 Q169 89 156 89 Z" fill="#eac6a1" />
        </>
      )}

      {animal === "otter" && (
        <>
          <ellipse cx="61" cy="75" rx="17" ry="20" fill={ears} stroke="#805844" strokeWidth="3" />
          <ellipse cx="159" cy="75" rx="17" ry="20" fill={ears} stroke="#805844" strokeWidth="3" />
          <ellipse cx="61" cy="76" rx="9" ry="12" fill="#f3c5a3" />
          <ellipse cx="159" cy="76" rx="9" ry="12" fill="#f3c5a3" />
        </>
      )}

      <ellipse cx="110" cy="105" rx="62" ry="60" fill={colour} stroke={ears} strokeWidth="3" />

      {animal === "badger" && (
        <>
          <path d="M100 49 L108 48 L110 91 L95 119 L83 117 L100 89 Z" fill="#f7f4f0" />
          <path d="M120 49 L112 48 L110 91 L125 119 L137 117 L120 89 Z" fill="#f7f4f0" />
        </>
      )}

      {animal === "fox" && (
        <path d="M65 91 Q110 126 155 91 L146 119 Q110 153 74 119 Z" fill="#fff3e7" />
      )}

      {animal === "dog" && (
        <>
          <ellipse cx="68" cy="105" rx="15" ry="25" fill={ears} opacity=".8" />
          <ellipse cx="152" cy="105" rx="15" ry="25" fill={ears} opacity=".8" />
        </>
      )}

      <ellipse cx="86" cy="105" rx="6" ry="8" fill="#45352f" />
      <ellipse cx="134" cy="105" rx="6" ry="8" fill="#45352f" />
      <circle cx="88" cy="102" r="2" fill="white" />
      <circle cx="136" cy="102" r="2" fill="white" />

      <ellipse cx="70" cy="123" rx="11" ry="6" fill="#f3a7ad" opacity=".65" />
      <ellipse cx="150" cy="123" rx="11" ry="6" fill="#f3a7ad" opacity=".65" />

      <ellipse cx="110" cy="126" rx="27" ry="19" fill={muzzle} />
      <path d="M105 121 Q110 116 115 121 Q115 127 110 128 Q105 127 105 121" fill="#59413c" />
      <path d="M110 128 Q109 136 101 135 M110 128 Q111 136 119 135" fill="none" stroke="#59413c" strokeWidth="2.5" strokeLinecap="round" />

      <ellipse cx="87" cy="181" rx="14" ry="8" fill="white" opacity=".7" />
      <ellipse cx="133" cy="181" rx="14" ry="8" fill="white" opacity=".7" />
    </svg>
  );
}

function BedroomScene({ foundItems, collectItem, onContinue }) {
  const [showHint, setShowHint] = useState(null);

  const items = [
    { id: "book", name: "Storybook", emoji: "📚", x: "7%", y: "34%", hint: "Try the bookshelf!" },
    { id: "pillow", name: "Pillow", emoji: "☁️", x: "18%", y: "72%", hint: "Look by the bed!" },
    { id: "teddy", name: "Teddy", emoji: "🧸", x: "72%", y: "61%", hint: "Peek in the toy box!" },
    { id: "blanket", name: "Blanket", emoji: "🧺", x: "80%", y: "78%", hint: "Check the laundry basket!" },
  ];

  return (
    <div className="relative isolate min-h-[480px] overflow-hidden rounded-[30px] border-4 border-white bg-[#f6e6d9] shadow-lg sm:min-h-[560px]">
      <div className="absolute inset-x-0 top-0 h-[57%] bg-gradient-to-b from-[#c9d9ef] to-[#f7e1e6]" />

      <div className="absolute left-[7%] top-[7%] h-[27%] w-[30%] rounded-t-full border-[7px] border-[#b88c79] bg-[#f8f0e8] shadow-inner sm:w-[25%]">
        <div className="absolute inset-2 rounded-t-full bg-gradient-to-b from-[#b9d9e8] to-[#e6e9f7]" />
        <div className="absolute bottom-0 left-1/2 top-2 w-1 -translate-x-1/2 bg-[#fff8f0]" />
        <div className="absolute bottom-0 left-2 right-2 h-1 bg-[#fff8f0]" />
        <span className="absolute right-[12%] top-[12%] text-xl">🌙</span>
      </div>

      <div className="absolute right-[7%] top-[9%] text-3xl text-white">✦</div>
      <div className="absolute left-[48%] top-[9%] text-xl text-white">✧</div>
      <div className="absolute right-[39%] top-[26%] text-lg text-white">✦</div>

      <div className="absolute right-[5%] top-[9%] h-[38%] w-[22%] rounded-t-xl border-[6px] border-[#ad816c] bg-[#f9f0e7] shadow-md sm:w-[19%]">
        <div className="absolute inset-2 flex flex-col justify-around rounded-sm bg-[#d7c0ad] p-2">
          <div className="flex h-3 items-center justify-center gap-1 rounded-sm bg-[#a6bca8] text-[8px]">📚📚</div>
          <div className="flex h-3 items-center justify-center gap-1 rounded-sm bg-[#e6c8b7] text-[8px]">📚📚</div>
          <div className="flex h-3 items-center justify-center gap-1 rounded-sm bg-[#c6c5df] text-[8px]">📚📚</div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-[46%] bg-[#d8b69e]" />
      <div className="absolute inset-x-0 bottom-[43%] h-3 bg-[#b98d79]" />

      <div className="absolute bottom-[18%] left-[23%] h-[28%] w-[53%] rounded-t-[25px] border-[7px] border-[#b68b77] bg-[#f5d9c7] shadow-lg">
        <div className="absolute inset-2 rounded-t-[18px] bg-[#f9e6e2]" />
        <div className="absolute -bottom-4 left-[-6px] right-[-6px] h-5 rounded-b-md bg-[#b68b77]" />
        <div className="absolute -bottom-10 left-3 h-10 w-4 rounded-b-md bg-[#9c7666]" />
        <div className="absolute -bottom-10 right-3 h-10 w-4 rounded-b-md bg-[#9c7666]" />
      </div>

      <div className="absolute bottom-[10%] left-[35%] h-[10%] w-[33%] rounded-full border-4 border-[#fff5e8] bg-[#d9c9d9] shadow-sm" />

      <div className="absolute bottom-[12%] right-[5%] h-[21%] w-[19%] rounded-t-xl border-4 border-[#ad816c] bg-[#d6a68c] shadow-md sm:w-[16%]">
        <div className="absolute inset-2 rounded-t-lg bg-[#edc3aa]" />
        <div className="absolute bottom-0 left-1/2 top-0 w-1 -translate-x-1/2 bg-[#ad816c]" />
      </div>

      <div className="absolute bottom-[13%] left-[5%] h-[19%] w-[17%] rounded-t-2xl border-4 border-[#ad816c] bg-[#c5a08a] shadow-md">
        <div className="absolute inset-2 rounded-t-xl bg-[#f3d9c2]" />
        <div className="absolute bottom-0 left-0 right-0 h-5 rounded-b-lg bg-[#b48b76]" />
      </div>

      {items.map((item) => {
        const found = foundItems.includes(item.id);

        return (
          <button
            key={item.id}
            type="button"
            disabled={found}
            onClick={() => {
              collectItem(item.id);
              setShowHint(item.name);
            }}
            onMouseEnter={() => setShowHint(item.name)}
            onMouseLeave={() => setShowHint(null)}
            aria-label={found ? `${item.name} found` : `Find ${item.name}`}
            className={`absolute z-20 flex h-12 w-12 items-center justify-center rounded-2xl border-2 text-2xl transition-all sm:h-14 sm:w-14 sm:text-3xl ${
              found
                ? "scale-75 border-white/50 bg-white/40 opacity-40"
                : "animate-[pulse_2s_ease-in-out_infinite] border-white bg-white shadow-lg hover:scale-110 hover:rotate-3"
            }`}
            style={{ left: item.x, top: item.y }}
          >
            {found ? <Check size={22} /> : item.emoji}
          </button>
        );
      })}

      {foundItems.length === items.length && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#25443e]/45 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-sm rounded-[28px] border-4 border-white bg-[#fffaf4] p-6 text-center shadow-2xl sm:p-8">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#e7f2ed] text-3xl">
              ✨
            </div>
            <h3 className="font-heading text-2xl font-bold">
              Room ready!
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#004c46]/70">
              You found every bedtime essential. Let's choose a lovely story!
            </p>
            <div className="my-4 flex justify-center gap-2">
              {items.map((item) => (
                <span key={item.id} className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e7f2ed] text-lg">
                  {item.emoji}
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={onContinue}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#00594f] px-5 py-3 text-sm font-bold text-white hover:bg-[#003f39]"
            >
              Choose a bedtime story
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      )}

      {showHint && foundItems.length < items.length && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 z-30 -translate-x-1/2 rounded-full bg-white/95 px-4 py-2 text-xs font-bold shadow-md">
          {items.find((item) => item.name === showHint)?.hint || "Well done!"}
        </div>
      )}

      <div className="absolute left-3 top-3 z-30 rounded-full bg-white/90 px-3 py-2 text-xs font-bold shadow-sm">
        Found {foundItems.length} / {items.length}
      </div>
    </div>
  );
}

export default function SleepoverGame() {
  const [step, setStep] = useState("choose");
  const [buddy, setBuddy] = useState(BUDDIES[0]);
  const [foundItems, setFoundItems] = useState([]);
  const [story, setStory] = useState(null);
  const [caughtStars, setCaughtStars] = useState([]);
  const [blanket, setBlanket] = useState(BLANKETS[0]);
  const [pillow, setPillow] = useState(PILLOWS[0]);
  const [accessory, setAccessory] = useState(ACCESSORIES[0]);
  const [completedGames, setCompletedGames] = useState(0);

  function collectItem(id) {
    setFoundItems((current) =>
      current.includes(id) ? current : [...current, id]
    );
  }

  function catchStar(index) {
    setCaughtStars((current) =>
      current.includes(index) ? current : [...current, index]
    );
  }

  function startSleepover() {
    setFoundItems([]);
    setCaughtStars([]);
    setStory(null);
    setStep("tidy");
  }

  function resetGame() {
    setStep("choose");
    setBuddy(BUDDIES[0]);
    setFoundItems([]);
    setCaughtStars([]);
    setStory(null);
    setBlanket(BLANKETS[0]);
    setPillow(PILLOWS[0]);
    setAccessory(ACCESSORIES[0]);
  }

  const progress = {
    choose: 0,
    tidy: 1,
    story: 2,
    stars: 3,
    bedtime: 4,
    finished: 5,
  }[step];

  return (
    <main className="min-h-screen bg-[#fff8f5] px-4 py-8 text-[#004c46] sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#004c46]/10 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] shadow-sm">
            <Moon size={15} />
            A cosy little adventure
          </div>
          <h1 className="font-heading text-4xl font-bold leading-tight sm:text-6xl">
            The Snuggle Sleepover
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#004c46]/75 sm:text-base">
            Find hidden bedtime things, catch magical stars and tuck your new
            cartoon buddy into bed.
          </p>
        </header>

        <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
          {["Choose buddy", "Find things", "Story time", "Catch stars", "Bedtime"].map((label, index) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                progress === index ? "bg-[#00594f] text-white" : progress > index ? "bg-[#c8e7d9] text-[#004c46]" : "bg-white text-[#004c46]/45"
              }`}>
                {progress > index ? <Check size={15} /> : index + 1}
              </div>
              <span className={`hidden text-xs font-bold sm:inline ${progress === index ? "text-[#004c46]" : "text-[#004c46]/50"}`}>
                {label}
              </span>
              {index < 4 && <div className="mx-1 h-px w-4 bg-[#004c46]/15 sm:w-6" />}
            </div>
          ))}
        </div>

        {step === "choose" && (
          <section>
            <div className="mb-6 text-center">
              <h2 className="font-heading text-2xl font-bold sm:text-3xl">Choose your sleepyhead</h2>
              <p className="mt-2 text-sm text-[#004c46]/70">Five new friends are ready for a sleepover.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {BUDDIES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setBuddy(item)}
                  aria-pressed={buddy.id === item.id}
                  className={`rounded-3xl border-2 bg-white p-3 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg sm:p-4 ${
                    buddy.id === item.id ? "border-[#00594f] ring-4 ring-[#c8e7d9]" : "border-transparent"
                  }`}
                >
                  <div className="rounded-2xl bg-[#f9e6e2] p-2">
                    <CartoonBuddy animal={item.animal} className="mx-auto w-full max-w-[150px]" />
                  </div>
                  <p className="mt-3 font-heading text-lg font-bold">{item.name}</p>
                  <p className="mt-1 text-xs text-[#004c46]/65">{item.description}</p>
                  {buddy.id === item.id && (
                    <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-[#e7f2ed] px-3 py-1 text-xs font-bold">
                      <Check size={13} /> Chosen
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <button onClick={startSleepover} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#00594f] px-7 py-3 text-sm font-bold text-white shadow-md hover:bg-[#003f39]">
                Let's get cosy <ArrowRight size={18} />
              </button>
            </div>
          </section>
        )}

        {step === "tidy" && (
          <section>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-heading text-2xl font-bold sm:text-3xl">A room full of secrets</h2>
                <p className="mt-2 text-sm text-[#004c46]/70">Explore the bedroom and find all four hidden essentials.</p>
              </div>
              <div className="rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm">
                {foundItems.length} / 4 found
              </div>
            </div>
            <BedroomScene
              foundItems={foundItems}
              collectItem={collectItem}
              onContinue={() => setStep("story")}
            />
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {ESSENTIALS.map((item) => (
                <div key={item.id} className={`flex items-center gap-3 rounded-2xl border bg-white p-3 ${
                  foundItems.includes(item.id) ? "border-[#a9d9c7]" : "border-[#004c46]/10"
                }`}>
                  <span className="text-2xl">{foundItems.includes(item.id) ? item.emoji : "🔎"}</span>
                  <div>
                    <p className="text-sm font-bold">{item.name}</p>
                    <p className="text-xs text-[#004c46]/60">{foundItems.includes(item.id) ? "Found!" : "Still hiding"}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {step === "story" && (
          <section className="mx-auto max-w-3xl">
            <div className="mb-6 text-center">
              <h2 className="font-heading text-2xl font-bold sm:text-3xl">Pick a bedtime story</h2>
              <p className="mt-2 text-sm text-[#004c46]/70">Choose where your buddy's dreams will take them.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {STORIES.map((item) => (
                <button key={item.id} onClick={() => setStory(item)} aria-pressed={story?.id === item.id}
                  className={`rounded-3xl border-2 p-5 text-left transition-all hover:-translate-y-1 hover:shadow-md ${
                    story?.id === item.id ? "border-[#00594f] ring-4 ring-[#c8e7d9]" : "border-transparent"
                  }`}
                  style={{ backgroundColor: item.colour }}>
                  <span className="mb-5 flex h-20 items-center justify-center rounded-2xl bg-white/70 text-5xl">{item.emoji}</span>
                  <h3 className="font-heading text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#004c46]/75">{item.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold">
                    {story?.id === item.id ? <><Check size={15} /> Selected</> : "Choose this story"}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <button disabled={!story} onClick={() => setStep("stars")} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#00594f] px-7 py-3 text-sm font-bold text-white hover:bg-[#003f39] disabled:opacity-40">
                Read the story <ArrowRight size={18} />
              </button>
            </div>
          </section>
        )}

        {step === "stars" && story && (
          <section className="mx-auto max-w-3xl overflow-hidden rounded-[32px] border border-[#004c46]/10 bg-white shadow-lg">
            <div className="relative min-h-[430px] overflow-hidden bg-gradient-to-b from-[#111a3d] via-[#303866] to-[#716b9f] p-6 text-center text-white sm:min-h-[470px]">
              {/* Soft moonlight */}
              <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-[#b9c9ff]/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 left-1/4 h-64 w-64 rounded-full bg-[#c4a6ee]/15 blur-3xl" />

              {/* Full background starfield */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {SKY_STARS.map((star, index) => (
                  <span
                    key={index}
                    className="absolute rounded-full bg-[#fff5cf] animate-[pulse_3s_ease-in-out_infinite]"
                    style={{
                      left: star.x,
                      top: star.y,
                      width: `${star.size}px`,
                      height: `${star.size}px`,
                      opacity: star.opacity,
                      animationDelay: star.delay,
                      boxShadow:
                        star.size === 4
                          ? "0 0 8px rgba(255,245,207,0.5)"
                          : "none",
                    }}
                  />
                ))}

                {/* Little constellation */}
                <svg
                  className="absolute left-[8%] top-[35%] h-20 w-24 opacity-30 sm:left-[12%]"
                  viewBox="0 0 100 80"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M10 18 L39 42 L70 12 L89 58"
                    stroke="#fff5cf"
                    strokeWidth="1"
                    strokeDasharray="3 5"
                  />
                  <circle cx="10" cy="18" r="2" fill="#fff5cf" />
                  <circle cx="39" cy="42" r="2" fill="#fff5cf" />
                  <circle cx="70" cy="12" r="2" fill="#fff5cf" />
                  <circle cx="89" cy="58" r="2" fill="#fff5cf" />
                </svg>

                {/* Shooting star */}
                <div className="absolute left-[-30%] top-[29%] h-px w-24 rotate-[-25deg] bg-gradient-to-r from-transparent via-white to-transparent opacity-70 animate-[shooting-star_7s_ease-in-out_infinite]" />
              </div>

              {/* Moon */}
              <span className="pointer-events-none absolute right-[9%] top-[8%] z-[1] text-4xl text-[#fff5cf] drop-shadow-[0_0_18px_rgba(255,245,207,0.45)]">
                ☾
              </span>

              {/* Buddy and story */}
              <div className="relative z-10 mx-auto w-28 rounded-full bg-white/10 p-1.5 backdrop-blur-sm sm:w-32">
                <CartoonBuddy animal={buddy.animal} className="w-full" />
              </div>

              <h2 className="relative z-10 mt-3 font-heading text-2xl font-bold sm:text-3xl">
                {story.title}
              </h2>

              <p className="relative z-10 mx-auto mt-2 max-w-md text-sm text-white/80">
                Five wishing stars are hiding in the night sky. Can you spot them all?
              </p>

              {/* Collectible stars */}
              {NIGHT_STARS.map((item, index) => {
                const caught = caughtStars.includes(index);

                return (
                  <button
                    key={index}
                    type="button"
                    disabled={caught}
                    onClick={() =>
                      setCaughtStars((current) =>
                        current.includes(index) ? current : [...current, index]
                      )
                    }
                    aria-label={`Catch hidden star ${index + 1}`}
                    className={`absolute z-20 flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                      caught
                        ? "scale-0 opacity-0"
                        : "text-[#f8eec1] hover:scale-110"
                    }`}
                    style={{
                      left: item.x,
                      top: item.y,
                      animation: caught
                        ? "none"
                        : `hidden-star-twinkle 3.5s ease-in-out ${item.delay} infinite`,
                    }}
                  >
                    <span
                      className="text-[22px] transition-all duration-300"
                      style={{
                        textShadow:
                          "0 0 3px rgba(255,245,207,0.5), 0 0 8px rgba(255,245,207,0.3)",
                      }}
                    >
                      ★
                    </span>
                  </button>
                );
              })}

              {/* Completion message */}
              {caughtStars.length === NIGHT_STARS.length && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#171d43]/90 p-5 backdrop-blur-md">
                  <div className="w-full max-w-sm rounded-[28px] border-4 border-white bg-[#fffaf4] p-6 text-center text-[#004c46] shadow-2xl">
                    <Sparkles className="mx-auto mb-3 text-[#d6a33b]" size={36} />

                    <h3 className="font-heading text-2xl font-bold">
                      You caught them all!
                    </h3>

                    <p className="mt-2 text-sm text-[#004c46]/70">
                      Five magical stars for {buddy.name}'s sweetest dreams.
                    </p>

                    <div className="my-4 flex justify-center gap-2">
                      {NIGHT_STARS.map((item, index) => (
                        <span
                          key={index}
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff0bd] text-[#b88924]"
                        >
                          <Star size={19} fill="currentColor" />
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep("bedtime")}
                      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#00594f] px-5 py-3 text-sm font-bold text-white hover:bg-[#003f39]"
                    >
                      Get ready for bed
                      <ArrowRight size={17} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Star collection progress */}
            <div className="flex items-center justify-between gap-3 p-5">
              <div>
                <p className="font-bold">Sleepy stars</p>
                <p className="text-xs text-[#004c46]/65">
                  {caughtStars.length} of 5 collected
                </p>
              </div>

              <div className="flex gap-1.5">
                {NIGHT_STARS.map((item, index) => (
                  <span
                    key={index}
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                      caughtStars.includes(index)
                        ? "bg-[#fff0bd] text-[#b88924]"
                        : "bg-[#e7f2ed] text-[#004c46]/25"
                    }`}
                  >
                    <Star
                      size={17}
                      fill={caughtStars.includes(index) ? "currentColor" : "none"}
                    />
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {step === "bedtime" && (
          <section>
            <div className="mb-6 text-center">
              <h2 className="font-heading text-2xl font-bold sm:text-3xl">Make the cosiest bed</h2>
              <p className="mt-2 text-sm text-[#004c46]/70">Choose a pillow, duvet and bedtime pal for {buddy.name}.</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
              <div className="relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-[32px] border-4 border-white bg-gradient-to-b from-[#26345e] via-[#7b7da9] to-[#e7cbd8] p-5 shadow-lg">
                <span className="absolute right-[12%] top-[8%] text-4xl text-[#fff5cf]">☾</span>
                <span className="absolute left-[14%] top-[14%] text-xl text-white">✦</span>
                <span className="absolute left-[38%] top-[8%] text-sm text-white">✧</span>
                <span className="absolute right-[27%] top-[31%] text-lg text-white">✦</span>

                <div className="relative mx-auto flex w-full max-w-sm flex-col items-center">
                  <div className="relative h-[310px] w-full overflow-hidden rounded-t-[42px] border-4 border-white/80 bg-[#f9e6e2]">
                    <div className="absolute inset-x-0 top-0 h-[72%] bg-gradient-to-b from-[#fffaf5] to-[#f4dbe2]" />

                    {/* Full-size pillow, behind the character */}
                    <div
                      className="absolute left-[6%] top-[7%] z-10 h-[35%] w-[68%] overflow-hidden rounded-[30px] border-4 border-white shadow-[0_5px_12px_rgba(0,0,0,0.12)]"
                      style={{ backgroundColor: pillow.colour }}
                    >
                      <div className="absolute inset-[5px] rounded-[23px] border-2 border-white/70" />
                      <div className="absolute inset-2 grid grid-cols-4 grid-rows-2 items-center justify-items-center gap-1">
                        {Array.from({ length: 8 }, (_, index) => (
                          <span
                            key={index}
                            className="text-xl opacity-80 sm:text-2xl"
                            aria-hidden="true"
                          >
                            {pillow.emoji}
                          </span>
                        ))}
                      </div>
                      <div className="absolute inset-x-5 top-1/2 h-px bg-white/40" />
                    </div>

                    {/* Buddy rests in front of the pillow */}
                    <div className="absolute bottom-0 left-[3%] z-20 w-[69%]">
                      <CartoonBuddy
                        animal={buddy.animal}
                        className="w-full drop-shadow-md"
                      />
                    </div>

                    {/* Duvet covers the lower part of the buddy */}
                    <div
                      className="absolute inset-x-0 bottom-0 z-30 h-[42%] overflow-hidden rounded-t-[35%] border-t-4 border-white/80 shadow-[0_-6px_12px_rgba(0,0,0,0.08)]"
                      style={{ backgroundColor: blanket.colour }}
                    >
                      <div className="absolute inset-2 rounded-t-[32%] border-t border-white/30" />

                      <div className="absolute inset-x-0 top-[18%] flex justify-around text-xl text-white/90">
                        <span>{blanket.pattern}</span>
                        <span>{blanket.pattern}</span>
                        <span>{blanket.pattern}</span>
                        <span>{blanket.pattern}</span>
                      </div>

                      <div className="absolute inset-x-0 bottom-[18%] flex justify-around text-xl text-white/90">
                        <span>{blanket.pattern}</span>
                        <span>{blanket.pattern}</span>
                        <span>{blanket.pattern}</span>
                        <span>{blanket.pattern}</span>
                      </div>
                    </div>

                    {/* Bedtime pal snuggles beside the buddy, on top of the duvet */}
                    <div className="absolute bottom-[13%] right-[9%] z-40 flex h-[66px] w-[66px] rotate-[-10deg] items-center justify-center rounded-full border-4 border-white/90 bg-white/40 text-4xl shadow-md sm:h-[76px] sm:w-[76px] sm:text-5xl">
                      {accessory.emoji}
                    </div>
                  </div>

                  <div className="h-5 w-full rounded-b-xl bg-[#b88b83]" />
                </div>
                <p className="mt-4 text-center text-sm font-bold text-white drop-shadow">Tucked in and cosy!</p>
              </div>

              <div className="space-y-5 rounded-3xl border border-[#004c46]/10 bg-white p-5 sm:p-6">
                <div>
                  <h3 className="mb-3 font-heading text-xl font-bold">Choose a duvet</h3>
                  <div className="grid grid-cols-2 gap-2">{BLANKETS.map((item) => <button key={item.name} onClick={() => setBlanket(item)} aria-pressed={blanket.name === item.name} className={`flex items-center gap-2 rounded-2xl border p-3 text-left text-xs font-bold ${blanket.name === item.name ? "border-[#00594f] bg-[#e7f2ed]" : "border-[#004c46]/10"}`}><span className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ backgroundColor: item.colour }}>{item.pattern}</span>{item.name}</button>)}</div>
                </div>
                <div>
                  <h3 className="mb-3 font-heading text-xl font-bold">Choose a pillow</h3>
                  <div className="grid grid-cols-2 gap-2">{PILLOWS.map((item) => <button key={item.name} onClick={() => setPillow(item)} aria-pressed={pillow.name === item.name} className={`flex items-center gap-2 rounded-2xl border p-3 text-left text-xs font-bold ${pillow.name === item.name ? "border-[#00594f] bg-[#e7f2ed]" : "border-[#004c46]/10"}`}><span className="flex h-8 w-8 items-center justify-center rounded-xl text-lg" style={{ backgroundColor: item.colour }}>{item.emoji}</span>{item.name}</button>)}</div>
                </div>
                <div>
                  <h3 className="mb-3 font-heading text-xl font-bold">Pick a bedtime pal</h3>
                  <div className="grid grid-cols-4 gap-2">{ACCESSORIES.map((item) => <button key={item.name} onClick={() => setAccessory(item)} aria-pressed={accessory.name === item.name} className={`flex flex-col items-center gap-1 rounded-2xl border p-2 ${accessory.name === item.name ? "border-[#00594f] bg-[#e7f2ed]" : "border-[#004c46]/10"}`}><span className="text-2xl">{item.emoji}</span><span className="text-center text-[10px] font-bold">{item.name}</span></button>)}</div>
                </div>
                <button onClick={() => { setCompletedGames((count) => count + 1); setStep("finished"); }} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#00594f] px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-[#003f39]">
                  Tuck them in <Moon size={17} />
                </button>
              </div>
            </div>
          </section>
        )}

        {step === "finished" && (
          <section className="relative mx-auto max-w-3xl overflow-hidden rounded-[32px] border-4 border-white bg-gradient-to-b from-[#c8d9ed] via-[#eee0f0] to-[#f9e6e2] p-5 shadow-xl sm:p-8">
            <div className="absolute right-[9%] top-[8%] text-4xl text-white">✦</div>
            <div className="absolute left-[8%] top-[20%] text-2xl text-white">✧</div>
            <div className="relative mx-auto max-w-lg text-center">
              <div className="mx-auto max-w-[240px]">
                <CartoonBuddy animal={buddy.animal} className="w-full drop-shadow-lg" />
              </div>
              <div className="mt-[-12px] rounded-[28px] border-4 border-white bg-[#fffaf4] p-6 shadow-2xl sm:p-8">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#fff0bd] text-[#b88924]"><Star size={28} fill="currentColor" /></div>
                <h2 className="font-heading text-3xl font-bold sm:text-4xl">Sweet dreams, {buddy.name}!</h2>
                <p className="mt-3 text-sm leading-relaxed text-[#004c46]/70">
                  You found all the bedtime essentials, chose {story?.title}, caught five stars and made the cosiest bed. {buddy.name} is ready for dreamland!
                </p>
                <div className="my-6 flex justify-center gap-3">
                  <div className="rounded-2xl bg-[#fff0bd] px-5 py-3"><Star className="mx-auto mb-1 text-[#b88924]" size={22} fill="currentColor" /><p className="text-xl font-bold">{foundItems.length + caughtStars.length}</p><p className="text-xs font-bold">Stars & finds</p></div>
                  <div className="rounded-2xl bg-[#e7f2ed] px-5 py-3"><Moon className="mx-auto mb-1" size={22} /><p className="text-xl font-bold">{completedGames}</p><p className="text-xs font-bold">Sleepovers</p></div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button onClick={resetGame} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#00594f] px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-[#003f39]"><RotateCcw size={17} /> Play again</button>
                  <button onClick={() => setStep("bedtime")} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border border-[#004c46]/20 bg-white px-5 py-3 text-sm font-bold hover:bg-[#e7f2ed]">Change the bed <ArrowRight size={17} /></button>
                </div>
              </div>
            </div>
          </section>
        )}

        <footer className="mt-10 text-center text-xs text-[#004c46]/50">
          Made for little imaginations and very big cuddles.
        </footer>
      </div>
    </main>
  );
}