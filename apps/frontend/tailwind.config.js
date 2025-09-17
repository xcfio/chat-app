// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
    ],
    theme: {
        extend: {
            animation: {
                "fade-in-up": "fadeInUp 0.3s ease-out"
            }
        }
    },
    plugins: [],
    corePlugins: {
        preflight: false // Disable Tailwind's base styles to avoid conflicts with Mantine
    }
}

// postcss.config.js
module.exports = {
    plugins: {
        tailwindcss: {},
        autoprefixer: {}
    }
}
