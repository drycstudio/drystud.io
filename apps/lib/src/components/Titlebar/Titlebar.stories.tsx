import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import Titlebar from './Titlebar';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'PrettierTittleBar/Titlebar',
  component: Titlebar,
  tags: ['autodocs'],
  argTypes: {
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    onMinus: { action: 'onMinus clicked' },
    onMinimizeMaximaze: { action: 'onMinimizeMaximaze clicked' },
    onClose: { action: 'onClose clicked' },
  },
  args: {
    onMinus: fn(),
    onMinimizeMaximaze: fn(),
    onClose: fn(),
  },
} satisfies Meta<typeof Titlebar>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on args: https://storybook.js.org/docs/react/writing-stories/args
export const Default = {
  args: {
    title: 'Hello world!',
  },
} satisfies Story;

export const Small = {
  args: {
    title: 'Hello world!',
    size: 'small',
  },
} satisfies Story;

export const WithActions = {
  args: {
    title: 'Testing Component Titlebar',
  },
} satisfies Story;
