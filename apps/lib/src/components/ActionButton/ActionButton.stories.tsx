import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { FiMinus, FiSquare, FiX } from 'react-icons/fi';

import { ActionButton } from './ActionButton';
import { actionButtonIconStyle } from './styles';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'PrettierTittleBar/ActionButton',
  component: ActionButton,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: { onClick: { action: 'clicked' } },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
} satisfies Meta<typeof ActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on args: https://storybook.js.org/docs/react/writing-stories/args
export const Minimize = {
  args: {
    children: <FiMinus className={actionButtonIconStyle()} />,
  },
} satisfies Story;

export const MinimizeMaximaze = {
  args: {
    children: <FiSquare className={actionButtonIconStyle()} />,
  },
} satisfies Story;

export const Close = {
  args: {
    children: <FiX className={actionButtonIconStyle()} />,
    type: 'close',
  },
} satisfies Story;
