/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fdf5ef",
          100: "#fbe8da",
          200: "#f7ceb1",
          300: "#f2b084",
          400: "#ea8b57",
          500: "#dd6f35",
          600: "#c75d28",
          700: "#a54823",
          800: "#833a22",
          900: "#6a311f",
        },
        moss: {
          500: "#3c6658",
          600: "#2e5146",
          700: "#223f36",
        },
        ink: "#1f2937",
      },
      boxShadow: {
        float: "0 24px 60px rgba(17, 24, 39, 0.12)",
      },
      backgroundImage: {
        "mesh-warm":
          "radial-gradient(circle at top left, rgba(221, 111, 53, 0.18), transparent 30%), radial-gradient(circle at top right, rgba(60, 102, 88, 0.16), transparent 28%), linear-gradient(135deg, rgba(255,255,255,0.88), rgba(249,245,240,0.94))",
      },
    },
  },
  plugins: [],
};
