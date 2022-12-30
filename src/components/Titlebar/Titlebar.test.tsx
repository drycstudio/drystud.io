import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react';

import Titlebar from './Titlebar';

const MOCK_TEST_TITLE = 'Hello world!';

describe('Titlebar', () => {
	test('renders the correctly', () => {
		const { getByText } = render(<Titlebar title={MOCK_TEST_TITLE} />);

		expect(getByText(MOCK_TEST_TITLE)).toBeTruthy();
	});

	test('should have action buttons', async () => {
		const { getAllByRole } = render(<Titlebar title={MOCK_TEST_TITLE} />);
		const expectedActionButtons = getAllByRole('button');

		await waitFor(() => {
			expect(expectedActionButtons.length).toBe(3);
		});
	});

	// test('should be action buttons clickable', async () => {
	// 	const { getAllByRole } = render(
	// 		<Titlebar title={MOCK_TEST_TITLE} onMinus={jest.fn()} onMinimizeMaximaze={jest.fn()} onClose={jest.fn()} />
	// 	);
	// 	const expectedActionButtons = getAllByRole('button');

	// 	await act(() => {
	// 		expectedActionButtons[0];
	// 	})
	// });
});
