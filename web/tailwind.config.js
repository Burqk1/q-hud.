/* eslint-disable no-undef */
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideIn: {
          '0%': { transform: 'scale(0.95) translateY(-10px)', opacity: '0' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'scale(1) translateY(0)', opacity: '1' },
          '100%': { transform: 'scale(0.95) translateY(-10px)', opacity: '0' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        zoomIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        zoomOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.8)', opacity: '0' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out forwards',
        fadeOut: 'fadeOut 0.3s ease-out forwards',
        slideIn: 'slideIn 0.3s ease-out forwards',
        slideOut: 'slideOut 0.3s ease-out forwards',
        slideInRight: 'slideInRight 0.4s ease-out forwards',
        slideOutRight: 'slideOutRight 0.4s ease-out forwards',
        zoomIn: 'zoomIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        zoomOut: 'zoomOut 0.3s ease-out forwards',
      },
      textShadow: {
        sm: "0 1px 2px var(--tw-shadow-color)",
        DEFAULT: "0 2px 4px var(--tw-shadow-color)",
        lg: "0 8px 16px var(--tw-shadow-color)",
      },
      fontFamily: {
        geist: [
          "Geist",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        roboto: ["Roboto", "sans-serif"],
        oswald: ["Oswald", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      screens: {
        1920: "1920px",
        "2k": "2560px",
        "4k": "3840px",
      },
      colors: {
        primary: "#023d57",
        border: "#434346",
        secondaryBorder: "#646260",
        gradientDark: {
          from: "#3c3a3c7a",
          via: "#3c3a3cc7",
          to: "#3c3a3c7a",
        },
        gradientMuted: {
          from: "#5a585662",
          via: "#5a58569f",
          to: "#5a585662",
        },
      },
    },
  },
  plugins: [],
};
