
"use client";

import Link from "next/link";

const BUDDIES = [
  {
    id: "fox",
    name: "Fabian Fox",
    animal: "fox",
    colour: "#ed9b62",
    ears: "#bd6448",
    muzzle: "#fff5e9",
  },
  {
    id: "bunny",
    name: "Bella Bunny",
    animal: "bunny",
    colour: "#e9c6cf",
    ears: "#d991a9",
    muzzle: "#fff7f3",
  },
  {
    id: "badger",
    name: "Brooke Badger",
    animal: "badger",
    colour: "#9295a5",
    ears: "#666b80",
    muzzle: "#f7f2ed",
  },
];

function BuddyHead({ animal, className = "" }) {
  const buddy =
    BUDDIES.find((item) => item.animal === animal) || BUDDIES[0];

  return (
    <svg
      viewBox="0 0 220 170"
      role="img"
      aria-label={buddy.name}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {animal === "fox" && (
        <>
          <path
            d="M54 78 L39 12 Q37 4 47 10 L91 48 Z"
            fill={buddy.colour}
            stroke={buddy.ears}
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d="M166 78 L181 12 Q183 4 173 10 L129 48 Z"
            fill={buddy.colour}
            stroke={buddy.ears}
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path d="M53 48 L47 22 L76 49 Z" fill="#f9d0b4" />
          <path d="M167 48 L173 22 L144 49 Z" fill="#f9d0b4" />
        </>
      )}

      {animal === "bunny" && (
        <>
          <path
            d="M70 76 Q40 -15 69 4 Q96 8 99 75 Z"
            fill={buddy.colour}
            stroke={buddy.ears}
            strokeWidth="4"
          />
          <path
            d="M150 76 Q180 -15 151 4 Q124 8 121 75 Z"
            fill={buddy.colour}
            stroke={buddy.ears}
            strokeWidth="4"
          />
          <path d="M72 54 Q56 12 69 17 Q85 21 91 60 Z" fill="#f7aebf" />
          <path d="M148 54 Q164 12 151 17 Q135 21 129 60 Z" fill="#f7aebf" />
        </>
      )}

      {animal === "badger" && (
        <>
          <path
            d="M60 75 Q36 35 61 34 Q83 35 87 69 Z"
            fill={buddy.colour}
            stroke={buddy.ears}
            strokeWidth="4"
          />
          <path
            d="M160 75 Q184 35 159 34 Q137 35 133 69 Z"
            fill={buddy.colour}
            stroke={buddy.ears}
            strokeWidth="4"
          />
        </>
      )}

      <ellipse
        cx="110"
        cy="99"
        rx="68"
        ry="65"
        fill={buddy.colour}
        stroke={buddy.ears}
        strokeWidth="4"
      />

      {animal === "badger" && (
        <>
          <path
            d="M99 40 L108 37 L110 88 L91 117 L80 112 L100 83 Z"
            fill="#f7f4f0"
          />
          <path
            d="M121 40 L112 37 L110 88 L129 117 L140 112 L120 83 Z"
            fill="#f7f4f0"
          />
        </>
      )}

      {animal === "fox" && (
        <path
          d="M59 87 Q110 124 161 87 L151 119 Q110 151 69 119 Z"
          fill="#fff3e7"
        />
      )}

      <ellipse cx="85" cy="94" rx="7" ry="9" fill="#45352f" />
      <ellipse cx="135" cy="94" rx="7" ry="9" fill="#45352f" />
      <circle cx="87" cy="91" r="2.5" fill="white" />
      <circle cx="137" cy="91" r="2.5" fill="white" />

      <ellipse cx="67" cy="113" rx="12" ry="7" fill="#f3a7ad" opacity=".7" />
      <ellipse cx="153" cy="113" rx="12" ry="7" fill="#f3a7ad" opacity=".7" />

      <ellipse cx="110" cy="119" rx="29" ry="20" fill={buddy.muzzle} />
      <ellipse cx="110" cy="113" rx="6" ry="4.5" fill="#59413c" />

      <path
        d="M110 117 Q109 127 100 126 M110 117 Q111 127 120 126"
        fill="none"
        stroke="#59413c"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      <path
        d="M99 137 Q110 145 121 137"
        fill="none"
        stroke="#59413c"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Pillow({ className = "", colour = "#fff5f8" }) {
  return (
    <div
      aria-hidden="true"
      className={`dream-pillow absolute rounded-[45%] border-[3px] border-white/90 shadow-[0_4px_10px_rgba(105,79,100,0.10)] ${className}`}
      style={{ backgroundColor: colour }}
    >
      <div className="absolute inset-2 rounded-[45%] border border-white/70" />
    </div>
  );
}

export default function NotFound() {
  return (
    <main className="dream-page relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#f9f0f3] px-4 py-4 text-[#315b53] sm:px-6">
      {/* Dreamy background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[72%] bg-gradient-to-b from-[#dce9f5] via-[#f2e4ef] to-[#f9f0f3]" />

        <div className="dream-moon absolute right-[8%] top-[5%] flex h-12 w-12 items-center justify-center rounded-full bg-[#fff0bf] text-2xl shadow-[0_0_35px_rgba(255,228,156,0.55)] sm:right-[13%] sm:top-[7%] sm:h-16 sm:w-16 sm:text-3xl">
          ☾
        </div>

        <div className="dream-cloud cloud-left absolute left-[-25px] top-[17%] text-5xl opacity-70 sm:left-[6%] sm:text-7xl">
          ☁
        </div>

        <div className="dream-cloud cloud-right absolute right-[-25px] top-[28%] text-5xl opacity-60 sm:right-[6%] sm:text-7xl">
          ☁
        </div>

        {[
          ["12%", "24%", "✦"],
          ["25%", "12%", "✧"],
          ["39%", "28%", "✦"],
          ["63%", "16%", "✧"],
          ["82%", "22%", "✦"],
          ["91%", "40%", "✧"],
          ["7%", "42%", "✦"],
        ].map(([left, top, star], index) => (
          <span
            key={index}
            className="dream-star absolute text-sm text-white sm:text-lg"
            style={{ left, top, animationDelay: `${index * 0.4}s` }}
          >
            {star}
          </span>
        ))}

        <div className="absolute -bottom-24 -left-[15%] h-40 w-[80%] rounded-[50%] bg-[#d9e8dc] sm:h-52" />
        <div className="absolute -bottom-28 -right-[15%] h-44 w-[85%] rounded-[50%] bg-[#c9dfd0] sm:h-56" />
      </div>

      {/* Compact heading */}
      <header className="relative z-10 mx-auto w-full max-w-3xl text-center">
        <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/70 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#64867d] shadow-sm backdrop-blur sm:text-[10px]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#e9a8bd]" />
          A little detour into dreamland
        </div>

        <h1 className="font-heading text-[4.5rem] font-bold leading-[0.85] tracking-[-0.08em] text-[#315b53] sm:text-[6rem] md:text-[7rem]">
          4<span className="dream-zero inline-block text-[#d9a1bd]">0</span>4
        </h1>

        <h2 className="mx-auto mt-2 font-heading text-xl font-bold leading-tight text-[#315b53] sm:text-2xl md:text-3xl">
          This page seems to be in{" "}
          <span className="text-[#c38cad]">dreamland.</span>
        </h2>

        <p className="mx-auto mt-1.5 max-w-md text-xs leading-5 text-[#648078] sm:text-sm">
          This page has dozed off. Fabian, Bella and Brooke are helping us find
          the way home.
        </p>
      </header>

      {/* Bedtime scene */}
      <section
        aria-label="Fabian Fox, Bella Bunny and Brooke Badger tucked into bed"
        className="relative z-10 mx-auto mt-3 w-full max-w-xl sm:mt-4"
      >
        <span className="dream-heart absolute left-[7%] top-[12%] z-30 text-xl text-[#d9a1bd] sm:text-2xl">
          ♡
        </span>
        <span className="dream-heart heart-two absolute right-[7%] top-[18%] z-30 text-xl text-[#d9a1bd] sm:text-2xl">
          ♡
        </span>
        <span className="dream-star absolute left-[22%] top-[3%] z-30 text-sm text-[#e6bf68]">
          ✦
        </span>
        <span className="dream-star absolute right-[22%] top-[4%] z-30 text-sm text-[#e6bf68]">
          ✧
        </span>

        {/* Bed and headboard */}
        <div className="relative mx-auto mt-5 w-[94%] sm:mt-6">
          {/* Bed legs */}
          <div className="absolute -bottom-3 left-[5%] right-[5%] h-4 rounded-b-xl bg-[#a97769] shadow-sm" />
          <div className="absolute -bottom-7 left-[12%] h-6 w-3 rounded-b-md bg-[#a97769] sm:-bottom-8 sm:h-7" />
          <div className="absolute -bottom-7 right-[12%] h-6 w-3 rounded-b-md bg-[#a97769] sm:-bottom-8 sm:h-7" />

          {/* Headboard */}
          <div className="relative z-10 h-32 rounded-t-[38px] border-[5px] border-[#fffaf4] bg-[#e6c2b5] shadow-[0_6px_14px_rgba(113,83,85,0.12)] sm:h-40 sm:rounded-t-[48px] sm:border-[7px]">
            <div className="absolute inset-2 rounded-t-[28px] border border-white/40 sm:rounded-t-[38px]" />
            <div className="absolute inset-x-[12%] top-[25%] h-px bg-white/50" />
            <div className="absolute inset-x-[12%] top-[55%] h-px bg-white/40" />

            <Pillow
              colour="#fff3f5"
              className="left-[5%] top-[38%] h-[52%] w-[35%] -rotate-6"
            />
            <Pillow
              colour="#f9eaf1"
              className="left-[32%] top-[34%] h-[56%] w-[36%] rotate-2"
            />
            <Pillow
              colour="#f0eaf8"
              className="right-[5%] top-[38%] h-[52%] w-[35%] rotate-6"
            />

            {/* Heads sit naturally against the pillows */}
            <div className="absolute inset-x-[5%] bottom-[-10px] flex items-end justify-center sm:bottom-[-14px]">
              <div className="dream-head buddy-fox relative z-10 w-[30%] max-w-[145px]">
                <BuddyHead animal="fox" className="w-full drop-shadow-sm" />
              </div>

              <div className="dream-head buddy-bunny relative z-20 -mx-[2%] w-[34%] max-w-[165px]">
                <BuddyHead animal="bunny" className="w-full drop-shadow-sm" />
              </div>

              <div className="dream-head buddy-badger relative z-10 w-[30%] max-w-[145px]">
                <BuddyHead animal="badger" className="w-full drop-shadow-sm" />
              </div>
            </div>
          </div>

          {/* Duvet: in front of the lower part of the characters */}
          <div className="dream-duvet relative z-20 -mt-8 h-[76px] rounded-[45%_45%_18px_18px/42%_42%_18px_18px] border-[5px] border-white bg-[#fffaf5] shadow-[0_8px_14px_rgba(116,94,104,0.12)] sm:h-[94px] sm:border-[7px]">
            <div className="absolute inset-x-[4%] top-2 h-[65%] rounded-[45%] border-b border-[#f0dce7]" />

            {/* Subtle stitched detail, not pillow shapes */}
            <div className="absolute inset-x-[12%] top-[35%] flex justify-around text-xs text-[#d7b2c9] sm:text-sm">
              <span>✦</span>
              <span>♡</span>
              <span>✧</span>
              <span>♡</span>
              <span>✦</span>
            </div>
          </div>
        </div>
      </section>

      {/* Compact navigation */}
      <nav className="relative z-10 mt-8 flex w-full flex-col items-center justify-center gap-2 sm:mt-9 sm:flex-row">
        <Link
          href="/"
          className="inline-flex min-h-10 w-full max-w-[220px] items-center justify-center gap-2 rounded-full bg-[#427c6c] px-6 py-2.5 text-xs font-bold text-white shadow-[0_3px_0_#315b53] transition-all hover:-translate-y-0.5 hover:bg-[#356d5e] active:translate-y-0.5 active:shadow-none sm:w-auto"
        >
          <span>🏡</span>
          Take me home
        </Link>

        <Link
          href="/buddies"
          className="inline-flex min-h-10 w-full max-w-[220px] items-center justify-center gap-2 rounded-full border-2 border-white bg-white/75 px-6 py-2 text-xs font-bold text-[#52796f] shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white sm:w-auto"
        >
          <span>💗</span>
          Meet the buddies
        </Link>
      </nav>

      <style jsx>{`
        .dream-star {
          animation: twinkle 3s ease-in-out infinite;
        }

        .dream-heart {
          animation: heartFloat 4s ease-in-out infinite;
        }

        .heart-two {
          animation-delay: -2s;
        }

        .dream-cloud {
          animation: cloudFloat 12s ease-in-out infinite alternate;
        }

        .cloud-right {
          animation-delay: -5s;
          animation-duration: 15s;
        }

        .dream-moon {
          animation: moonGlow 5s ease-in-out infinite;
        }

        .dream-zero {
          animation: zeroWobble 4s ease-in-out infinite;
        }

        .dream-head {
          transform-origin: center bottom;
          animation: sleepyPeek 4s ease-in-out infinite;
        }

        .buddy-fox {
          animation-delay: -1s;
        }

        .buddy-bunny {
          animation-delay: -2.2s;
        }

        .buddy-badger {
          animation-delay: -0.4s;
        }

        .dream-duvet {
          animation: duvetBreath 4.5s ease-in-out infinite;
          transform-origin: center top;
        }

        .dream-pillow {
          transform-origin: center;
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.45;
            transform: scale(0.85) rotate(-8deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.15) rotate(10deg);
          }
        }

        @keyframes heartFloat {
          0%, 100% {
            transform: translateY(0) rotate(-8deg);
          }
          50% {
            transform: translateY(-6px) rotate(8deg);
          }
        }

        @keyframes cloudFloat {
          from {
            transform: translate3d(-5px, 0, 0);
          }
          to {
            transform: translate3d(8px, 4px, 0);
          }
        }

        @keyframes moonGlow {
          0%, 100% {
            box-shadow: 0 0 25px rgba(255, 228, 156, 0.35);
          }
          50% {
            box-shadow: 0 0 45px rgba(255, 228, 156, 0.7);
          }
        }

        @keyframes zeroWobble {
          0%, 100% {
            transform: translateY(0) rotate(-3deg);
          }
          50% {
            transform: translateY(-4px) rotate(3deg);
          }
        }

        @keyframes sleepyPeek {
          0%, 100% {
            translate: 0 2px;
            rotate: -0.5deg;
          }
          50% {
            translate: 0 -3px;
            rotate: 0.5deg;
          }
        }

        @keyframes duvetBreath {
          0%, 100% {
            scale: 1 1;
          }
          50% {
            scale: 1 1.015;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .dream-star,
          .dream-heart,
          .dream-cloud,
          .dream-moon,
          .dream-zero,
          .dream-head,
          .dream-duvet {
            animation: none !important;
          }
        }
      `}</style>
    </main>
  );
}
