import type { Template } from '../../types'

export function templateToFlow(t: Template) {
  const labels = [t.trigger, ...t.steps]
  const nodes = labels.map((label, i) => ({
    id: `n${i+1}`,
    type: 'flowNode',
    position: { x: 80 + i * 230, y: 160 },
    data: { label, kind: i === 0 ? 'trigger' : i === labels.length - 1 ? 'end' : 'action', description: i === 0 ? 'Trigger' : 'Simulated step', status: 'idle' },
  }))
  const edges = labels.slice(0, -1).map((_, i) => ({ id: `e${i+1}`, source: `n${i+1}`, target: `n${i+2}`, animated: true }))
  return { nodes, edges }
}
export const defaultFlow = () => templateToFlow({
  id: 'default', name: 'Customer Onboarding', description: '', category: '', runs: '', accent: '', timeSaved: '',
  trigger: 'New customer registration',
  steps: ['Validate customer information', 'Send welcome email (simulated)', 'Add customer to CRM (simulated)', 'Notify sales team (simulated)', 'Complete execution'],
})
