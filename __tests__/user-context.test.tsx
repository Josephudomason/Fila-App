import { act, render, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';

import { UserProvider } from '../contexts/UserContext';
import { useUser } from '../hooks/useUser';
import { account } from '../lib/appwrite';

jest.mock('../lib/appwrite', () => ({
  account: {
    create: jest.fn(),
    createEmailPasswordSession: jest.fn(),
    deleteSession: jest.fn(),
    get: jest.fn(),
  },
}));

jest.mock('react-native-appwrite', () => ({
  ID: {
    unique: jest.fn(() => 'generated-id'),
  },
}));

const mockAccount = jest.mocked(account);

const Consumer = () => {
  const { authChecked, login, logout, register, user } = useUser();

  return (
    <>
      <Text>{authChecked ? 'checked' : 'checking'}</Text>
      <Text>{user?.email ?? 'guest'}</Text>
      <Text onPress={() => login({ email: 'reader@example.com', password: 'secret' })}>
        login
      </Text>
      <Text onPress={() => register({ email: 'new@example.com', password: 'secret' })}>
        register
      </Text>
      <Text onPress={() => logout()}>logout</Text>
    </>
  );
};

describe('<UserProvider />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('loads the current Appwrite user on mount', async () => {
    mockAccount.get.mockResolvedValueOnce({
      $id: 'user-1',
      email: 'reader@example.com',
    });

    const { getByText } = await render(
      <UserProvider>
        <Consumer />
      </UserProvider>
    );

    await waitFor(() => getByText('checked'));
    getByText('reader@example.com');
  });

  it('logs in with email and password', async () => {
    mockAccount.get
      .mockRejectedValueOnce(new Error('No current session'))
      .mockResolvedValueOnce({
        $id: 'user-1',
        email: 'reader@example.com',
      });
    mockAccount.createEmailPasswordSession.mockResolvedValueOnce({});

    const { getByText } = await render(
      <UserProvider>
        <Consumer />
      </UserProvider>
    );

    await waitFor(() => getByText('checked'));

    await act(async () => {
      getByText('login').props.onPress();
    });

    expect(mockAccount.createEmailPasswordSession).toHaveBeenCalledWith(
      'reader@example.com',
      'secret'
    );
    await waitFor(() => getByText('reader@example.com'));
  });

  it('registers and then logs in', async () => {
    mockAccount.get
      .mockRejectedValueOnce(new Error('No current session'))
      .mockResolvedValueOnce({
        $id: 'user-2',
        email: 'new@example.com',
      });
    mockAccount.create.mockResolvedValueOnce({});
    mockAccount.createEmailPasswordSession.mockResolvedValueOnce({});

    const { getByText } = await render(
      <UserProvider>
        <Consumer />
      </UserProvider>
    );

    await waitFor(() => getByText('checked'));

    await act(async () => {
      getByText('register').props.onPress();
    });

    expect(mockAccount.create).toHaveBeenCalledWith(
      'generated-id',
      'new@example.com',
      'secret'
    );
    expect(mockAccount.createEmailPasswordSession).toHaveBeenCalledWith(
      'new@example.com',
      'secret'
    );
    await waitFor(() => getByText('new@example.com'));
  });

  it('logs out by deleting the current session', async () => {
    mockAccount.get.mockResolvedValueOnce({
      $id: 'user-1',
      email: 'reader@example.com',
    });
    mockAccount.deleteSession.mockResolvedValueOnce({});

    const { getByText } = await render(
      <UserProvider>
        <Consumer />
      </UserProvider>
    );

    await waitFor(() => getByText('reader@example.com'));

    await act(async () => {
      getByText('logout').props.onPress();
    });

    expect(mockAccount.deleteSession).toHaveBeenCalledWith('current');
    await waitFor(() => getByText('guest'));
  });
});
