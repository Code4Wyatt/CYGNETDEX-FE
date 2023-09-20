import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Swap from '../Swap';
import getAccountInfo from 'src/api/getAccountInfo';
import { useSelector } from 'react-redux';

jest.mock('react-redux', () => ({
  useSelector: jest.fn()
}));

jest.mock('src/api/getAccountInfo', () => jest.fn());

describe('Swap component', () => {
  beforeEach(() => {
    useSelector.mockImplementation(callback => {
      return callback({ currentUser: { user: [{ account: 'testAccount' }] } });
    });
    getAccountInfo.mockResolvedValue({ data: 'testData' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render tradeBoxContainer', () => {
    render(<Swap />);
    const tradeBoxContainer = screen.getByTestId('tradeBoxContainer');
    expect(tradeBoxContainer).toBeInTheDocument();
  });

  it('should fetch account info on render', async () => {
    render(<Swap />);
    await waitFor(() => expect(getAccountInfo).toHaveBeenCalledTimes(1));
  });
});