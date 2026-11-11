/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gerdau: {
          DEFAULT: '#003366',
          light: '#004B87',
          dark: '#002244',
          soft: '#EEF4FA',
        },
        sider: {
          red: '#E30613',
          'red-dark': '#C00510',
          'red-soft': '#FEF0F1',
          amber: '#FFB600',
          'amber-light': '#FFC107',
          'amber-soft': '#FFF8E1',
        },
        surface: {
          base: '#FFFFFF',
          panel: '#F4F6F8',
          border: '#E0E0E0',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      keyframes: {
        dropdownEnter: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-8px) scaleY(0.96)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0) scaleY(1)',
          },
        },
        pageEnter: {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        stockPulse: {
          '0%': {
            boxShadow: '0 0 0 0 rgba(249, 115, 22, 0.7)',
            backgroundColor: '#FFEDD5',
            borderColor: '#F97316',
            transform: 'scale(1.015)',
          },
          '45%': {
            boxShadow: '0 0 0 10px rgba(249, 115, 22, 0)',
            backgroundColor: '#FFF7ED',
            borderColor: '#FB923C',
            transform: 'scale(1)',
          },
          '100%': {
            boxShadow: '0 0 0 0 rgba(249, 115, 22, 0)',
            backgroundColor: '#FFFFFF',
            borderColor: '#FED7AA',
            transform: 'scale(1)',
          },
        },
      },
      animation: {
        'dropdown-enter': 'dropdownEnter 220ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'page-enter': 'pageEnter 280ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'stock-pulse': 'stockPulse 2.4s cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

