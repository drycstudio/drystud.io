module.exports = {
    content: ["./src/**/*.{html,js,tsx}"],
    theme: {
        screens: {
            sm: "480px",
            md: "768px",
            lg: "976px",
            xl: "1440px",
        },
        colors: {
            white: "#ffffff",
            blue: "#1fb6ff",
            pink: "#ff49db",
            orange: "#ff7849",
            green: "#13ce66",
            "gray-dark": "#273444",
            gray: "#8492a6",
            "gray-light": "#d3dce6",
            "default-dark": "#1B1B2F",
            "default-soft-dark": "#162447",
            "default-light-dark": "#1F4068",
            "default-dark-salmon": "#810015",
            "default-salmon": "#E43F5A",
        },
        extend: {},
    },
    plugins: [],
    future: {
        removeDeprecatedGapUtilities: true,
        purgeLayersByDefault: true,
    },
};
