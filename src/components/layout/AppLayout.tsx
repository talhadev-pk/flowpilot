import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { LayoutDashboard, Workflow, Hammer, LayoutTemplate, BarChart3, History, Blocks, Settings, ChevronLeft, Search, Bell, Sun, Moon, Menu, Home, CheckCircle2, AlertTriangle } from 'lucide-react'
import { Logo } from '../common/ui'
import { useToast } from '../common/Toast'

const nav = [
  { to:'/app', label:'Dashboard', icon:LayoutDashboard, end:true }, { to:'/app/workflows', label:'Workflows', icon:Workflow },
  { to:'/app/builder', label:'Workflow Builder', icon:Hammer }, { to:'/app/templates', label:'Templates', icon:LayoutTemplate },
  { to:'/app/analytics', label:'Analytics', icon:BarChart3 }, { to:'/app/history', label:'History', icon:History },
  { to:'/app/integrations', label:'Integrations', icon:Blocks }, { to:'/app/settings', label:'Settings', icon:Settings },
]
const notifications = [
  { icon: CheckCircle2, color:'text-emerald-500', text:'Customer Onboarding completed successfully', time:'2 min ago' },
  { icon: AlertTriangle, color:'text-amber-500', text:'Support Routing had 1 failed step (simulated)', time:'1 hr ago' },
  { icon: CheckCircle2, color:'text-emerald-500', text:'Weekly digest workflow saved', time:'Yesterday' },
]

export default function AppLayout({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) {
  const [collapsed, setCollapsed] = useState(false); const [mobile, setMobile] = useState(false)
  const [notif, setNotif] = useState(false); const [profile, setProfile] = useState(false); const [query, setQuery] = useState('')
  const loc = useLocation(); const navigate = useNavigate(); const toast = useToast()
  const notifRef = useRef<HTMLDivElement>(null)
  useEffect(() => { setMobile(false); setNotif(false); setProfile(false) }, [loc.pathname])
  useEffect(() => { const h = (e: MouseEvent) => { if (!notifRef.current?.contains(e.target as Node)) setNotif(false) }; document.addEventListener('click', h); return () => document.removeEventListener('click', h) }, [])
  const search = (e: React.FormEvent) => { e.preventDefault(); if (!query.trim()) return
    const q = query.toLowerCase()
    const target = nav.find(n => n.label.toLowerCase().includes(q))
    if (target) navigate(target.to); else if (q.includes('template')) navigate('/app/templates'); else toast(`No page matches “${query}” — try “analytics”`, 'info')
  }
  const sidebar = (onNav?: () => void) => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4"><Link to="/app"><Logo compact={collapsed} /></Link>
        <button className="hidden rounded-lg p-1.5 hover:bg-white/5 lg:block" onClick={() => setCollapsed(c=>!c)} aria-label="Collapse sidebar"><ChevronLeft size={17} className={`transition ${collapsed?'rotate-180':''}`}/></button></div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Application">
        {nav.map(({to,label,icon:Icon,end}) => <NavLink key={to} to={to} end={end} onClick={onNav} title={label} className={({isActive}) => `relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-violet-500/15 text-violet-600 dark:text-violet-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white'}`}>
          {({isActive}) => <>{isActive && <motion.span layoutId="nav-pill" className="absolute inset-y-2 left-0 w-1 rounded-full bg-gradient-to-b from-violet-500 to-cyan-400" />}<Icon size={18} className="shrink-0"/>{!collapsed && <span className="truncate">{label}</span>}</>}
        </NavLink>)}
      </nav>
      <div className="border-t border-slate-200 p-3 dark:border-white/10"><Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"><Home size={18}/>{!collapsed && 'Back to website'}</Link>
      {!collapsed && <p className="px-3 pt-2 text-[11px] leading-relaxed text-slate-400">Demo workspace · Simulated data only</p>}</div>
    </div>
  )
  return <div className="flex min-h-screen">
    <aside className={`sticky top-0 hidden h-screen shrink-0 border-r border-slate-200 bg-white transition-all duration-300 dark:border-white/10 dark:bg-[#090e1a] lg:block ${collapsed ? 'w-[72px]' : 'w-64'}`}>{sidebar()}</aside>
    <AnimatePresence>{mobile && <><motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={()=>setMobile(false)} />
      <motion.aside initial={{x:-280}} animate={{x:0}} exit={{x:-280}} transition={{type:'spring', damping:28, stiffness:260}} className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#090e1a] lg:hidden">{sidebar(()=>setMobile(false))}</motion.aside></>}</AnimatePresence>
    <div className="min-w-0 flex-1">
      <header className="glass sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200/70 px-4 dark:border-white/10 sm:px-6">
        <button className="btn-ghost !p-2.5 lg:hidden" onClick={()=>setMobile(true)} aria-label="Open navigation"><Menu size={18}/></button>
        <form onSubmit={search} className="relative hidden max-w-md flex-1 sm:block" role="search">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
          <input value={query} onChange={e=>setQuery(e.target.value)} className="input !pl-9" placeholder="Search pages… (try “analytics”)" aria-label="Search pages"/>
        </form>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={toggleTheme} className="btn-ghost !p-2.5" aria-label="Toggle theme">{theme==='dark'?<Sun size={17}/>:<Moon size={17}/>}</button>
          <div className="relative" ref={notifRef}>
            <button onClick={(e)=>{e.stopPropagation(); setNotif(o=>!o); setProfile(false)}} className="btn-ghost relative !p-2.5" aria-label="Notifications" aria-expanded={notif}><Bell size={17}/><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500"/></button>
            <AnimatePresence>{notif && <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:6}} className="card absolute right-0 top-12 z-50 w-80 p-2 shadow-2xl">
              <p className="px-2 py-1.5 text-sm font-semibold">Notifications</p>
              {notifications.map((n,i)=><div key={i} className="flex gap-3 rounded-lg px-2 py-2 text-sm hover:bg-slate-50 dark:hover:bg-white/5"><n.icon size={17} className={`mt-0.5 shrink-0 ${n.color}`}/><span>{n.text}<span className="block text-xs text-slate-400">{n.time}</span></span></div>)}
            </motion.div>}</AnimatePresence>
          </div>
          <div className="relative">
            <button onClick={()=>{setProfile(o=>!o); setNotif(false)}} className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-100 dark:hover:bg-white/5" aria-haspopup="menu" aria-expanded={profile}>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-xs font-bold text-white">AR</span>
              <span className="hidden text-left text-sm leading-tight md:block"><span className="block font-medium">Alex Rivera</span><span className="block text-xs text-slate-400">Workspace Admin</span></span>
            </button>
            <AnimatePresence>{profile && <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:6}} className="card absolute right-0 top-12 z-50 w-52 p-2 shadow-2xl" role="menu">
              <Link to="/app/settings" className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-white/5">Profile & settings</Link>
              <Link to="/app/settings" className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-white/5">Workspace preferences</Link>
              <Link to="/" className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-white/5">Sign out (demo)</Link>
            </motion.div>}</AnimatePresence>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1400px] p-4 sm:p-6"><Outlet /></main>
    </div>
  </div>
}
