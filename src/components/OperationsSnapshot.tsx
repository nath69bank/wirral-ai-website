import {
  PanelLeft,
  ChevronLeft,
  ChevronRight,
  Monitor,
  RotateCw,
  Share2,
  Copy,
  Inbox,
  GitBranch,
  Zap,
  BarChart3,
  CheckCircle2,
} from 'lucide-react'
import ScaledMockup from './ScaledMockup'
import wirralW from '../assets/wirral-w.webp'

const stats = [
  { label: 'LEADS CAPTURED', value: '47', sub: 'This week' },
  { label: 'AVG RESPONSE TIME', value: '38s', sub: 'First reply' },
  { label: 'BOOKED APPOINTMENTS', value: '12', sub: 'This week' },
  { label: 'TASKS AUTOMATED', value: '163', sub: 'This week' },
]

const pipeline = [
  { stage: 'New', count: 9, color: 'bg-blue' },
  { stage: 'Contacted', count: 14, color: 'bg-[#5FD1FF]' },
  { stage: 'Booked', count: 12, color: 'bg-[#A8FF7E]' },
  { stage: 'Won', count: 8, color: 'bg-green' },
]

const feed = [
  { text: 'Follow-up sent to a new enquiry', time: '2 min ago' },
  { text: 'Review request sent after appointment', time: '14 min ago' },
  { text: 'Booking confirmed and added to calendar', time: '26 min ago' },
  { text: 'Quote follow-up reminder triggered', time: '41 min ago' },
]

const navItems = [
  { label: 'Inbox', icon: Inbox },
  { label: 'Pipeline', icon: GitBranch },
  { label: 'Automations', icon: Zap },
  { label: 'Reports', icon: BarChart3 },
]

export default function OperationsSnapshot() {
  return (
    <ScaledMockup designWidth={896} className="w-full">
      <div className="rounded-t-2xl overflow-hidden bg-[#0A2238] shadow-[0_-20px_80px_rgba(0,0,0,0.45)] ring-1 ring-white/10 text-left">
        {/* Title bar */}
        <div className="flex items-center gap-3 bg-[#0C2B45] border-b border-white/5 px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#febc2e' }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }} />
          </div>
          <PanelLeft className="w-3.5 h-3.5 text-white/40" />
          <ChevronLeft className="w-3.5 h-3.5 text-white/40" />
          <ChevronRight className="w-3.5 h-3.5 text-white/25" />
          <div className="flex-1 flex items-center justify-center gap-1.5 bg-[#0A2238] rounded-md px-6 py-1 text-[10px] text-white/60">
            <Monitor className="w-3 h-3" />
            wirral.ai/operations
          </div>
          <RotateCw className="w-3.5 h-3.5 text-white/40" />
          <Share2 className="w-3.5 h-3.5 text-white/40" />
          <Copy className="w-3.5 h-3.5 text-white/40" />
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-[22%] border-r border-white/5 bg-[#0A2238] px-3 py-3.5">
            <div className="flex items-center gap-2 mb-5 px-1">
              <img src={wirralW} alt="" className="w-4 h-4 object-contain" />
              <span className="text-[10px] font-semibold text-white/70 tracking-wide">WIRRAL AI</span>
            </div>
            <nav className="space-y-1">
              {navItems.map((item, i) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[10px] ${
                    i === 1 ? 'bg-white/[0.06] text-white/90' : 'text-white/55'
                  }`}
                >
                  <item.icon className="w-3 h-3" />
                  {item.label}
                </div>
              ))}
            </nav>
          </div>

          {/* Main */}
          <div className="flex-1 px-5 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-white">This Week</p>
                <p className="text-[10px] text-white/45">Live operations overview</p>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-white/[0.06] px-2.5 py-1 text-[10px] text-green">
                <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse-slow" />
                Live
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 divide-x divide-white/5 rounded-xl bg-white/[0.03] ring-1 ring-white/5 mb-1.5">
              {stats.map((s) => (
                <div key={s.label} className="px-3.5 py-3">
                  <p className="text-lg font-display font-medium text-white">{s.value}</p>
                  <p className="text-[8px] tracking-wider text-white/35 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
            <p className="text-[8px] text-white/25 mb-4">Example data, shown for illustration</p>

            {/* Pipeline */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {pipeline.map((p) => (
                <div key={p.stage} className="rounded-lg bg-white/[0.03] ring-1 ring-white/5 px-3 py-2.5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${p.color}`} />
                    <span className="text-[9px] text-white/55">{p.stage}</span>
                  </div>
                  <p className="text-sm font-medium text-white">{p.count}</p>
                </div>
              ))}
            </div>

            {/* Automation feed */}
            <div className="rounded-lg bg-white/[0.03] ring-1 ring-white/5 divide-y divide-white/5">
              {feed.map((f) => (
                <div key={f.text} className="flex items-center gap-2 px-3.5 py-2">
                  <CheckCircle2 className="w-3 h-3 text-green shrink-0" />
                  <span className="text-[10px] text-white/70 flex-1">{f.text}</span>
                  <span className="text-[9px] text-white/30">{f.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ScaledMockup>
  )
}
