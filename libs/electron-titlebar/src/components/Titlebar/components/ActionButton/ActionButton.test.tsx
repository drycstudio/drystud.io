import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { ActionButton } from './ActionButton';

describe('ActionButton', () => {
  test('renders children correctly', () => {
    render(
      <ActionButton onClick={() => {}}>
        <span data-testid="child">icon</span>
      </ActionButton>,
    );
    expect(screen.getByTestId('child')).toBeTruthy();
  });

  test('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(
      <ActionButton onClick={onClick}>
        <span>icon</span>
      </ActionButton>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  test('renders with default type', () => {
    const { container } = render(
      <ActionButton onClick={() => {}}>
        <span>icon</span>
      </ActionButton>,
    );
    const button = container.querySelector('button');
    expect(button).toBeTruthy();
  });

  test('renders with close type', () => {
    const { container } = render(
      <ActionButton type="close" onClick={() => {}}>
        <span>icon</span>
      </ActionButton>,
    );
    const button = container.querySelector('button');
    expect(button).toBeTruthy();
  });
});
