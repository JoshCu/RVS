/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",

        // Or if using `src` directory:
        "./src/**/*.{js,ts,jsx,tsx}",
        "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        fontFamily: {
            sans: ["Open Sans", "sans-serif"],
        },
        extend: {
            height: {
                "1/20": "5%",
                "19/20": "95%",
            },
        },
        screens: {
            laptop: "1024px",
            desktop: "1280px",
        },
    },
    plugins: [],
};
