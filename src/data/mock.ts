import type { Template, Execution, WorkflowItem, Integration } from '../types'

export const templates: Template[] = [
  { id:'customer-onboarding', name:'New Customer Onboarding', description:'Welcome, verify and provision every new customer automatically.', category:'Sales & CRM', trigger:'New customer registration', steps:['Validate customer information','Send welcome email (simulated)','Add customer to CRM (simulated)','Notify sales team (simulated)','Complete execution'], timeSaved:'~4 hrs / week (illustrative)', runs:'1,240', accent:'from-violet-500 to-indigo-500' },
  { id:'lead-followup', name:'Lead Follow-Up Sequence', description:'Respond to new leads in minutes with a timed follow-up sequence.', category:'Marketing', trigger:'New lead captured', steps:['Score the lead','Send intro email (simulated)','Wait 2 days','Send follow-up (simulated)','Create sales task'], timeSaved:'~6 hrs / week (illustrative)', runs:'986', accent:'from-cyan-500 to-blue-500' },
  { id:'invoice-reminder', name:'Invoice Reminder', description:'Chase overdue invoices politely and consistently, automatically.', category:'Finance', trigger:'Invoice becomes overdue', steps:['Check payment status','Send reminder email (simulated)','Wait 3 days','Escalate to finance (simulated)','Log outcome'], timeSaved:'~3 hrs / week (illustrative)', runs:'754', accent:'from-emerald-500 to-teal-500' },
  { id:'support-routing', name:'Customer Support Routing', description:'Classify tickets and route them to the right team instantly.', category:'Support', trigger:'New support ticket', steps:['Classify ticket topic','Check priority','Assign to team (simulated)','Send acknowledgement (simulated)','Set SLA timer'], timeSaved:'~8 hrs / week (illustrative)', runs:'2,103', accent:'from-amber-500 to-orange-500' },
  { id:'employee-onboarding', name:'Employee Onboarding', description:'Provision accounts, schedule training and welcome new hires.', category:'People Ops', trigger:'New employee added', steps:['Create accounts (simulated)','Send welcome pack (simulated)','Schedule training','Assign mentor','Notify manager (simulated)'], timeSaved:'~5 hrs / hire (illustrative)', runs:'312', accent:'from-pink-500 to-rose-500' },
  { id:'order-processing', name:'Order Processing', description:'From checkout to fulfilment notification without manual touch.', category:'E-commerce', trigger:'New order placed', steps:['Validate payment','Reserve inventory','Create fulfilment task','Send confirmation (simulated)','Update order status'], timeSaved:'~10 hrs / week (illustrative)', runs:'3,480', accent:'from-sky-500 to-violet-500' },
]

export const workflows: WorkflowItem[] = [
  { id:'w1', name:'Customer Onboarding', status:'active', runs:1240, success:98.2, updated:'2 min ago', trigger:'New registration' },
  { id:'w2', name:'Lead Follow-Up', status:'active', runs:986, success:96.4, updated:'14 min ago', trigger:'Form submit' },
  { id:'w3', name:'Invoice Reminders', status:'active', runs:754, success:99.1, updated:'1 hr ago', trigger:'Invoice overdue' },
  { id:'w4', name:'Support Routing', status:'paused', runs:2103, success:94.8, updated:'3 hrs ago', trigger:'New ticket' },
  { id:'w5', name:'Order Processing', status:'active', runs:3480, success:97.6, updated:'Yesterday', trigger:'New order' },
  { id:'w6', name:'Weekly Report Digest', status:'draft', runs:0, success:0, updated:'2 days ago', trigger:'Schedule · Mon 9am' },
]

export const executions: Execution[] = Array.from({length:24},(_,i)=>({
  id:`EXE-${8420-i}`, workflow: workflows[i%5].name, status: i%9===4 ? 'failed' : 'success',
  started: `${i+1}h ago`, duration: `${(1.2+ (i%7)*0.7).toFixed(1)}s`, steps: 4+(i%3),
}))

// Deterministic 30-day series — analytics calculations derive from this data.
export const series30 = Array.from({length:30},(_,i)=>{
  const total = 120 + Math.round(60*Math.sin(i/4.5) + (i*3.1) + (i%5)*9)
  const failed = Math.max(2, Math.round(total * (0.02 + ((i*7)%5)/100)))
  return { day:`Day ${i+1}`, label:`Oct ${i+1}`, total, success: total-failed, failed }
})
export const series7 = series30.slice(-7)

export const integrations: Integration[] = [
  { id:'gmail', name:'Gmail', category:'Communication', description:'Send and trigger on email (demo).', icon:'✉️', popular:true },
  { id:'sheets', name:'Google Sheets', category:'Productivity', description:'Read and append spreadsheet rows (demo).', icon:'📊', popular:true },
  { id:'Slack', name:'Slack', category:'Communication', description:'Post messages to channels (demo).', icon:'💬', popular:true },
  { id:'discord', name:'Discord', category:'Communication', description:'Send server notifications (demo).', icon:'🎮' },
  { id:'notion', name:'Notion', category:'Productivity', description:'Create and update pages (demo).', icon:'📝', popular:true },
  { id:'trello', name:'Trello', category:'Project Management', description:'Create and move cards (demo).', icon:'🗂️' },
  { id:'github', name:'GitHub', category:'Developer', description:'React to issues and pull requests (demo).', icon:'🐙', popular:true },
  { id:'webhooks', name:'Webhooks', category:'Developer', description:'Send and receive HTTP webhooks (demo).', icon:'🔗', popular:true },
]
export const categories = ['All','Sales & CRM','Marketing','Finance','Support','People Ops','E-commerce']
