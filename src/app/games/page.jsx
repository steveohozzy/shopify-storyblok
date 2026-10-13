
"use client";

import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Moon,
  Gamepad2,
  Heart,
  Star,
} from "lucide-react";

const games = [
  {
    title: "Dream Journey",
    subtitle: "A magical platform adventure",
    description:
      "Jump between floating islands, dodge dream sparks and collect shiny treasures with your favourite buddy.",
    href: "/games/dream-journey",
    action: "Explore the dream worlds",
    emoji: "☁️",
    decoration: "🌈",
    background: "from-[#dcdcff] via-[#e9e4ff] to-[#f8eaff]",
    accent: "#6254a4",
    tag: "ADVENTURE",
  },
  {
    title: "The Snuggle Sleepover",
    subtitle: "The cosiest night in",
    description:
      "Find hidden bedtime treasures, discover a lovely story and make the perfect cosy space for your buddy.",
    href: "/games/snuggle-sleepover",
    action: "Start your sleepover",
    emoji: "🧸",
    decoration: "🌙",
    background: "from-[#ffe0ed] via-[#ffedf2] to-[#fff2e5]",
    accent: "#a84f7c",
    tag: "COSY & CREATIVE",
  },
];

export default function GamesPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fffaf7] text-[#403451]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-40 h-72 w-72 rounded-full bg-[#f7dff0] opacity-50 blur-3xl" />
        <div className="absolute -right-32 top-96 h-80 w-80 rounded-full bg-[#dce9ff] opacity-60 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-6 sm:px-8 sm:pt-9">
        <header className="flex items-center justify-between">
          <Link href="/games" className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4e4f6] text-2xl">
              🧸
            </span>
            <span>
              <span className="block font-heading text-xl font-bold">
                Snuggle Buddies
              </span>
              <span className="text-xs font-medium tracking-widest text-[#9883a5]">
                THE PLAYROOM
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-2 rounded-full border border-white bg-white/80 px-4 py-2 text-sm font-semibold shadow-sm sm:flex">
            <Sparkles size={16} className="text-[#b78bc9]" />
            A little world of wonder
          </div>
        </header>

        <section className="relative mx-auto max-w-4xl pb-10 pt-16 text-center sm:pb-14 sm:pt-24">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#eadff0] bg-white/90 px-4 py-2 text-xs font-bold tracking-wider text-[#8d6c9d] shadow-sm">
            <Star size={14} fill="currentColor" />
            LITTLE ADVENTURES, BIG IMAGINATIONS
          </div>

          <h1 className="font-heading text-5xl font-bold leading-[1.08] tracking-tight sm:text-7xl">
            Welcome to your
            <span className="mt-2 block bg-gradient-to-r from-[#bd7da8] via-[#917dce] to-[#669dc6] bg-clip-text pb-2 text-transparent">
              happy place.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#776982] sm:text-lg sm:leading-8">
            Magical worlds, cosy sleepovers and the sweetest little friends.
            Pick an adventure and let your imagination do the rest.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a
              href="#choose-adventure"
              className="inline-flex items-center gap-2 rounded-full bg-[#65558f] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#65558f]/20 transition hover:-translate-y-0.5 hover:bg-[#514276]"
            >
              Choose your adventure <ArrowRight size={17} />
            </a>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#eee4ee] bg-white/80 px-5 py-3.5 text-sm font-semibold text-[#81718d]">
              <Heart size={16} className="text-[#db8cb0]" />
              Made for dreamers
            </span>
          </div>

          <div className="pointer-events-none absolute left-0 top-16 hidden text-4xl opacity-70 sm:block">
            ✦
          </div>
          <div className="pointer-events-none absolute right-2 top-28 hidden text-3xl text-[#e5b6d2] sm:block">
            ♡
          </div>
        </section>

        <section id="choose-adventure" className="scroll-mt-8">
          <div className="mb-7 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-bold tracking-[0.2em] text-[#b17eaa]">
                YOUR NEXT LITTLE ADVENTURE
              </p>
              <h2 className="font-heading text-3xl font-bold sm:text-4xl">
                What shall we play?
              </h2>
            </div>
            <p className="text-sm text-[#8c7e94]">
              Two lovely games to explore ✨
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {games.map((game) => (
              <article
                key={game.title}
                className="group overflow-hidden rounded-[30px] border border-white bg-white shadow-[0_12px_45px_rgba(85,60,100,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(85,60,100,0.12)]"
              >
                <div
                  className={`relative flex h-56 items-center justify-center overflow-hidden bg-gradient-to-br ${game.background} sm:h-64`}
                >
                  <span className="absolute left-7 top-7 text-2xl text-white/90">
                    ✦
                  </span>
                  <span className="absolute right-9 top-10 text-xl text-white/90">
                    ✧
                  </span>
                  <span className="absolute bottom-8 left-12 text-3xl">
                    {game.decoration}
                  </span>
                  <span className="absolute bottom-8 right-12 text-2xl">
                    ✨
                  </span>
                  <div className="relative flex h-36 w-36 items-center justify-center rounded-full border border-white/80 bg-white/55 text-7xl shadow-lg shadow-[#7d6b99]/10 transition duration-500 group-hover:scale-110 sm:h-40 sm:w-40 sm:text-8xl">
                    {game.emoji}
                  </div>
                  <span className="absolute left-5 top-5 rounded-full border border-white/70 bg-white/80 px-3 py-1.5 text-[10px] font-bold tracking-widest text-[#786486]">
                    {game.tag}
                  </span>
                </div>

                <div className="p-6 sm:p-8">
                  <p
                    className="mb-2 text-xs font-bold uppercase tracking-wider"
                    style={{ color: game.accent }}
                  >
                    {game.subtitle}
                  </p>
                  <h3 className="font-heading text-2xl font-bold sm:text-3xl">
                    {game.title}
                  </h3>
                  <p className="mt-3 min-h-[72px] text-sm leading-6 text-[#81758a]">
                    {game.description}
                  </p>
                  <Link
                    href={game.href}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-bold text-white transition hover:brightness-95"
                    style={{ backgroundColor: game.accent }}
                  >
                    {game.action}
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-[30px] border border-[#d9eee3] bg-gradient-to-r from-[#e5f8ed] via-[#edf8f4] to-[#e9efff] p-6 sm:p-9">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-9">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-4 border-white/80 bg-white/65 text-6xl shadow-sm">
              🐰
            </div>
            <div className="flex-1 text-center sm:text-left">
              <span className="mb-2 inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#538c78]">
                <Heart size={14} fill="currentColor" />
                SOMETHING SPECIAL IS GROWING
              </span>
              <h2 className="font-heading text-2xl font-bold sm:text-3xl">
                Which Snuggle Buddy are you?
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#628477]">
                Are you a curious explorer, a gentle dreamer or the life of
                every sleepover? Take our upcoming personality quiz to find
                the cuddly companion that matches you.
              </p>
              <Link
                  href="/games/which-snuggle-buddy"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#56816f] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#3f6d5b]"
                >
                  Discover your buddy
                  <ArrowRight size={16} />
                </Link>
            </div>
          </div>
        </section>

        <footer className="mt-14 border-t border-[#eee5ee] pt-7 text-center">
          <div className="mb-3 flex justify-center gap-3 text-xl">
            <span>🦊</span>
            <span>🐰</span>
            <span>🦡</span>
            <span>🐶</span>
            <span>🦦</span>
          </div>
          <p className="font-heading text-lg font-bold">
            Every buddy has a little magic.
          </p>
          <p className="mt-2 text-xs text-[#a194a8]">
            Made with love, stardust and lots of cuddles.
          </p>
        </footer>
      </div>
    </main>
  );
}
