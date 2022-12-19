import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import Titlebar from './Titlebar';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: 'ReactComponentLibrary/Titlebar',
	component: Titlebar,
	argTypes: { onClick: { action: 'clicked' } },
} as ComponentMeta<typeof Titlebar>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Titlebar> = args => <Titlebar {...args} />;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
	title: 'Hello world!',
};

export const WithActions = Template.bind({});
WithActions.args = {
	title: 'Testing Component Titlebar',
};
