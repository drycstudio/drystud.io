module.exports = {
    stories: [
        "../src/**/*.stories.mdx",
        "../src/**/*.stories.@(js|jsx|ts|tsx)",
    ],
    addons: [
        // "@storybook/addon-info",
        "@storybook/addon-links",
        // "@storybook/addon-centered/react",
        "@storybook/addon-essentials",
        "@storybook/preset-scss",
    ],
    framework: "@storybook/react",
    core: {
        builder: "webpack5",
    },
    typescript: { reactDocgen: false },
};
