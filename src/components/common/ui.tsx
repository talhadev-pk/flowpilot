import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Zap } from 'lucide-react'

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion()
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: .55, delay, ease: 'easeOut' }}>{children}</motion.div>
}
export function Logo({ compact = false }: { compact?: boolean }) {
  return <span className="inline-flex items-center gap-2 font-bold tracking-tight">
    <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-600/25"><Zap size={17} /></span>
    {!compact && <span className="text-lg">Flow<span className="text-gradient">Pilot</span></span>}
  </span>
}
export function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0); const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) {
      const start = performance.now()
      const tick = (now: number) => { const p = Math.min(1, (now-start)/1200); setVal(Math.round(to * (1-Math.pow(1-p,3)))); if (p<1) requestAnimationFrame(tick) }
      requestAnimationFrame(tick); obs.disconnect()
    }}, { threshold: .4 })
    obs.observe(el); return () => obs.disconnect()
  }, [to])
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}
export function Badge({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-600 dark:text-violet-300">{children}</span>
}
export function DemoNote({ children }: { children: ReactNode }) {
  return <p className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-200" role="note">⚠️ Demo mode — {children}</p>
}
