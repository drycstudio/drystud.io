import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react';

import { ActionButton } from './ActionButton';

const MOCK_TESTID = 'action-button-children';

describe('ActionButton', () => {
	test('renders the correctly with all props', async () => {
		const { getByTestId } = render(
			<ActionButton
				onClick={() => {
					jest.fn();
				}}>
				<div data-testid={MOCK_TESTID}>-</div>
			</ActionButton>
		);
		const ExpectedActionButtonComponent = getByTestId(MOCK_TESTID);

		await waitFor(() => {
			expect(ExpectedActionButtonComponent).toBeTruthy();
		});

		await act(() => {
			fireEvent.click(ExpectedActionButtonComponent);
		});
	});
});
