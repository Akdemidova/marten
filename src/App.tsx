import { useState, useEffect, useRef, useCallback } from 'react';

// Типы и константы
type SmeltStage = 'loading' | 'heating' | 'melting' | 'refining' | 'tapping' | 'idle';

interface FurnaceState {
  temperature: number;
  targetTemp: number;
  airFlow: number;
  fuelFlow: number;
  meltLevel: number;
  carbonContent: number;
  stage: SmeltStage;
  isRunning: boolean;
  scrapLoaded: number;
  pigIronLoaded: number;
  limestoneLoaded: number;
  oxygenFlow: number;
  slagAmount: number;
  elapsed: number;
}

const STAGE_INFO: Record<SmeltStage, { name: string; emoji: string; desc: string; color: string }> = {
  loading: { name: 'Завалка шихты', emoji: '📦', desc: 'Загрузка металлолома, чугуна и флюсов', color: 'from-blue-500 to-cyan-500' },
  heating: { name: 'Разогрев', emoji: '🔥', desc: 'Нагрев шихты до температуры плавления', color: 'from-yellow-500 to-orange-500' },
  melting: { name: 'Плавление', emoji: '💧', desc: 'Расплавление металлической шихты', color: 'from-orange-500 to-red-500' },
  refining: { name: 'Рафинирование', emoji: '⚗️', desc: 'Удаление примесей, корректировка состава', color: 'from-red-500 to-purple-500' },
  tapping: { name: 'Выпуск стали', emoji: '🌊', desc: 'Слив готовой стали из печи', color: 'from-purple-500 to-pink-500' },
  idle: { name: 'Ожидание', emoji: '⏸️', desc: 'Печь в режиме ожидания', color: 'from-gray-500 to-gray-600' },
};

// SVG Компонент печи
function FurnaceSVG({ state }: { state: FurnaceState }) {
  const flameIntensity = state.temperature / 1800;
  const meltHeight = state.meltLevel;

  return (
    <svg viewBox="0 0 400 500" className="w-full max-w-md mx-auto drop-shadow-2xl">
      <defs>
        <linearGradient id="furnaceBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4a4a5a" />
          <stop offset="50%" stopColor="#3a3a4a" />
          <stop offset="100%" stopColor="#2a2a3a" />
        </linearGradient>
        <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#ff4500" />
          <stop offset="40%" stopColor="#ff8c00" />
          <stop offset="70%" stopColor="#ffd700" />
          <stop offset="100%" stopColor="#fff8dc" />
        </linearGradient>
        <linearGradient id="meltGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff6b35" />
          <stop offset="50%" stopColor="#ff4500" />
          <stop offset="100%" stopColor="#cc3700" />
        </linearGradient>
        <radialGradient id="glowGrad">
          <stop offset="0%" stopColor={`rgba(255, 100, 0, ${flameIntensity * 0.6})`} />
          <stop offset="100%" stopColor="rgba(255, 100, 0, 0)" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id="chamberClip">
          <rect x="100" y="180" width="200" height="200" rx="10" />
        </clipPath>
      </defs>

      {/* Основание */}
      <rect x="60" y="420" width="280" height="60" rx="5" fill="#2a2a3a" stroke="#555" strokeWidth="2" />
      <rect x="80" y="440" width="240" height="20" rx="3" fill="#1a1a2a" />

      {/* Корпус печи */}
      <rect x="80" y="150" width="240" height="270" rx="15" fill="url(#furnaceBody)" stroke="#666" strokeWidth="3" />

      {/* Свод печи (арка) */}
      <path d="M 80 180 Q 200 100 320 180" fill="url(#furnaceBody)" stroke="#666" strokeWidth="3" />
      <path d="M 100 180 Q 200 120 300 180" fill="#1a1a2a" stroke="#444" strokeWidth="1" />

      {/* Рабочее пространство (камера) */}
      <rect x="100" y="180" width="200" height="200" rx="10" fill="#0a0a0a" stroke="#444" strokeWidth="1" />

      {/* Расплав */}
      {state.meltLevel > 0 && (
        <g clipPath="url(#chamberClip)">
          <rect
            x="100"
            y={380 - meltHeight * 2}
            width="200"
            height={meltHeight * 2}
            fill="url(#meltGrad)"
            opacity="0.9"
          >
            <animate attributeName="y" values={`${380 - meltHeight * 2};${378 - meltHeight * 2};${380 - meltHeight * 2}`} dur="2s" repeatCount="indefinite" />
          </rect>
          {/* Пузыри в расплаве */}
          {state.temperature > 800 && Array.from({ length: 5 }).map((_, i) => (
            <circle
              key={i}
              cx={140 + i * 30}
              cy={370 - meltHeight}
              r="3"
              fill="#ffaa00"
              opacity="0.7"
            >
              <animate attributeName="cy" values={`${370 - meltHeight};${340 - meltHeight};${370 - meltHeight}`} dur={`${1 + i * 0.3}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;0.2;0.7" dur={`${1 + i * 0.3}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>
      )}

      {/* Пламя */}
      {state.temperature > 100 && (
        <g filter="url(#glow)" opacity={Math.min(flameIntensity * 1.5, 1)}>
          {Array.from({ length: 7 }).map((_, i) => (
            <ellipse
              key={i}
              cx={130 + i * 25}
              cy="190"
              rx={8 + Math.random() * 4}
              ry={20 + flameIntensity * 30}
              fill="url(#flameGrad)"
              opacity={0.6 + Math.random() * 0.3}
            >
              <animate
                attributeName="ry"
                values={`${20 + flameIntensity * 25};${25 + flameIntensity * 35};${20 + flameIntensity * 25}`}
                dur={`${0.5 + i * 0.1}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="rx"
                values={`${8};${10};${8}`}
                dur={`${0.7 + i * 0.1}s`}
                repeatCount="indefinite"
              />
            </ellipse>
          ))}
        </g>
      )}

      {/* Свечение */}
      {state.temperature > 200 && (
        <ellipse cx="200" cy="280" rx="120" ry="100" fill="url(#glowGrad)" />
      )}

      {/* Портал загрузки (верх) */}
      <rect x="160" y="105" width="80" height="30" rx="5" fill="#3a3a4a" stroke="#666" strokeWidth="2" />
      <rect x="170" y="110" width="60" height="20" rx="3" fill={state.stage === 'loading' ? '#1a4a1a' : '#1a1a2a'} />
      {state.stage === 'loading' && (
        <text x="200" y="124" textAnchor="middle" fill="#4ade80" fontSize="10" fontFamily="monospace">OPEN</text>
      )}

      {/* Горелки (слева и справа) */}
      <rect x="60" y="250" width="40" height="20" rx="3" fill="#555" stroke="#666" strokeWidth="1" />
      <rect x="300" y="250" width="40" height="20" rx="3" fill="#555" stroke="#666" strokeWidth="1" />
      {state.fuelFlow > 0 && (
        <>
          <ellipse cx="80" cy="260" rx="15" ry="5" fill="#ff6600" opacity="0.8">
            <animate attributeName="rx" values="15;18;15" dur="0.3s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="320" cy="260" rx="15" ry="5" fill="#ff6600" opacity="0.8">
            <animate attributeName="rx" values="15;18;15" dur="0.3s" repeatCount="indefinite" />
          </ellipse>
        </>
      )}

      {/* Выпускное отверстие */}
      <rect x="180" y="385" width="40" height="35" rx="3" fill="#3a3a4a" stroke="#666" strokeWidth="2" />
      {state.stage === 'tapping' && (
        <g>
          <rect x="190" y="400" width="20" height="30" fill="#ff4500" opacity="0.9">
            <animate attributeName="height" values="30;35;30" dur="0.5s" repeatCount="indefinite" />
          </rect>
          <ellipse cx="200" cy="435" rx="15" ry="5" fill="#ff4500" opacity="0.5">
            <animate attributeName="rx" values="15;20;15" dur="0.8s" repeatCount="indefinite" />
          </ellipse>
        </g>
      )}

      {/* Дымовая труба */}
      <rect x="280" y="60" width="30" height="100" rx="3" fill="#3a3a4a" stroke="#555" strokeWidth="2" />
      {state.temperature > 300 && (
        <g opacity="0.4">
          <ellipse cx="295" cy="50" rx="12" ry="8" fill="#888">
            <animate attributeName="cy" values="50;20;50" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0.1;0.4" dur="3s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="295" cy="35" rx="15" ry="10" fill="#666">
            <animate attributeName="cy" values="35;5;35" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.05;0.3" dur="4s" repeatCount="indefinite" />
          </ellipse>
        </g>
      )}

      {/* Метки температуры */}
      <text x="340" y="200" fill="#888" fontSize="9" fontFamily="monospace">{state.temperature}°C</text>
      <line x1="320" y1="195" x2="335" y2="195" stroke="#888" strokeWidth="1" />

      {/* Метка уровня */}
      {state.meltLevel > 0 && (
        <>
          <line x1="90" y1={380 - meltHeight * 2} x2="100" y2={380 - meltHeight * 2} stroke="#ff6b35" strokeWidth="1" strokeDasharray="3,2" />
          <text x="55" y={383 - meltHeight * 2} fill="#ff6b35" fontSize="8" fontFamily="monospace">{Math.round(state.meltLevel)}%</text>
        </>
      )}
    </svg>
  );
}

// Компонент индикатора
function Gauge({ value, max, label, unit, color, icon }: { value: number; max: number; label: string; unit: string; color: string; icon: string }) {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400 flex items-center gap-1">
          <span>{icon}</span> {label}
        </span>
        <span className={`text-lg font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
          {typeof value === 'number' ? (value > 100 ? Math.round(value) : value.toFixed(1)) : value}
          <span className="text-xs text-gray-500 ml-1">{unit}</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Компонент кнопки управления
function ControlButton({ onClick, disabled, children, variant = 'default' }: { onClick: () => void; disabled?: boolean; children: React.ReactNode; variant?: 'default' | 'danger' | 'success' }) {
  const variants = {
    default: 'from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-purple-500/20',
    danger: 'from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 shadow-red-500/20',
    success: 'from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-green-500/20',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2.5 rounded-xl font-semibold text-white text-sm
                 bg-gradient-to-r ${variants[variant]}
                 transition-all duration-300 transform hover:scale-105 active:scale-95
                 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
                 shadow-lg`}
    >
      {children}
    </button>
  );
}

// Лог событий
function EventLog({ logs }: { logs: string[] }) {
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="glass-card p-4">
      <h4 className="text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
        <span>📋</span> Журнал событий
      </h4>
      <div ref={logRef} className="h-32 overflow-y-auto space-y-1 font-mono text-xs">
        {logs.map((log, i) => (
          <div key={i} className="text-gray-400 border-l-2 border-purple-500/30 pl-2 py-0.5">
            <span className="text-gray-600">[{new Date().toLocaleTimeString()}]</span> {log}
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-gray-600 italic">Нет событий...</div>
        )}
      </div>
    </div>
  );
}

// Основной компонент
export default function App() {
  const [state, setState] = useState<FurnaceState>({
    temperature: 25,
    targetTemp: 1650,
    airFlow: 0,
    fuelFlow: 0,
    meltLevel: 0,
    carbonContent: 4.2,
    stage: 'idle',
    isRunning: false,
    scrapLoaded: 0,
    pigIronLoaded: 0,
    limestoneLoaded: 0,
    oxygenFlow: 0,
    slagAmount: 0,
    elapsed: 0,
  });

  const [logs, setLogs] = useState<string[]>([]);
  const [autoMode, setAutoMode] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const addLog = useCallback((msg: string) => {
    setLogs(prev => [...prev.slice(-50), msg]);
  }, []);

  // Симуляция физики печи
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setState(prev => {
        if (!prev.isRunning && prev.stage === 'idle') return prev;

        const newState = { ...prev };
        newState.elapsed += 1;

        // Нагрев/остывание
        if (prev.fuelFlow > 0) {
          const heatGain = prev.fuelFlow * 0.8 + prev.airFlow * 0.3;
          newState.temperature = Math.min(prev.temperature + heatGain * 0.1, 1800);
        } else {
          newState.temperature = Math.max(prev.temperature - 2, 25);
        }

        // Плавление
        if (prev.temperature > 1400 && prev.scrapLoaded + prev.pigIronLoaded > 0) {
          const meltRate = (prev.temperature - 1400) * 0.002;
          newState.meltLevel = Math.min(prev.meltLevel + meltRate, 100);
        }

        // Углерод выгорает при высокой температуре и кислороде
        if (prev.temperature > 1500 && prev.oxygenFlow > 0) {
          newState.carbonContent = Math.max(prev.carbonContent - prev.oxygenFlow * 0.001, 0.05);
          newState.slagAmount = Math.min(prev.slagAmount + 0.1, 30);
        }

        return newState;
      });
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Автоматический цикл плавки
  useEffect(() => {
    if (!autoMode) return;

    const stageTimers: Record<string, number> = {
      loading: 0,
      heating: 0,
      melting: 0,
      refining: 0,
      tapping: 0,
    };

    const autoInterval = setInterval(() => {
      setState(prev => {
        if (!prev.isRunning) return prev;

        const newState = { ...prev };

        switch (prev.stage) {
          case 'idle':
            newState.stage = 'loading';
            newState.scrapLoaded = 60;
            newState.pigIronLoaded = 30;
            newState.limestoneLoaded = 10;
            addLog('📦 Автоматическая завалка шихты');
            break;

          case 'loading':
            stageTimers.loading++;
            if (stageTimers.loading > 30) {
              newState.stage = 'heating';
              newState.fuelFlow = 80;
              newState.airFlow = 70;
              addLog('🔥 Начало разогрева печи');
              stageTimers.loading = 0;
            }
            break;

          case 'heating':
            stageTimers.heating++;
            if (prev.temperature > 1400) {
              newState.stage = 'melting';
              addLog('💧 Достигнута температура плавления');
              stageTimers.heating = 0;
            }
            break;

          case 'melting':
            stageTimers.melting++;
            if (prev.meltLevel > 80) {
              newState.stage = 'refining';
              newState.oxygenFlow = 50;
              addLog('⚗️ Начало рафинирования стали');
              stageTimers.melting = 0;
            }
            break;

          case 'refining':
            stageTimers.refining++;
            if (prev.carbonContent < 0.5) {
              newState.stage = 'tapping';
              newState.oxygenFlow = 0;
              addLog('🌊 Сталь готова! Начинаем выпуск');
              stageTimers.refining = 0;
            }
            break;

          case 'tapping':
            stageTimers.tapping++;
            newState.meltLevel = Math.max(prev.meltLevel - 3, 0);
            if (prev.meltLevel <= 0) {
              newState.stage = 'idle';
              newState.isRunning = false;
              newState.fuelFlow = 0;
              newState.airFlow = 0;
              newState.carbonContent = 4.2;
              newState.slagAmount = 0;
              addLog('✅ Плавка завершена! Печь готова к новому циклу');
              stageTimers.tapping = 0;
            }
            break;
        }

        return newState;
      });
    }, 100);

    return () => clearInterval(autoInterval);
  }, [autoMode, addLog]);

  // Обработчики
  const handleStart = () => {
    setState(prev => ({ ...prev, isRunning: true }));
    addLog('▶️ Печь запущена');
  };

  const handleStop = () => {
    setState(prev => ({
      ...prev,
      isRunning: false,
      fuelFlow: 0,
      airFlow: 0,
      oxygenFlow: 0,
      stage: 'idle',
    }));
    addLog('⏹️ Печь остановлена');
  };

  const handleLoadScrap = () => {
    setState(prev => ({
      ...prev,
      scrapLoaded: Math.min(prev.scrapLoaded + 20, 100),
      stage: prev.stage === 'idle' ? 'loading' : prev.stage,
    }));
    addLog('📦 Загружен металлолом (+20%)');
  };

  const handleLoadPigIron = () => {
    setState(prev => ({
      ...prev,
      pigIronLoaded: Math.min(prev.pigIronLoaded + 15, 100),
      stage: prev.stage === 'idle' ? 'loading' : prev.stage,
    }));
    addLog('📦 Загружен чугун (+15%)');
  };

  const handleLoadLimestone = () => {
    setState(prev => ({
      ...prev,
      limestoneLoaded: Math.min(prev.limestoneLoaded + 10, 100),
    }));
    addLog('📦 Загружен известняк (+10%)');
  };

  const handleHeat = () => {
    setState(prev => ({
      ...prev,
      fuelFlow: Math.min(prev.fuelFlow + 20, 100),
      airFlow: Math.min(prev.airFlow + 15, 100),
      isRunning: true,
    }));
    addLog('🔥 Увеличена подача топлива');
  };

  const handleCool = () => {
    setState(prev => ({
      ...prev,
      fuelFlow: Math.max(prev.fuelFlow - 20, 0),
      airFlow: Math.max(prev.airFlow - 15, 0),
    }));
    addLog('❄️ Уменьшена подача топлива');
  };

  const handleOxygen = () => {
    setState(prev => ({
      ...prev,
      oxygenFlow: prev.oxygenFlow > 0 ? 0 : 50,
    }));
    addLog(state.oxygenFlow > 0 ? '💨 Продувка кислородом отключена' : '💨 Включена продувка кислородом');
  };

  const handleTap = () => {
    if (state.meltLevel > 20) {
      setState(prev => ({ ...prev, stage: 'tapping' }));
      addLog('🌊 Начат выпуск стали');
    }
  };

  const handleAutoMode = () => {
    setAutoMode(prev => !prev);
    if (!autoMode) {
      addLog('🤖 Автоматический режим ВКЛЮЧЁН');
    } else {
      addLog('👤 Автоматический режим ВЫКЛЮЧЕН');
    }
  };

  const stageInfo = STAGE_INFO[state.stage];

  return (
    <div className="gradient-bg min-h-screen">
      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏭</span>
            <div>
              <h1 className="text-xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Мартеновская печь
              </h1>
              <p className="text-xs text-gray-500">Интерактивный прототип • Симулятор плавки стали</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              state.isRunning
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
            }`}>
              {state.isRunning ? '● РАБОТАЕТ' : '○ ОСТАНОВЛЕНА'}
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${stageInfo.color} text-white`}>
              {stageInfo.emoji} {stageInfo.name}
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Левая колонка - Визуализация */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-6">
              <FurnaceSVG state={state} />
            </div>

            {/* Текущий этап */}
            <div className="glass-card p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{stageInfo.emoji}</span>
                <div>
                  <h4 className={`font-bold bg-gradient-to-r ${stageInfo.color} bg-clip-text text-transparent`}>
                    {stageInfo.name}
                  </h4>
                  <p className="text-xs text-gray-400">{stageInfo.desc}</p>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500">
                Время работы: {Math.floor(state.elapsed / 10)}с
              </div>
            </div>
          </div>

          {/* Центральная колонка - Показатели */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-lg font-bold text-gray-200 flex items-center gap-2">
              <span>📊</span> Параметры печи
            </h3>

            <Gauge value={state.temperature} max={1800} label="Температура" unit="°C" color="from-red-500 to-orange-500" icon="🌡️" />
            <Gauge value={state.meltLevel} max={100} label="Уровень расплава" unit="%" color="from-orange-500 to-yellow-500" icon="💧" />
            <Gauge value={state.carbonContent} max={4.5} label="Углерод" unit="%" color="from-purple-500 to-pink-500" icon="⚗️" />
            <Gauge value={state.fuelFlow} max={100} label="Подача топлива" unit="%" color="from-yellow-500 to-amber-500" icon="⛽" />
            <Gauge value={state.airFlow} max={100} label="Подача воздуха" unit="%" color="from-cyan-500 to-blue-500" icon="💨" />
            <Gauge value={state.oxygenFlow} max={100} label="Кислород" unit="%" color="from-green-500 to-emerald-500" icon="🫧" />
            <Gauge value={state.slagAmount} max={30} label="Шлак" unit="кг" color="from-gray-500 to-gray-400" icon="🪨" />

            {/* Загруженные материалы */}
            <div className="glass-card p-4">
              <h4 className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                <span>📦</span> Загруженная шихта
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Металлолом</span>
                  <span className="text-blue-400 font-mono">{state.scrapLoaded}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Чугун</span>
                  <span className="text-orange-400 font-mono">{state.pigIronLoaded}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Известняк</span>
                  <span className="text-gray-300 font-mono">{state.limestoneLoaded}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Правая колонка - Управление */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-lg font-bold text-gray-200 flex items-center gap-2">
              <span>🎮</span> Управление
            </h3>

            {/* Основные кнопки */}
            <div className="glass-card p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <ControlButton onClick={handleStart} disabled={state.isRunning} variant="success">
                  ▶️ Пуск
                </ControlButton>
                <ControlButton onClick={handleStop} disabled={!state.isRunning} variant="danger">
                  ⏹️ Стоп
                </ControlButton>
              </div>
              <ControlButton onClick={handleAutoMode} variant={autoMode ? 'danger' : 'default'}>
                {autoMode ? '👤 Ручной режим' : '🤖 Авто-цикл'}
              </ControlButton>
            </div>

            {/* Загрузка */}
            <div className="glass-card p-4">
              <h4 className="text-sm font-bold text-gray-300 mb-3">📦 Загрузка шихты</h4>
              <div className="space-y-2">
                <ControlButton onClick={handleLoadScrap} disabled={state.scrapLoaded >= 100}>
                  Металлолом +20%
                </ControlButton>
                <ControlButton onClick={handleLoadPigIron} disabled={state.pigIronLoaded >= 100}>
                  Чугун +15%
                </ControlButton>
                <ControlButton onClick={handleLoadLimestone} disabled={state.limestoneLoaded >= 100}>
                  Известняк +10%
                </ControlButton>
              </div>
            </div>

            {/* Температура */}
            <div className="glass-card p-4">
              <h4 className="text-sm font-bold text-gray-300 mb-3">🔥 Температурный режим</h4>
              <div className="grid grid-cols-2 gap-2">
                <ControlButton onClick={handleHeat} disabled={!state.isRunning}>
                  🔺 Нагрев
                </ControlButton>
                <ControlButton onClick={handleCool}>
                  🔻 Охлаждение
                </ControlButton>
              </div>
            </div>

            {/* Процесс */}
            <div className="glass-card p-4">
              <h4 className="text-sm font-bold text-gray-300 mb-3">⚗️ Процесс плавки</h4>
              <div className="space-y-2">
                <ControlButton onClick={handleOxygen} disabled={state.temperature < 1200}>
                  {state.oxygenFlow > 0 ? '🚫 Откл. кислород' : '💨 Продувка O₂'}
                </ControlButton>
                <ControlButton onClick={handleTap} disabled={state.meltLevel < 20} variant="success">
                  🌊 Выпуск стали
                </ControlButton>
              </div>
            </div>

            {/* Журнал */}
            <EventLog logs={logs} />
          </div>
        </div>

        {/* Информационная панель */}
        <div className="mt-8 glass-card p-6">
          <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center gap-2">
            <span>📖</span> О мартеновской печи
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-400">
            <div>
              <h4 className="text-white font-semibold mb-2">🏗️ Конструкция</h4>
              <p>Мартеновская печь — регенеративная пламенная печь для переработки чугуна и металлического лома в сталь. Состоит из рабочего пространства (ванны), свода, головок для подачи газа и воздуха, регенераторов для подогрева.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">⚙️ Процесс плавки</h4>
              <p>1. Завалка шихты → 2. Разогрев до 1400-1600°C → 3. Плавление → 4. Рафинирование (окисление примесей) → 5. Выпуск стали. Длительность плавки: 6-12 часов.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">📐 Характеристики</h4>
              <ul className="space-y-1">
                <li>• Вместимость: 100-500 тонн</li>
                <li>• Температура: до 1800°C</li>
                <li>• Топливо: мазут, природный газ</li>
                <li>• Производительность: 8-15 т/час</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 mt-8 py-6 text-center">
        <p className="text-gray-600 text-xs">
          Интерактивный прототип мартеновской печи • Симуляция для образовательных целей 🏭
        </p>
      </footer>
    </div>
  );
}
