import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#513B2C',
          light: '#6B4E3A',
          dark: '#3E2D21',
        },
        secondary: {
          DEFAULT: '#E5D3B3',
          light: '#F7F3EB',
          dark: '#C4A484',
        },
        forest: {
          DEFAULT: '#4B7F52',
          light: '#5C9963',
          dark: '#3A6340',
        },
        sky: {
          DEFAULT: '#6B9AC4',
          light: '#8AAFCF',
          dark: '#4D7BA5',
        },
        warm: {
          DEFAULT: '#D64045',
          light: '#E65A5F',
          dark: '#B73035',
        },
        text: {
          DEFAULT: '#4A4A4A',
          light: '#666666',
          lighter: '#888888',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        display: ['var(--font-poppins)'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
export default config
