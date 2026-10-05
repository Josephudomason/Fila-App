import { render } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import Home from '../src/app';

jest.mock('expo-router', () => ({
  Link: ({ children }: { children: ReactNode }) => children,
}));

jest.mock('@expo/vector-icons/Ionicons', () => 'Ionicons');

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ bottom: 0, left: 0, right: 0, top: 0 }),
}));

jest.mock('../components/ThemedLogo', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return function MockThemedLogo() {
    return React.createElement(Text, null, 'Fila logo');
  };
});

describe('<Home />', () => {
  it('renders the public landing content and auth actions', async () => {
    const { getByText } = await render(<Home />);

    getByText('Build your reading shelf');
    getByText('Track books, save notes, and keep your next great read close.');
    getByText('Log in');
    getByText('Create account');
  });
});
