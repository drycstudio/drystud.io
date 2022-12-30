import { FiMinus, FiSquare, FiX } from 'react-icons/fi';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ActionButton } from './ActionButton';
import { actionButtonIconStyle } from './styles';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: 'ReactComponentLibrary/ActionButton',
	component: ActionButton,
	argTypes: { onClick: { action: 'clicked' } },
	parameters: {
		layout: 'centered',
	},
} as ComponentMeta<typeof ActionButton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ActionButton> = args => <ActionButton {...args} />;

export const Minimize = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Minimize.args = {
	children: <FiMinus className={actionButtonIconStyle()} />,
};

export const MinimizeMaximaze = Template.bind({});
MinimizeMaximaze.args = {
	children: <FiSquare className={actionButtonIconStyle()} />,
};

export const Close = Template.bind({});
Close.args = {
	children: <FiX className={actionButtonIconStyle()} />,
	type: 'close',
};
