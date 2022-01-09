import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Titlebar from "./Titlebar";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "ReactComponentLibrary/Titlebar",
    component: Titlebar,
} as ComponentMeta<typeof Titlebar>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Titlebar> = (args) => <Titlebar {...args} />;

export const HelloWorld = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
HelloWorld.args = {
    title: "Hello world!",
};

export const ClickMe = Template.bind({});
ClickMe.args = {
    title: "Testing Component Titlebar",
};