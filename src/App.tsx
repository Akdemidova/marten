import { useState, useEffect, useRef, useCallback } from 'react';

// Вайб-промпты для генератора
const vibePrompts = [
  "Сделай сайт с анимацией космоса и летающими планетами 🪐",
  "Хочу дашборд с неоновыми графиками в стиле киберпанк 🌃",
  "Создай лендинг для кофейни с параллаксом ☕",
  "Нужен генератор мемов с drag-and-drop 😂",
  "Сделай музыкальный плеер с визуализацией звука 🎵",
  "Хочу чат-приложение с эмодзи-реакциями 💬",
  "Создай портфолио с 3D-эффектами при скролле 🎨",
  "Нужен таск-менеджер в стиле ретро-игры 👾",
  "Сделай погоду с анимированными иконками ☀️🌧️",
  "Хочу генератор градиентов с копированием CSS 🎨",
  "Создай таймер Помодоро с мотивационными цитатами 🍅",
  "Нужен калькулятор калорий с красивыми диаграммами 🥗",
  "Сделай галерею с masonry-раскладкой и лайтбоксом 📸",
  "Хочу квиз с таймером и анимированными переходами 🧠",
  "Создай страницу 404 с мини-игрой 🎮",
];

// Уровни вайба
const vibeLevels = [
  { level: "Новичок", emoji: "🌱", description: "Сделай кнопку", color: "from-green-500 to-emerald-500" },
  { level: "Уверенный", emoji: "🚀", description: "Сделай лендинг с анимациями", color: "from-blue-500 to-cyan-500" },
  { level: "Продвинутый", emoji: "⚡", description: "Сделай SaaS с дашбордом и авторизацией", color: "from-purple-500 to-violet-500" },
  { level: "Мастер", emoji: "🔥", description: "Сделай клон Spotify с AI-рекомендациями", color: "from-orange-500 to-red-500" },
  { level: "Легенда", emoji: "👑", description: "Сделай ОС в браузере", color: "from-yellow-400 to-amber-500" },
];

// Фразы для терминала
const terminalLines = [
  { type: "command", text: "$ vibe init my-awesome-project" },
  { type: "output", text: "✨ Инициализация вайба..." },
  { type: "output", text: "🎨 Подбираю цветовую палитру..." },
  { type: "output", text: "⚡ Генерирую компоненты..." },
  { type: "output", text: "🎭 Добавляю анимации..." },
  { type: "success", text: "✅ Проект создан! Вайб: 100%" },
  { type: "command", text: "$ vibe deploy --feeling=amazing" },
  { type: "output", text: "🚀 Деплой на орбиту..." },
  { type: "success", text: "🌍 Сайт в космосе! Пользователи в восторге!" },
];

function Particles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 10,
    color: ['#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b'][Math.floor(Math.random() * 4)],
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          }}
        />
      ))}
    </div>
  );
}

function VibeGenerator() {
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [vibeLevel, setVibeLevel] = useState(0);

  const generatePrompt = useCallback(() => {
    setIsGenerating(true);
    setCurrentPrompt('');
    const prompt = vibePrompts[Math.floor(Math.random() * vibePrompts.length)];
    let index = 0;
    const interval = setInterval(() => {
      if (index < prompt.length) {
        setCurrentPrompt(prompt.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsGenerating(false);
        setVibeLevel(Math.floor(Math.random() * 40) + 60);
      }
    }, 50);
  }, []);

  useEffect(() => {
    generatePrompt();
  }, [generatePrompt]);

  return (
    <div className="glass-card p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span className="text-2xl">🎲</span> Генератор вайб-промптов
      </h3>
      <div className="bg-black/30 rounded-xl p-6 min-h-[100px] flex items-center justify-center mb-6">
        <p className="text-lg text-center text-purple-200 font-mono">
          {currentPrompt}
          {isGenerating && <span className="cursor-blink text-purple-400">▌</span>}
        </p>
      </div>
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Уровень вайба</span>
          <span className="text-purple-400 font-bold">{vibeLevel}%</span>
        </div>
        <div className="vibe-meter">
          <div className="vibe-meter-fill" style={{ width: `${vibeLevel}%` }} />
        </div>
      </div>
      <button
        onClick={generatePrompt}
        disabled={isGenerating}
        className="w-full py-3 px-6 rounded-xl font-bold text-white
                   bg-gradient-to-r from-purple-600 to-pink-600
                   hover:from-purple-500 hover:to-pink-500
                   transition-all duration-300 transform hover:scale-[1.02]
                   disabled:opacity-50 disabled:cursor-not-allowed
                   shadow-lg shadow-purple-500/25"
      >
        {isGenerating ? '✨ Генерирую...' : '🎰 Новый вайб!'}
      </button>
    </div>
  );
}

function Terminal() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= terminalLines.length) {
          clearInterval(timer);
          setIsTyping(false);
          // Restart after delay
          setTimeout(() => {
            setVisibleLines(0);
            setIsTyping(true);
          }, 3000);
          return prev;
        }
        return prev + 1;
      });
    }, 800);
    return () => clearInterval(timer);
  }, [isTyping]);

  return (
    <div className="terminal shadow-2xl shadow-purple-500/10">
      <div className="terminal-header">
        <div className="terminal-dot bg-red-500" />
        <div className="terminal-dot bg-yellow-500" />
        <div className="terminal-dot bg-green-500" />
        <span className="ml-4 text-sm text-gray-400 font-mono">vibe-terminal</span>
      </div>
      <div className="terminal-body">
        {terminalLines.slice(0, visibleLines).map((line, i) => (
          <div
            key={i}
            className={`slide-up ${
              line.type === 'command'
                ? 'text-green-400'
                : line.type === 'success'
                ? 'text-yellow-300 font-bold'
                : 'text-gray-300'
            }`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {line.text}
          </div>
        ))}
        {isTyping && visibleLines < terminalLines.length && (
          <span className="cursor-blink text-green-400">▌</span>
        )}
      </div>
    </div>
  );
}

function VibeLevels() {
  const [activeLevel, setActiveLevel] = useState(0);

  return (
    <div className="glass-card p-8">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="text-2xl">📊</span> Уровни вайбкодера
      </h3>
      <div className="space-y-3">
        {vibeLevels.map((level, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
              activeLevel === i
                ? 'bg-white/10 border border-purple-500/50 scale-[1.02]'
                : 'bg-white/[0.02] border border-transparent hover:bg-white/5'
            }`}
            onClick={() => setActiveLevel(i)}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{level.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-bold bg-gradient-to-r ${level.color} bg-clip-text text-transparent`}>
                    {level.level}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-1">{level.description}</p>
              </div>
              {activeLevel === i && (
                <div className="w-3 h-3 rounded-full bg-purple-500 pulse-ring" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmojiRain({ emoji }: { emoji: string }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setPosition({
      x: Math.random() * window.innerWidth,
      y: window.innerHeight - 100,
    });
  }, []);

  return (
    <div
      className="emoji-float"
      style={{ left: position.x, top: position.y }}
    >
      {emoji}
    </div>
  );
}

function InteractiveSection() {
  const [clicks, setClicks] = useState(0);
  const [emojis, setEmojis] = useState<{ id: number; emoji: string }[]>([]);
  const emojisList = ['✨', '🔥', '💜', '⚡', '🚀', '🎨', '💫', '🌟'];

  const handleClick = () => {
    setClicks((c) => c + 1);
    const emoji = emojisList[Math.floor(Math.random() * emojisList.length)];
    const id = Date.now();
    setEmojis((prev) => [...prev, { id, emoji }]);
    setTimeout(() => {
      setEmojis((prev) => prev.filter((e) => e.id !== id));
    }, 3000);
  };

  const getVibeMessage = () => {
    if (clicks === 0) return "Нажми кнопку 👆";
    if (clicks < 5) return "Погнали! 🚀";
    if (clicks < 15) return "Вайб нарастает! ⚡";
    if (clicks < 30) return "МАКСИМАЛЬНЫЙ ВИБ! 🔥";
    if (clicks < 50) return "ТЫ ЛЕГЕНДА! 👑";
    return "ВАЙБКОДЕР БЕСКОНЕЧНОСТИ ∞";
  };

  return (
    <div className="glass-card p-8 text-center relative overflow-hidden">
      {emojis.map((e) => (
        <EmojiRain key={e.id} emoji={e.emoji} />
      ))}
      <h3 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
        <span className="text-2xl">🎯</span> Кнопка вайба
      </h3>
      <p className="text-gray-400 mb-6 text-lg">{getVibeMessage()}</p>
      <button
        onClick={handleClick}
        className="relative w-32 h-32 rounded-full mx-auto
                   bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500
                   hover:from-purple-500 hover:via-pink-400 hover:to-orange-400
                   transition-all duration-300 transform hover:scale-110 active:scale-95
                   shadow-2xl shadow-purple-500/30
                   flex items-center justify-center text-4xl"
      >
        <span className="relative z-10">
          {clicks < 5 ? '🎵' : clicks < 15 ? '⚡' : clicks < 30 ? '🔥' : clicks < 50 ? '👑' : '∞'}
        </span>
        {clicks > 0 && (
          <div className="absolute inset-0 rounded-full border-2 border-purple-400/50 pulse-ring" />
        )}
      </button>
      <div className="mt-6 text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        {clicks}
      </div>
      <p className="text-sm text-gray-500 mt-1">вайб-кликов</p>
    </div>
  );
}

function StatsSection() {
  const [counts, setCounts] = useState({ projects: 0, lines: 0, vibes: 0, bugs: 0 });

  useEffect(() => {
    const targets = { projects: 847, lines: 142857, vibes: 9999, bugs: 0 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCounts({
        projects: Math.floor(targets.projects * eased),
        lines: Math.floor(targets.lines * eased),
        vibes: Math.floor(targets.vibes * eased),
        bugs: 0,
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    { label: "Проектов создано", value: counts.projects.toLocaleString(), icon: "🚀" },
    { label: "Строк кода", value: counts.lines.toLocaleString(), icon: "💻" },
    { label: "Вайбов поймано", value: counts.vibes.toLocaleString(), icon: "✨" },
    { label: "Багов", value: counts.bugs.toString(), icon: "🐛" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="glass-card p-6 text-center"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <div className="text-3xl mb-2">{stat.icon}</div>
          <div className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {stat.value}
          </div>
          <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

function PhilosophySection() {
  const principles = [
    { icon: "💭", title: "Опиши вайб", desc: "Не пиши ТЗ — опиши ощущение. 'Хочу чтобы было красиво и быстро' — это уже начало." },
    { icon: "🤖", title: "AI делает магию", desc: "Ты думаешь — AI кодит. Ты говоришь 'ещё чуть анимации' — и оно работает." },
    { icon: "🎨", title: "Итерации > perfection", desc: "Не стремись к идеалу с первого раза. Вайбкодинг — это процесс, а не результат." },
    { icon: "⚡", title: "Скорость — это всё", desc: "От идеи до прототипа за минуты, не за недели. Движение важнее совершенства." },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {principles.map((p, i) => (
        <div key={i} className="glass-card p-6 neon-border rounded-2xl">
          <div className="text-4xl mb-3">{p.icon}</div>
          <h4 className="text-lg font-bold mb-2 text-white">{p.title}</h4>
          <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="gradient-bg min-h-screen relative">
      <Particles />

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div
          className="transition-transform duration-100"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        >
          <div className="mb-6 text-6xl md:text-8xl animate-bounce">
            ✨
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-4 glow-text">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              ВАЙБКОДИНГ
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Когда ты просто <span className="text-purple-400 font-bold">описываешь</span> что хочешь,
            а AI <span className="text-pink-400 font-bold">создаёт</span> это для тебя.
            <br />
            <span className="text-cyan-400">Без стресса. Без багов. Только вайб.</span>
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="#generator"
              className="px-8 py-4 rounded-2xl font-bold text-white
                         bg-gradient-to-r from-purple-600 to-pink-600
                         hover:from-purple-500 hover:to-pink-500
                         transition-all duration-300 transform hover:scale-105
                         shadow-xl shadow-purple-500/25"
            >
              🎰 Попробовать вайб
            </a>
            <a
              href="#terminal"
              className="px-8 py-4 rounded-2xl font-bold text-white
                         border border-white/20 hover:border-purple-500/50
                         bg-white/5 hover:bg-white/10
                         transition-all duration-300 transform hover:scale-105"
            >
              💻 Смотреть терминал
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 rounded-full bg-purple-400 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 px-4 py-16 max-w-6xl mx-auto">
        <StatsSection />
      </section>

      {/* Main Content Grid */}
      <section id="generator" className="relative z-10 px-4 py-16 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Поймай свой вайб
            </span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Интерактивные элементы, которые покажут как это работает
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <VibeGenerator />
          <InteractiveSection />
        </div>
      </section>

      {/* Terminal */}
      <section id="terminal" className="relative z-10 px-4 py-16 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black mb-4">
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              Как это выглядит
            </span>
          </h2>
          <p className="text-gray-400">Смотри — вайбкодинг в действии</p>
        </div>
        <Terminal />
      </section>

      {/* Vibe Levels */}
      <section className="relative z-10 px-4 py-16 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <VibeLevels />
          <div className="glass-card p-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">🧘</span> Что такое вайбкодинг?
            </h3>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                <strong className="text-purple-400">Вайбкодинг</strong> — это новый способ создания 
                программного обеспечения, где главное — это <em>ощущение</em>, а не точная спецификация.
              </p>
              <p>
                Ты не пишешь код. Ты не пишешь ТЗ. Ты просто <strong className="text-pink-400">вайбишь</strong> — 
                описываешь что хочешь почувствовать, и AI превращает это в реальность.
              </p>
              <p>
                Это как медитация, только вместо просветления ты получаешь <strong className="text-cyan-400">работающий сайт</strong>. 🧘‍♂️💻
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="relative z-10 px-4 py-16 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Философия вайба
            </span>
          </h2>
        </div>
        <PhilosophySection />
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-4 py-12 text-center border-t border-white/5">
        <p className="text-gray-500 text-sm">
          Сделано с ✨ вайбом и нулевым стрессом
        </p>
        <p className="text-gray-600 text-xs mt-2">
          Вайбкодинг — это не баг, это фича 🎯
        </p>
      </footer>
    </div>
  );
}
