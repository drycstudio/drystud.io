import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import Titlebar from './Titlebar';
import { afterEach, describe, expect, test, vi } from 'vitest';

const MOCK_TEST_TITLE = 'Hello world!';

describe('Titlebar', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test('renders the correctly with action buttons', () => {
    render(<Titlebar title={MOCK_TEST_TITLE} />);

    const expectedActionButtons = screen.getAllByRole('button');

    expect(screen.getByText(MOCK_TEST_TITLE)).toBeTruthy();
    expect(expectedActionButtons.length).toBe(3);
  });

  test('should be action buttons clickable', async () => {
    render(<Titlebar title={MOCK_TEST_TITLE} />);

    const expectedActionButtons = screen.getAllByRole('button');

    await waitFor(() => {
      expect(expectedActionButtons[0]).toBeTruthy();
      expect(expectedActionButtons[1]).toBeTruthy();
      expect(expectedActionButtons[2]).toBeTruthy();
    });

    await waitFor(() => {
      fireEvent.click(expectedActionButtons[0]);
      fireEvent.click(expectedActionButtons[1]);
      fireEvent.click(expectedActionButtons[2]);
    });
  });

  test('should be action buttons clickable with custom handlers', async () => {
    const [onMinus, onMinimizeMaximize, onClose] = [vi.fn(), vi.fn(), vi.fn()];
    render(
      <Titlebar
        title={MOCK_TEST_TITLE}
        onMinus={() => onMinus()}
        onMinimizeMaximaze={() => onMinimizeMaximize()}
        onClose={() => onClose()}
      />
    );

    const expectedActionButtons = screen.getAllByRole('button');

    await waitFor(() => {
      expect(expectedActionButtons[0]).toBeTruthy();
      expect(expectedActionButtons[1]).toBeTruthy();
      expect(expectedActionButtons[2]).toBeTruthy();
    });

    await waitFor(() => {
      fireEvent.click(expectedActionButtons[0]);
      fireEvent.click(expectedActionButtons[1]);
      fireEvent.click(expectedActionButtons[2]);
    });

    expect(onMinus).toHaveBeenCalled();
    expect(onMinimizeMaximize).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });
});
