"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AttackEvent {
  type: string;
  ip: string;
  endpoint: string;
  payload?: string;
  ai_analysis?: string;
  timestamp: string;
}

export default function Dashboard() {
  const [events, setEvents] = useState<AttackEvent[]>([]);
  const [isCompromised, setIsCompromised] = useState(false);
  const [audio] = useState(() => typeof window !== 'undefined' ? new Audio('/alarm.ogg') : null);

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:8000/api/events");

    eventSource.onmessage = (event) => {
      const data: AttackEvent = JSON.parse(event.data);
      if (data.type === "ATTACK_DETECTED") {
        setIsCompromised(true);
        if (audio) {
          audio.currentTime = 0;
          audio.play().catch(e => console.error("Audio block:", e));
        }
        setEvents((prev) => [data, ...prev]);
      }
    };

    return () => eventSource.close();
  }, [audio]);

  return (
    <div className={`min-h-screen p-8 md:p-16 relative overflow-hidden transition-colors duration-1000 ${isCompromised ? 'bg-red-950/20' : ''}`}>
      
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-600/10 blur-[120px] pointer-events-none" />
      {isCompromised && (
        <div className="absolute inset-0 bg-red-600/5 mix-blend-overlay pointer-events-none animate-pulse" />
      )}

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-8 mb-8"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              NEON AEGIS
            </h1>
            <p className="text-zinc-400 mt-2 font-medium tracking-wide">
              Advanced Intrusion Prevention & Honeypot Monitor
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <div className={`px-6 py-3 rounded-full border shadow-lg backdrop-blur-md font-bold tracking-widest text-sm flex items-center gap-3 transition-all duration-500 ${
              isCompromised 
                ? 'bg-red-500/10 border-red-500/50 text-red-400' 
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <span className={`w-3 h-3 rounded-full ${isCompromised ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`}></span>
              {isCompromised ? 'SYSTEM COMPROMISED' : 'STATUS: SECURE'}
            </div>
          </div>
        </motion.div>

        {/* Threat Feed */}
        <div>
          <h2 className="text-xl font-bold mb-6 text-zinc-300 tracking-wider flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            LIVE THREAT FEED
          </h2>

          <div className="space-y-6">
            <AnimatePresence>
              {events.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-12 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/5 text-center text-zinc-500 font-medium"
                >
                  <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
                  Monitoring incoming traffic... No threats detected yet.
                </motion.div>
              ) : (
                events.map((ev, idx) => (
                  <motion.div 
                    key={ev.timestamp + idx}
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    className="overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-red-500/20 shadow-2xl relative"
                  >
                    {/* Left glowing edge */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 to-orange-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]" />
                    
                    <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6">
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full border border-red-500/30 uppercase tracking-wider">
                            Unauthorized Access
                          </span>
                          <span className="text-zinc-500 text-sm font-mono">{ev.timestamp}</span>
                        </div>
                        <p className="text-zinc-300 text-sm mt-3">
                          Target Endpoint: <span className="font-mono text-pink-300 bg-pink-500/10 px-2 py-0.5 rounded">{ev.endpoint}</span>
                        </p>

                        {ev.ai_analysis && (
                          <div className="mt-6 p-5 rounded-xl bg-purple-950/30 border border-purple-500/20 shadow-inner">
                            <h3 className="text-purple-300 font-bold text-sm tracking-wider mb-2 flex items-center gap-2">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 12 2.1 7.1"/><path d="M12 12l9.9 4.9"/></svg>
                              GEMINI THREAT ANALYSIS
                            </h3>
                            <p className="text-zinc-300 leading-relaxed">{ev.ai_analysis}</p>
                            <div className="mt-3 pt-3 border-t border-purple-500/10">
                              <span className="text-xs text-zinc-500 uppercase tracking-wider">Intercepted Payload:</span>
                              <p className="text-purple-200 text-xs font-mono mt-1 break-all bg-black/20 p-2 rounded">{ev.payload}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="md:w-64 shrink-0 flex flex-col items-start md:items-end justify-center border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Attacker IP</p>
                        <p className="text-xl font-mono text-white mb-4">{ev.ip}</p>
                        
                        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Defense Action</p>
                        <p className="text-sm font-bold text-red-400 flex items-center gap-2">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                          PERMANENT BAN
                        </p>
                      </div>

                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
