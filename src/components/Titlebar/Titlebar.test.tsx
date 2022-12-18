import React from 'react';
import { render } from '@testing-library/react';

import Titlebar from './Titlebar';

const MOCK_TEST_TITLE = 'Hello world!';

describe('Titlebar', () => {
	test('renders the correctly', () => {
		const { getByText } = render(<Titlebar title={MOCK_TEST_TITLE} />);

		expect(getByText(MOCK_TEST_TITLE)).toBeTruthy();
	});
});
