
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Home, RotateCcw, Star, Trophy, Volume2, VolumeX } from "lucide-react";

const BUDDIES = [
  { id: "fox", name: "Fabian Fox", animal: "fox", colour: "#ed9b62", belly: "#fff0dc", ears: "#bd6448", muzzle: "#fff5e9", description: "A curious little dreamer." },
  { id: "bunny", name: "Bella Bunny", animal: "bunny", colour: "#e9c6cf", belly: "#fff1ed", ears: "#d991a9", muzzle: "#fff7f3", description: "A soft and sleepy sweetheart." },
  { id: "badger", name: "Brooke Badger", animal: "badger", colour: "#9295a5", belly: "#e7e7ee", ears: "#666b80", muzzle: "#f7f2ed", description: "A gentle little explorer." },
  { id: "dog", name: "Dottie Dog", animal: "dog", colour: "#d8ad7b", belly: "#fff0d8", ears: "#a87550", muzzle: "#fff4e8", description: "Your very best bedtime friend." },
  { id: "otter", name: "Oakley Otter", animal: "otter", colour: "#ad8069", belly: "#f5dfc9", ears: "#805844", muzzle: "#f9eadb", description: "A cuddly, cosy adventurer." },
];

const LEVELS = [
  { name: "Cloudy Heights", subtitle: "A gentle first dream", sky: "#9ecbff", horizon: "#fbe0f0", platform: "#fff8ff", edge: "#e8bce8", accent: "#ffdb75", width: 2200, platforms: [
    [0, 365, 320],
    [350, 320, 165],
    [545, 280, 165],
    [740, 320, 165],
    [935, 270, 175],
    [1140, 315, 170],
    [1340, 265, 175],
    [1545, 315, 175],
    [1750, 275, 180],
    [1960, 340, 300]
  ], hazards: [] },
  { name: "Moonlight Forest", subtitle: "Follow the glowing mushrooms", sky: "#172b61", horizon: "#40518c", platform: "#8de0c0", edge: "#39a990", accent: "#ffe89b", width: 2350, platforms: [[0,365,260],[330,320,140],[535,265,135],[740,315,145],[955,245,135],[1155,290,145],[1370,225,140],[1580,300,150],[1800,245,140],[2015,340,300]], stars: [[190,315],[365,270],[575,215],[780,265],[995,195],[1190,240],[1410,175],[1620,250],[1840,195],[2050,290]], hazards: [[630,390,50,35],[1260,390,55,35],[1700,390,55,35]] },
  { name: "Candy Clouds", subtitle: "A sweet and bouncy dream", sky: "#ffcae0", horizon: "#ffebf4", platform: "#fff6fb", edge: "#ff9fc7", accent: "#ffca54", width: 2450, platforms: [[0,365,250],[320,300,130],[510,245,130],[710,300,125],[900,220,135],[1105,275,130],[1305,210,125],[1500,275,135],[1705,220,135],[1915,295,130],[2110,350,280]], stars: [
    [230, 315],
    [405, 270],
    [600, 230],
    [795, 270],
    [1000, 220],
    [1205, 265],
    [1405, 215],
    [1610, 265],
    [1820, 225],
    [2040, 290]
  ] },
  { name: "Floating Islands", subtitle: "Mind the gaps between islands", sky: "#8dd8ff", horizon: "#e4f7ff", platform: "#a6e7a5", edge: "#56b77e", accent: "#fff0a8", width: 2550, platforms: [[0,365,240],[305,300,115],[485,235,115],[665,290,115],[845,215,115],[1025,275,115],[1205,195,115],[1385,260,115],[1565,185,115],[1745,260,115],[1930,210,115],[2110,295,120],[2310,350,240]], stars: [[150,315],[330,255],[510,190],[690,245],[870,170],[1050,230],[1230,150],[1410,215],[1590,140],[1770,215],[1955,165],[2150,250],[2360,305]], hazards: [[550,390,40,35],[1090,390,45,35],[1630,390,45,35],[2020,390,45,35]] },
  { name: "The Dream Castle", subtitle: "One last leap to the dream portal!", sky: "#302b75", horizon: "#a58bdc", platform: "#e9d7ff", edge: "#b69bea", accent: "#fff0a1", width: 2700, platforms: [[0,365,230],[290,315,115],[465,260,110],[640,305,110],[815,235,110],[990,280,110],[1165,210,110],[1340,270,110],[1515,200,110],[1690,255,110],[1865,190,110],[2040,250,110],[2220,300,120],[2430,350,240]], stars: [[135,315],[310,270],[485,215],[660,260],[835,190],[1010,235],[1185,165],[1360,225],[1535,155],[1710,210],[1885,145],[2060,205],[2245,255],[2470,305]], hazards: [[530,390,40,35],[1050,390,45,35],[1570,390,45,35],[2100,390,45,35]] },
];

// Add extra platform sections so every dream has a longer second half.
LEVELS.forEach((level, levelIndex) => {
  const originalWidth = level.width;
  const extraPlatforms = [];
  const extraStars = [];
  const extraHazards = [];

  for (let i = 0; i < 6 + levelIndex; i += 1) {
    const x = originalWidth + 105 + i * 205;
    const y = [305, 250, 320, 225, 285, 240, 300, 215, 275, 235, 310][(i + levelIndex) % 11];
    const width = levelIndex < 2 ? 135 : 112;

    extraPlatforms.push([x, y, width]);
    extraStars.push([x + width / 2, y - 48]);

    if (i % 2 === 1 || levelIndex > 2 && i % 2 === 0) {
      extraHazards.push([x + width * 0.55, y - 25, 30, 24]);
    }
  }

  const finishX = originalWidth + (6 + levelIndex) * 205 + 145;

  if (levelIndex >= 2) {
    extraPlatforms.push([finishX - 120, 300, 120]);
    extraStars.push([finishX - 60, 255]);
  }

  extraPlatforms.push([finishX, 350, 250]);
  extraStars.push([finishX + 70, 300], [finishX + 175, 300]);

  level.platforms = (level.platforms || []).concat(extraPlatforms);
  level.stars = (level.stars || []).concat(extraStars);
  level.hazards = (level.hazards || []).concat(extraHazards);
  level.width = finishX + 250;
  level.gems = [
    [originalWidth + 105 + 2 * 205 + 55, 195],
    [originalWidth + 105 + 5 * 205 + 45, 175],
    [finishX + 125, 290],
  ];
});

function CartoonBuddy({ animal, className = "" }) {
  const buddy = BUDDIES.find((item) => item.animal === animal) || BUDDIES[0];
  const { colour, belly, ears, muzzle } = buddy;

  return (
    <svg viewBox="0 0 220 240" role="img" aria-label={`Cute cartoon ${animal}`} className={className} xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="110" cy="222" rx="62" ry="9" fill="#004c46" opacity=".10" />
      <ellipse cx="110" cy="174" rx="61" ry="57" fill={colour} />
      <ellipse cx="77" cy="203" rx="23" ry="16" fill={colour} />
      <ellipse cx="143" cy="203" rx="23" ry="16" fill={colour} />
      <ellipse cx="110" cy="178" rx="39" ry="42" fill={belly} />
      {animal === "fox" && <><path d="M57 87 L44 25 Q43 15 54 22 L88 56 Z" fill={colour} stroke={ears} strokeWidth="3" strokeLinejoin="round"/><path d="M163 87 L176 25 Q177 15 166 22 L132 56 Z" fill={colour} stroke={ears} strokeWidth="3" strokeLinejoin="round"/><path d="M56 54 L52 34 L73 56 Z" fill="#f9d0b4"/><path d="M164 54 L168 34 L147 56 Z" fill="#f9d0b4"/></>}
      {animal === "bunny" && <><path d="M77 75 Q51 7 75 9 Q98 10 98 76 Z" fill={colour} stroke={ears} strokeWidth="3"/><path d="M143 75 Q169 7 145 9 Q122 10 122 76 Z" fill={colour} stroke={ears} strokeWidth="3"/><path d="M79 59 Q67 22 77 22 Q89 24 91 62 Z" fill="#f7aebf"/><path d="M141 59 Q153 22 143 22 Q131 24 129 62 Z" fill="#f7aebf"/></>}
      {animal === "badger" && <><path d="M62 78 Q39 38 63 38 Q82 39 84 70 Z" fill={colour} stroke={ears} strokeWidth="3"/><path d="M158 78 Q181 38 157 38 Q138 39 136 70 Z" fill={colour} stroke={ears} strokeWidth="3"/><path d="M106 53 Q110 43 114 53 L118 70 L102 70 Z" fill="#f8f3ed"/></>}
      {animal === "dog" && <><path d="M65 61 Q28 40 43 88 Q49 111 76 96 Z" fill={ears} stroke="#8e6347" strokeWidth="3"/><path d="M155 61 Q192 40 177 88 Q171 111 144 96 Z" fill={ears} stroke="#8e6347" strokeWidth="3"/><path d="M54 69 Q44 57 47 77 Q51 89 64 89 Z" fill="#eac6a1"/><path d="M166 69 Q176 57 173 77 Q169 89 156 89 Z" fill="#eac6a1"/></>}
      {animal === "otter" && <><ellipse cx="61" cy="75" rx="17" ry="20" fill={ears} stroke="#805844" strokeWidth="3"/><ellipse cx="159" cy="75" rx="17" ry="20" fill={ears} stroke="#805844" strokeWidth="3"/><ellipse cx="61" cy="76" rx="9" ry="12" fill="#f3c5a3"/><ellipse cx="159" cy="76" rx="9" ry="12" fill="#f3c5a3"/></>}
      <ellipse cx="110" cy="105" rx="62" ry="60" fill={colour} stroke={ears} strokeWidth="3" />
      {animal === "badger" && <><path d="M100 49 L108 48 L110 91 L95 119 L83 117 L100 89 Z" fill="#f7f4f0"/><path d="M120 49 L112 48 L110 91 L125 119 L137 117 L120 89 Z" fill="#f7f4f0"/></>}
      {animal === "fox" && <path d="M65 91 Q110 126 155 91 L146 119 Q110 153 74 119 Z" fill="#fff3e7"/>}
      {animal === "dog" && <><ellipse cx="68" cy="105" rx="15" ry="25" fill={ears} opacity=".8"/><ellipse cx="152" cy="105" rx="15" ry="25" fill={ears} opacity=".8"/></>}
      <ellipse cx="86" cy="105" rx="6" ry="8" fill="#45352f"/><ellipse cx="134" cy="105" rx="6" ry="8" fill="#45352f"/><circle cx="88" cy="102" r="2" fill="white"/><circle cx="136" cy="102" r="2" fill="white"/>
      <ellipse cx="70" cy="123" rx="11" ry="6" fill="#f3a7ad" opacity=".65"/><ellipse cx="150" cy="123" rx="11" ry="6" fill="#f3a7ad" opacity=".65"/><ellipse cx="110" cy="126" rx="27" ry="19" fill={muzzle}/><path d="M105 121 Q110 116 115 121 Q115 127 110 128 Q105 127 105 121" fill="#59413c"/><path d="M110 128 Q109 136 101 135 M110 128 Q111 136 119 135" fill="none" stroke="#59413c" strokeWidth="2.5" strokeLinecap="round"/><ellipse cx="87" cy="181" rx="14" ry="8" fill="white" opacity=".7"/><ellipse cx="133" cy="181" rx="14" ry="8" fill="white" opacity=".7"/>
    </svg>
  );
}

function makePlayer() {
  return { x: 65, y: 260, vx: 0, vy: 0, grounded: false, facing: 1 };
}


function playGameSound(type) {
  if (typeof window === "undefined") return;

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  if (!window.dreamJourneyAudio) {
    window.dreamJourneyAudio = new AudioContextClass();
  }

  const context = window.dreamJourneyAudio;

  const sounds = {
    jump: [420, 620, 0.12],
    star: [660, 880, 0.18],
    gem: [520, 1040, 0.24],
    complete: [523, 784, 0.35]
  };

  const sound = sounds[type];
  if (!sound) return;

  function playTone() {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(sound[0], now);
    oscillator.frequency.exponentialRampToValueAtTime(
      sound[1],
      now + sound[2]
    );

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + sound[2]
    );

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start(now);
    oscillator.stop(now + sound[2]);
  }

  if (context.state === "suspended") {
    context.resume().then(playTone).catch(() => {});
  } else {
    playTone();
  }
}

function startDreamMusic() {
  if (typeof window === "undefined") return;

  const AudioContextClass =
    window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) return;

  if (!window.dreamJourneyAudio) {
    window.dreamJourneyAudio = new AudioContextClass();
  }

  const context = window.dreamJourneyAudio;

  if (window.dreamJourneyMusic) return;

  const master = context.createGain();
  master.gain.value = 0.0001;
  master.connect(context.destination);

  const now = context.currentTime;

  const padNotes = [];

  const pads = padNotes.map((frequency) => {
    const oscillator = context.createOscillator();
    const volume = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    volume.gain.value = 0.12;

    oscillator.connect(volume);
    volume.connect(master);
    oscillator.start();

    return oscillator;
  });

  const melody = [
    523.25, 659.25, 783.99, 659.25,
    587.33, 523.25, 440.00, 523.25,
    659.25, 783.99, 880.00, 783.99,
    659.25, 587.33, 523.25, 440.00
  ];

  let noteIndex = 0;

  function playNextNote() {
    if (context.state !== "running") return;

    const frequency = melody[noteIndex];

    const oscillator = context.createOscillator();
    const volume = context.createGain();

    const start = context.currentTime;
    const duration = 0.65;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, start);

    volume.gain.setValueAtTime(0.0001, start);
    volume.gain.linearRampToValueAtTime(0.11, start + 0.04);
    volume.gain.exponentialRampToValueAtTime(
      0.0001,
      start + duration
    );

    oscillator.connect(volume);
    volume.connect(master);

    oscillator.start(start);
    oscillator.stop(start + duration);

    noteIndex = (noteIndex + 1) % melody.length;
  }

  window.dreamJourneyMusic = {
    master: master,
    pads: pads,
    interval: null
  };

  function beginMusic() {
    if (!window.dreamJourneyMusic) return;

    master.gain.cancelScheduledValues(context.currentTime);
    master.gain.setValueAtTime(
      Math.max(master.gain.value, 0.0001),
      context.currentTime
    );
    master.gain.linearRampToValueAtTime(
      0.45,
      context.currentTime + 1.5
    );

    playNextNote();

    window.dreamJourneyMusic.interval = window.setInterval(
      playNextNote,
      650
    );
  }

  if (context.state === "suspended") {
    context.resume().then(beginMusic).catch(() => {});
  } else {
    beginMusic();
  }
}

function stopDreamMusic() {
  if (typeof window === "undefined") return;

  const music = window.dreamJourneyMusic;
  if (!music) return;

  window.clearInterval(music.interval);

  const context = window.dreamJourneyAudio;

  music.master.gain.cancelScheduledValues(context.currentTime);
  music.master.gain.setTargetAtTime(
    0.0001,
    context.currentTime,
    0.25
  );

  music.pads.forEach((oscillator) => {
    try {
      oscillator.stop(context.currentTime + 1);
    } catch (error) {}
  });

  window.dreamJourneyMusic = null;
}


export default function DreamJourneyPage() {
  const [buddy, setBuddy] = useState(BUDDIES[1]);
  const [chosen, setChosen] = useState(false);
  const [levelIndex, setLevelIndex] = useState(0);
  const [unlocked, setUnlocked] = useState(1);
  const [mode, setMode] = useState("select");
  const [player, setPlayer] = useState(makePlayer);
  const [collected, setCollected] = useState([]);
  const [collectedGems, setCollectedGems] = useState([]);
  const [soundOn, setSoundOn] = useState(true);
  const [attempt, setAttempt] = useState(1);
  const [viewportWidth, setViewportWidth] = useState(1000);

  const keys = useRef({});
  const playerRef = useRef(makePlayer());
  const collectedRef = useRef([]);
  const collectedGemsRef = useRef([]);
  const jumpRef = useRef(false);
  const touchRef = useRef({ left: false, right: false });
  const gameViewportRef = useRef(null);
  const level = LEVELS[levelIndex];

  const restartLevel = useCallback(() => {
    playerRef.current = makePlayer();
    collectedRef.current = [];
    collectedGemsRef.current = [];
    touchRef.current.left = false;
    touchRef.current.right = false;
    jumpRef.current = false;
    keys.current = {};
    setPlayer({ ...playerRef.current });
    setCollected([]);
    setCollectedGems([]);
    setAttempt((n) => n + 1);
    setMode("playing");
  }, []);

  const startLevel = useCallback((index) => {
    setLevelIndex(index);
    playerRef.current = makePlayer();
    collectedRef.current = [];
    collectedGemsRef.current = [];
    touchRef.current.left = false;
    touchRef.current.right = false;
    jumpRef.current = false;
    keys.current = {};
    setPlayer({ ...playerRef.current });
    setCollected([]);
    setCollectedGems([]);
    setAttempt(1);
    setMode("playing");
  }, []);

  useEffect(() => {
    function down(event) {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", " ", "Space", "a", "A", "d", "D", "w", "W", "z", "Z"].includes(event.key)) event.preventDefault();
      keys.current[event.key.toLowerCase()] = true;
      if ([" ", "arrowup", "w", "z"].includes(event.key.toLowerCase())) jumpRef.current = true;
    }

    function up(event) {
      keys.current[event.key.toLowerCase()] = false;
    }

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    if (mode !== "playing" && mode !== "levelComplete" && mode !== "complete") {
      return undefined;
    }

    const viewport = gameViewportRef.current;
    if (!viewport) return undefined;

    function updateViewportWidth() {
      setViewportWidth(viewport.clientWidth || 1000);
    }

    updateViewportWidth();
    window.addEventListener("resize", updateViewportWidth);

    return () => {
      window.removeEventListener("resize", updateViewportWidth);
    };
  }, [mode, levelIndex]);

  useEffect(() => {
    if (mode === "playing") return;

    touchRef.current.left = false;
    touchRef.current.right = false;
    jumpRef.current = false;
    keys.current = {};
  }, [mode]);

  useEffect(() => {
    if (mode !== "playing") return undefined;

    let frame;
    let last = 0;

    function tick(time) {
      if (time - last > 16) {
        last = time;
        const p = playerRef.current;
        const left = keys.current.arrowleft || keys.current.a || touchRef.current.left;
        const right = keys.current.arrowright || keys.current.d || touchRef.current.right;

        p.vx = left === right ? 0 : left ? -4 : 4;

        if (left) p.facing = -1;
        if (right) p.facing = 1;

        if (jumpRef.current && p.grounded) {
          if (soundOn) playGameSound("jump");
          p.vy = -12.5;
          p.grounded = false;
        }

        jumpRef.current = false;
        p.x = Math.max(0, Math.min(level.width - 60, p.x + p.vx));
        p.vy = Math.min(10, p.vy + 0.42);

        p.y += p.vy;
        p.grounded = false;

        level.platforms.forEach((platform) => {
          const [x, y, width] = platform;
          const playerLeft = p.x + 12;
          const playerRight = p.x + 52;
          const previousBottom = p.y + 68 - p.vy;
          const currentBottom = p.y + 68;

          if (
            p.vy >= 0 &&
            playerRight > x &&
            playerLeft < x + width &&
            previousBottom <= y &&
            currentBottom >= y
          ) {
            p.y = y - 68;
            p.vy = 0;
            p.grounded = true;
          }
        });

        const hitHazard = level.hazards.some((hazard) =>
          p.x + 48 > hazard[0] && p.x + 14 < hazard[0] + hazard[2] &&
          p.y + 62 > hazard[1] && p.y + 12 < hazard[1] + hazard[3]
        );

        if (p.y > 480 || hitHazard) {
          playerRef.current = makePlayer();
          collectedRef.current = [];
          collectedGemsRef.current = [];
          setCollected([]);
          setCollectedGems([]);
          setPlayer({ ...playerRef.current });
          setAttempt((n) => n + 1);
          frame = window.requestAnimationFrame(tick);
          return;
        }

        const starHits = [];

        level.stars.forEach((star, index) => {
          if (!collectedRef.current.includes(index) && Math.abs((p.x + 30) - star[0]) < 33 && Math.abs((p.y + 32) - star[1]) < 42) {
            starHits.push(index);
          }
        });

        if (starHits.length) {
          if (soundOn) playGameSound("star");
          collectedRef.current = collectedRef.current.concat(starHits);
          setCollected(collectedRef.current.slice());
        }

        const gemHits = [];

        level.gems.forEach((gem, index) => {
          if (!collectedGemsRef.current.includes(index) && Math.abs((p.x + 30) - gem[0]) < 34 && Math.abs((p.y + 32) - gem[1]) < 38) {
            gemHits.push(index);
          }
        });

        if (gemHits.length) {
          if (soundOn) playGameSound("gem");
          collectedGemsRef.current = collectedGemsRef.current.concat(gemHits);
          setCollectedGems(collectedGemsRef.current.slice());
        }

        if (p.x > level.width - 135 && p.y + 68 >= 280) {
          if (soundOn) playGameSound("complete");
          if (levelIndex === LEVELS.length - 1) {
            setMode("complete");
          } else {
            setUnlocked((n) => Math.max(n, levelIndex + 2));
            setMode("levelComplete");
          }
        }

        setPlayer({ ...p });
      }

      frame = window.requestAnimationFrame(tick);
    }

    frame = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frame);
  }, [mode, level, levelIndex, soundOn]);

  useEffect(() => {
    if (mode === "playing" && soundOn) {
      startDreamMusic();
    } else {
      stopDreamMusic();
    }

    return () => {
      stopDreamMusic();
    };
  }, [mode, soundOn, levelIndex]);

  const camera = Math.max(
    0,
    Math.min(
      Math.max(0, level.width - viewportWidth),
      player.x - viewportWidth * 0.22
    )
  );

  const bg = levelIndex === 1 || levelIndex === 4 ? "#172452" : level.sky;
  const starsCount = collected.length;

  return (
    <main className="min-h-screen bg-[#fff8f5] px-3 py-7 text-[#26345b] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#26345b]/10 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[.16em] shadow-sm">✦ A magical platform adventure</div>
          <h1 className="font-heading text-4xl font-bold sm:text-6xl">Dream Journey</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-[#26345b]/70 sm:text-base">Five dreamy worlds, lots of hidden stars, and one very brave little buddy.</p>
        </header>

        {mode === "select" && <section className="mx-auto max-w-4xl rounded-[32px] border-4 border-white bg-gradient-to-b from-[#d9e6ff] via-[#f5e3f7] to-[#fff0e7] p-5 shadow-xl sm:p-8">
          <div className="text-center"><h2 className="font-heading text-2xl font-bold sm:text-3xl">Who is going on an adventure?</h2><p className="mt-2 text-sm text-[#26345b]/70">Choose your buddy, then explore the dreams.</p></div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">{BUDDIES.map((item) => <button key={item.id} onClick={() => setBuddy(item)} aria-pressed={buddy.id === item.id} className={`rounded-3xl border-2 bg-white/85 p-3 text-center transition hover:-translate-y-1 ${buddy.id === item.id ? "border-[#6c67bb] ring-4 ring-[#c9c8f4]" : "border-white"}`}><CartoonBuddy animal={item.animal} className="mx-auto w-full max-w-[125px]"/><p className="mt-1 text-sm font-bold">{item.name}</p><p className="mt-1 text-xs text-[#26345b]/65">{item.description}</p></button>)}</div>
          <div className="mt-7 text-center"><button onClick={() => setMode("map")} className="rounded-full bg-[#45458e] px-8 py-3 font-bold text-white shadow-lg transition hover:bg-[#33336e]">Start dreaming ✨</button></div>
        </section>}

        {mode === "map" && <section className="mx-auto max-w-4xl rounded-[32px] border-4 border-white bg-white p-5 shadow-xl sm:p-8"><div className="text-center"><h2 className="font-heading text-2xl font-bold sm:text-3xl">Choose your dream world</h2><p className="mt-2 text-sm text-[#26345b]/70">Finish each level to unlock the next one.</p></div><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{LEVELS.map((item, index) => <button key={item.name} disabled={index >= unlocked} onClick={() => startLevel(index)} className="overflow-hidden rounded-3xl border-2 border-[#e7e4f6] text-left transition hover:-translate-y-1 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-45"><div className="relative flex h-28 items-center justify-center" style={{ background: `linear-gradient(160deg, ${item.sky}, ${item.horizon})` }}><span className="text-5xl">{["☁️", "🍄", "🍭", "🏝️", "🏰"][index]}</span><span className="absolute right-3 top-3 rounded-full bg-white/85 px-2 py-1 text-xs font-bold">{index < unlocked ? "Unlocked" : "🔒 Locked"}</span></div><div className="p-4"><p className="text-xs font-bold uppercase tracking-wider text-[#7974b6]">Level {index + 1}</p><h3 className="mt-1 font-heading text-lg font-bold">{item.name}</h3><p className="mt-1 text-xs text-[#26345b]/65">{item.subtitle}</p></div></button>)}</div><div className="mt-6 text-center"><button onClick={() => setMode("select")} className="text-sm font-bold text-[#45458e]">← Change buddy</button></div></section>}

        {(mode === "playing" || mode === "levelComplete" || mode === "complete") && <section className="overflow-hidden rounded-[28px] border-4 border-white bg-white shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-3 sm:px-6"><div className="flex items-center gap-3"><div className="h-12 w-12 overflow-hidden rounded-full bg-[#f8e8f5]"><CartoonBuddy animal={buddy.animal} className="w-full"/></div><div><p className="text-xs font-bold uppercase tracking-wider text-[#817bb8]">Level {levelIndex + 1} of 5</p><h2 className="font-heading text-lg font-bold sm:text-xl">{level.name}</h2></div></div><div className="flex items-center gap-3"><div className="rounded-full bg-[#fff3c9] px-3 py-2 text-sm font-bold text-[#8b6821]"><Star className="mr-1 inline" size={16} fill="currentColor"/> {starsCount}/{level.stars.length}<span className="ml-2 border-l border-[#8b6821]/20 pl-2">💎 {collectedGems.length}/{level.gems.length}</span></div><button onClick={() => setSoundOn((v) => !v)} aria-label={soundOn ? "Mute sound" : "Enable sound"} className="rounded-full bg-[#f3f0fb] p-2">{soundOn ? <Volume2 size={18}/> : <VolumeX size={18}/>}</button><button
            onClick={() => {
              touchRef.current.left = false;
              touchRef.current.right = false;
              jumpRef.current = false;
              keys.current = {};
              playerRef.current = makePlayer();
              collectedRef.current = [];
              collectedGemsRef.current = [];
              setPlayer(makePlayer());
              setCollected([]);
              setCollectedGems([]);
              setLevelIndex(0);
              setUnlocked(1);
              setAttempt(1);
              setMode("select");
            }}
            aria-label="Back to character selection"
            title="Back to character selection"
            className="rounded-full bg-[#f3f0fb] p-2"
          >
            <Home size={18}/>
          </button><button onClick={restartLevel} aria-label="Restart level" className="rounded-full bg-[#f3f0fb] p-2"><RotateCcw size={18}/></button></div></div>

          <div
            ref={gameViewportRef}
            className="relative h-[400px] select-none overflow-hidden touch-none sm:h-[440px]"
            style={{
              background: `linear-gradient(180deg, ${bg} 0%, ${level.horizon} 100%)`,
              WebkitUserSelect: "none",
              WebkitTouchCallout: "none"
            }}
          >
            <div className="pointer-events-none absolute inset-0 opacity-50" style={{ backgroundImage: `radial-gradient(circle at 15% 20%, ${level.accent} 0 2px, transparent 3px), radial-gradient(circle at 75% 18%, #ffffff 0 2px, transparent 3px), radial-gradient(circle at 55% 35%, #ffffff 0 1px, transparent 2px)`, backgroundSize: "130px 100px, 180px 130px, 95px 85px" }}/>
            <div className="absolute bottom-0 h-16 w-full opacity-50" style={{ background: `linear-gradient(180deg, transparent, ${level.platform})` }}/>
            <div className="absolute inset-y-0 left-0" style={{ width: `${level.width}px`, transform: `translateX(-${camera}px)` }}>
              {Array.from({ length: 18 }, (_, i) => <div key={i} className="absolute rounded-full opacity-40" style={{ left: i * 155 + 15, top: 35 + ((i * 47) % 140), width: 90 + (i % 3) * 35, height: 30 + (i % 2) * 15, background: levelIndex === 1 || levelIndex === 4 ? "#8f9de5" : "#ffffff", filter: "blur(1px)" }}/>)}
              {level.platforms.map((platform, index) => <div key={index} className="absolute rounded-[22px] border-b-[7px] shadow-md" style={{ left: platform[0], top: platform[1], width: platform[2], height: 24, background: level.platform, borderColor: level.edge }}><div className="absolute -top-2 left-3 right-3 h-4 rounded-full" style={{ background: level.platform }}/><span className="absolute -bottom-5 left-1/4 text-lg opacity-60">{levelIndex === 2 ? "🍬" : levelIndex === 1 ? "🌿" : "✦"}</span></div>)}
              {level.hazards.map((hazard, index) => <div key={index} className="absolute rounded-t-full border-b-4 border-[#cf639a] bg-[#ff9fc7] shadow-[0_0_12px_rgba(245,138,171,.5)]" style={{ left: hazard[0], top: hazard[1], width: hazard[2], height: hazard[3] }}><span className="absolute inset-0 flex items-center justify-center text-sm">✦</span></div>)}
              {level.gems.map((gem, index) => <div key={index} className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 text-2xl transition ${collectedGems.includes(index) ? "scale-0 opacity-0" : "animate-[bounce_1.5s_infinite] drop-shadow-[0_0_10px_rgba(150,240,255,.9)]"}`} style={{ left: gem[0], top: gem[1] }}>💎</div>)}
              {level.stars.map((star, index) => <div key={index} className={`absolute -translate-x-1/2 -translate-y-1/2 text-2xl transition ${collected.includes(index) ? "scale-0 opacity-0" : "animate-pulse drop-shadow-[0_0_8px_rgba(255,226,115,.8)]"}`} style={{ left: star[0], top: star[1], color: level.accent }}>★</div>)}
              <div className="absolute bottom-[75px] flex h-14 w-14 items-center justify-center rounded-full border-4 border-white/80 bg-white/30 text-3xl shadow-[0_0_30px_rgba(255,240,161,.85)]" style={{ left: level.width - 112, top: 270 }}>🌀</div>
              <div className="absolute z-20" style={{ left: player.x, top: player.y, width: 64, height: 70, transform: `scaleX(${player.facing})`, transformOrigin: "center bottom" }}><CartoonBuddy animal={buddy.animal} className={`h-full w-full drop-shadow-md ${player.grounded && Math.abs(player.vx) > 0 ? "animate-[bounce_0.25s_infinite]" : ""}`}/></div>
            </div>
            <div className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-2 text-xs font-bold shadow-sm">{level.subtitle}</div>
            <div className="absolute right-3 top-3 rounded-full bg-white/85 px-3 py-2 text-xs font-bold shadow-sm">Attempt {attempt}</div>

            {(mode === "levelComplete" || mode === "complete") && <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#252454]/65 p-4 backdrop-blur-sm"><div className="w-full max-w-sm rounded-[28px] border-4 border-white bg-[#fffaf5] p-6 text-center shadow-2xl"><div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#fff0bd] text-[#ad7e24]"><Trophy size={28}/></div><h3 className="font-heading text-2xl font-bold">{mode === "complete" ? "You did it, dreamer!" : "Dream world complete!"}</h3><p className="mt-2 text-sm leading-relaxed text-[#26345b]/70">{mode === "complete" ? "You crossed all five dream worlds. What a magical adventure!" : `Lovely work! You collected ${starsCount} of ${level.stars.length} stars. Your next dream is waiting.`}</p><div className="my-5 flex justify-center gap-2">{level.stars.slice(0, 5).map((s, i) => <span key={i} className={`flex h-9 w-9 items-center justify-center rounded-xl ${collected.includes(i) ? "bg-[#fff0bd] text-[#bd8a24]" : "bg-[#eceaf7] text-[#aaa7c5]"}`}><Star size={19} fill={collected.includes(i) ? "currentColor" : "none"}/></span>)}</div><div className="flex flex-col gap-2">{mode === "complete" ? <button onClick={() => { setUnlocked(1); setMode("select"); setLevelIndex(0); }} className="rounded-full bg-[#45458e] px-5 py-3 text-sm font-bold text-white">Play again</button> : <button onClick={() => startLevel(levelIndex + 1)} className="rounded-full bg-[#45458e] px-5 py-3 text-sm font-bold text-white">Next dream world →</button>}<button onClick={() => setMode("map")} className="rounded-full border border-[#45458e]/20 bg-white px-5 py-3 text-sm font-bold">Back to dream map</button></div></div></div>}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#fffaf7] px-4 py-3 sm:px-6">
            <p className="text-xs text-[#26345b]/70">Move with <b>← →</b> or <b>A / D</b>. Jump with <b>Space</b> or <b>Z</b>. Pink dream sparks reset you if touched. Collect the blue gems for bonus treasure. Falling restarts this level.</p>
            <div
              className="flex gap-2 select-none touch-none"
              style={{
                touchAction: "none",
                userSelect: "none",
                WebkitUserSelect: "none",
                WebkitTouchCallout: "none"
              }}
              onContextMenu={(event) => event.preventDefault()}
            >
              <button
                type="button"
                onPointerDown={(event) => {
                  event.preventDefault();
                  event.currentTarget.setPointerCapture(event.pointerId);
                  touchRef.current.left = true;
                }}
                onPointerUp={(event) => {
                  touchRef.current.left = false;
                  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                    event.currentTarget.releasePointerCapture(event.pointerId);
                  }
                }}
                onPointerCancel={() => {
                  touchRef.current.left = false;
                }}
                onLostPointerCapture={() => {
                  touchRef.current.left = false;
                }}
                aria-label="Move left"
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow ring-1 ring-[#45458e]/15 active:bg-[#eae7fb] sm:h-12 sm:w-12 select-none touch-none"
              >
                <ArrowLeft size={24}/>
              </button>

              <button
                type="button"
                onPointerDown={(event) => {
                  event.preventDefault();
                  event.currentTarget.setPointerCapture(event.pointerId);
                  touchRef.current.right = true;
                }}
                onPointerUp={(event) => {
                  touchRef.current.right = false;
                  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                    event.currentTarget.releasePointerCapture(event.pointerId);
                  }
                }}
                onPointerCancel={() => {
                  touchRef.current.right = false;
                }}
                onLostPointerCapture={() => {
                  touchRef.current.right = false;
                }}
                aria-label="Move right"
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow ring-1 ring-[#45458e]/15 active:bg-[#eae7fb] sm:h-12 sm:w-12 select-none touch-none"
              >
                <ArrowRight size={24}/>
              </button>

              <button
                type="button"
                onPointerDown={(event) => {
                  event.preventDefault();
                  jumpRef.current = true;
                }}
                aria-label="Jump"
                className="h-14 min-w-24 rounded-2xl bg-[#45458e] px-5 text-sm font-bold text-white shadow active:bg-[#33336e] sm:h-12 select-none touch-none"
              >
                JUMP ↑
              </button>
            </div>
          </div>
        </section>}

        <footer className="mt-7 text-center text-xs text-[#26345b]/50">Made of stardust, soft clouds and big imaginations ✦</footer>
      </div>
    </main>
  );
}
