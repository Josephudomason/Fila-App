import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

import GuestOnly from '../components/auth/GuestOnly';
import UserOnly from '../components/auth/UserOnly';
import { useUser } from '../hooks/useUser';

jest.mock('../hooks/useUser', () => ({
  useUser: jest.fn(),
}));

jest.mock('expo-router', () => {
  const React = require('react');
  const { Text: MockText } = require('react-native');

  return {
    Redirect: ({ href }: { href: string }) => (
      React.createElement(MockText, null, `Redirect: ${href}`)
    ),
  };
});

const mockUseUser = jest.mocked(useUser);

describe('auth route guards', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders protected children for authenticated users', async () => {
    mockUseUser.mockReturnValue({
      authChecked: true,
      user: { $id: 'user-1' },
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
    } as ReturnType<typeof useUser>);

    const { getByText } = await render(
      <UserOnly>
        <Text>Protected content</Text>
      </UserOnly>
    );

    getByText('Protected content');
  });

  it('redirects guests away from protected routes', async () => {
    mockUseUser.mockReturnValue({
      authChecked: true,
      user: null,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
    } as ReturnType<typeof useUser>);

    const { getByText } = await render(
      <UserOnly>
        <Text>Protected content</Text>
      </UserOnly>
    );

    getByText('Redirect: /login');
  });

  it('redirects authenticated users away from guest-only routes', async () => {
    mockUseUser.mockReturnValue({
      authChecked: true,
      user: { $id: 'user-1' },
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
    } as ReturnType<typeof useUser>);

    const { getByText } = await render(
      <GuestOnly>
        <Text>Guest content</Text>
      </GuestOnly>
    );

    getByText('Redirect: /profile');
  });
});
