import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, XCircle, Info } from 'lucide-react'

type Toast = { id: number; msg: string; kind: 'success'|'error'|'info' }
const Ctx = createContext<(msg: string, kind?: Toast['kind']) => void>(() => {})
export const useToast = () => useContext(Ctx)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const push = useCallback((msg: string, kind: Toast['kind'] = 'success') => {
    const id = Date.now() + Math.random()
    setToasts(t => [...t, { id, msg, kind }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3600)
  }, [])
  return <Ctx.Provider value={push}>{children}
    <div className="fixed bottom-4 right-4 z-[100] flex w-[min(92vw,360px)] flex-col gap-2" aria-live="polite">
      <AnimatePresence>{toasts.map(t => (
        <motion.div key={t.id} initial={{opacity:0, x:40}} animate={{opacity:1, x:0}} exit={{opacity:0, x:40}} className="card flex items-start gap-3 p-3.5 text-sm shadow-xl">
          {t.kind==='success' ? <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-500" size={18}/> : t.kind==='error' ? <XCircle className="mt-0.5 shrink-0 text-rose-500" size={18}/> : <Info className="mt-0.5 shrink-0 text-cyan-500" size={18}/>}
          <span>{t.msg}</span>
        </motion.div>))}
      </AnimatePresence>
    </div>
  </Ctx.Provider>
}
