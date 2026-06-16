/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#071A2E',
        'navy-deep': '#040F1C',
        'navy-panel': '#0C2740',
        blue: '#00B7FF',
        green: '#7CFF4F',
        mist: '#8FA6BC',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(90deg, #00B7FF 0%, #7CFF4F 100%)',
        'brand-gradient-radial': 'radial-gradient(circle at center, #00B7FF 0%, #7CFF4F 100%)',
      },
      boxShadow: {
        'glow-blue': '0 0 40px rgba(0,183,255,0.25)',
        'glow-green': '0 0 40px rgba(124,255,79,0.25)',
      },
      animation: {
        'fade-up': 'fade-up 0.9s cubic-bezier(0.22,1,0.36,1) both',
        'fade-down': 'fade-down 0.7s cubic-bezier(0.22,1,0.36,1) both',
        'rise': 'rise 1.1s cubic-bezier(0.22,1,0.36,1) both',
        'pulse-slow': 'pulse-slow 3.5s ease-in-out infinite',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(24px)', filter: 'blur(6px)' },
          to: { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' },
        },
        'fade-down': {
          from: { opacity: '0', transform: 'translateY(-16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        rise: {
          from: { opacity: '0', transform: 'translateY(48px) scale(0.97)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
