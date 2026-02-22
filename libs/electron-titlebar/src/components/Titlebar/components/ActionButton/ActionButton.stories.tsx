import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { FiMinus, FiSquare, FiX, FiCopy } from 'react-icons/fi';

import { ActionButton } from './ActionButton';
import { actionButtonIconStyle } from './styles';

const meta = {
  title: 'Components/ActionButton',
  component: ActionButton,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component:
          'Window control button used in the titlebar. Comes in two variants: `default` (minimize/maximize with subtle hover) and `close` (red hover background). Renders any children — typically an icon from `react-icons`.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'radio',
      options: ['default', 'close'],
      description: 'Visual variant: `default` for minimize/maximize, `close` for the red close button.',
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler fired when the button is pressed.',
    },
    children: {
      description: 'Button content — typically an SVG icon component.',
    },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof ActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Minimize button with the minus icon. */
export const Minimize: Story = {
  args: {
    children: <FiMinus className={actionButtonIconStyle()} />,
    type: 'default',
  },
};

/** Maximize button with the square icon (window is not maximized). */
export const Maximize: Story = {
  args: {
    children: <FiSquare className={actionButtonIconStyle()} />,
    type: 'default',
  },
};

/** Restore button with the copy icon (window is maximized). */
export const Restore: Story = {
  args: {
    children: (
      <FiCopy
        className={actionButtonIconStyle()}
        style={{ transform: 'scaleX(-1)' }}
      />
    ),
    type: 'default',
  },
};

/** Close button — uses the `close` variant with red hover background. */
export const Close: Story = {
  args: {
    children: <FiX className={actionButtonIconStyle()} />,
    type: 'close',
  },
};
