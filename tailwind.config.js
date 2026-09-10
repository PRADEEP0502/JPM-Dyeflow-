/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"SFMono-Regular"', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      colors: {
        industrial: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        jpm: {
          navy: '#0f2438',
          slate: '#243447',
          steel: '#3d5265',
          border: '#e1e7ec',
          surface: '#f4f6f8',
          card: '#ffffff',
          accent: '#0284c7', // industrial cyan-blue
          accentHover: '#0369a1',
          teal: '#0d9488',
          amber: '#d97706',
          emerald: '#15803d',
          rose: '#be123c',
        }
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px 0 rgba(15, 36, 56, 0.06), 0 1px 2px -1px rgba(15, 36, 56, 0.04)',
        'elevated': '0 4px 12px -2px rgba(15, 36, 56, 0.08), 0 2px 6px -2px rgba(15, 36, 56, 0.04)',
        'modal': '0 20px 25px -5px rgba(15, 36, 56, 0.15), 0 8px 10px -6px rgba(15, 36, 56, 0.08)',
      }
    },
  },
  plugins: [],
}
