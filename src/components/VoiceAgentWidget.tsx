import { useEffect, useRef, useState } from 'react'
import { Mic, MicOff, Phone } from 'lucide-react'

// ElevenLabs Conversational AI widget
// Set VITE_ELEVENLABS_AGENT_ID in Vercel environment variables to activate
const AGENT_ID = import.meta.env.VITE_ELEVENLABS_AGENT_ID as string | undefined

type CallState = 'idle' | 'connecting' | 'active' | 'ended'

export default function VoiceAgentWidget() {
  const [callState, setCallState] = useState<CallState>('idle')
  const [showTooltip, setShowTooltip] = useState(false)
  const widgetRef = useRef<HTMLDivElement>(null)

  // If no agent ID, render a "coming soon" demo button
  if (!AGENT_ID) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="relative group">
          <button
            className="relative w-16 h-16 rounded-full bg-brand-gradient flex items-center justify-center shadow-glow-green hover:scale-105 transition-transform cursor-pointer"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => setShowTooltip(true)}
            aria-label="Talk to our AI — coming soon"
          >
            {/* Pulse rings */}
            <span className="absolute inset-0 rounded-full bg-brand-gradient opacity-30 animate-ping" />
            <span className="absolute inset-0 rounded-full bg-brand-gradient opacity-15 animate-ping [animation-delay:300ms]" />
            <Mic className="w-6 h-6 text-navy relative z-10" strokeWidth={2} />
          </button>

          {showTooltip && (
            <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 whitespace-nowrap glass-panel-strong rounded-xl px-4 py-2.5 text-xs text-white shadow-xl animate-fade-up">
              Voice agent coming soon — <span className="text-green">chat with us instead</span>
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white/10" />
            </div>
          )}
        </div>
        <p className="text-mist text-[11px] font-mono uppercase tracking-widest">Talk to our AI</p>
      </div>
    )
  }

  return (
    <div ref={widgetRef} className="flex flex-col items-center gap-2">
      <ElevenLabsCall
        agentId={AGENT_ID}
        callState={callState}
        setCallState={setCallState}
      />
      <p className="text-mist text-[11px] font-mono uppercase tracking-widest">
        {callState === 'idle' && 'Talk to our AI'}
        {callState === 'connecting' && 'Connecting...'}
        {callState === 'active' && 'Listening...'}
        {callState === 'ended' && 'Call ended'}
      </p>
    </div>
  )
}

function ElevenLabsCall({
  agentId,
  callState,
  setCallState,
}: {
  agentId: string
  callState: CallState
  setCallState: (s: CallState) => void
}) {
  const convRef = useRef<any>(null)

  async function startCall() {
    if (callState !== 'idle') return
    setCallState('connecting')
    try {
      // Dynamically import ElevenLabs SDK to avoid SSR issues
      const { Conversation } = await import('@11labs/client')
      const conv = await Conversation.startSession({
        agentId,
        connectionType: 'webrtc',
        onConnect: () => setCallState('active'),
        onDisconnect: () => {
          setCallState('ended')
          setTimeout(() => setCallState('idle'), 2000)
        },
        onError: () => {
          setCallState('ended')
          setTimeout(() => setCallState('idle'), 2000)
        },
      })
      convRef.current = conv
    } catch {
      setCallState('idle')
    }
  }

  async function endCall() {
    if (convRef.current) {
      await convRef.current.endSession()
      convRef.current = null
    }
    setCallState('ended')
    setTimeout(() => setCallState('idle'), 2000)
  }

  const isActive = callState === 'active'
  const isConnecting = callState === 'connecting'

  return (
    <button
      onClick={isActive ? endCall : startCall}
      disabled={isConnecting || callState === 'ended'}
      className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-glow-green hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed ${
        isActive
          ? 'bg-red-500 hover:bg-red-600'
          : 'bg-brand-gradient'
      }`}
      aria-label={isActive ? 'End call' : 'Start voice call'}
    >
      {!isActive && (
        <>
          <span className="absolute inset-0 rounded-full bg-brand-gradient opacity-30 animate-ping" />
          <span className="absolute inset-0 rounded-full bg-brand-gradient opacity-15 animate-ping [animation-delay:300ms]" />
        </>
      )}
      {isActive && (
        <span className="absolute inset-0 rounded-full bg-red-500 opacity-40 animate-ping" />
      )}
      {isConnecting ? (
        <span className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-navy rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-1.5 h-1.5 bg-navy rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 bg-navy rounded-full animate-bounce [animation-delay:300ms]" />
        </span>
      ) : isActive ? (
        <Phone className="w-6 h-6 text-white relative z-10" strokeWidth={2} />
      ) : (
        <Mic className="w-6 h-6 text-navy relative z-10" strokeWidth={2} />
      )}
    </button>
  )
}
