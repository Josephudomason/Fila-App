import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { Platform, useColorScheme } from 'react-native';
import UserOnly from '../../../components/auth/UserOnly';
import { colors } from '../../../constants/colors';

const DashboardLayout = () => {

  const colorScheme = useColorScheme();
  const safeColor = colorScheme === 'light' || colorScheme === 'dark' ? colorScheme : 'light'
  const theme = colors[safeColor] ?? colors.light;

  return (
    <UserOnly>
      <Tabs
        screenOptions={{
          headerShown: false,
          animation: 'none',
          tabBarStyle: {
            backgroundColor: theme.navBackground,
            borderTopColor: theme.uiBackground,
            height: Platform.OS === 'ios' ? 86 : 74,
            paddingBottom: Platform.OS === 'ios' ? 24 : 12,
            paddingTop: 10,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          tabBarActiveTintColor: theme.iconColorFocused,
          tabBarInactiveTintColor: theme.iconColor,
        }}
      >
        <Tabs.Screen
          name='profile'
          options={{
            title: 'Profile', tabBarIcon: ({ focused }) => (
              <Ionicons
                size={24}
                name={focused ? 'person' : 'person-outline'}
                color={focused ? theme.iconColorFocused : theme.iconColor}
              />
            )
          }} />

        <Tabs.Screen
          name='books'
          options={{
            title: 'Books', tabBarIcon: ({ focused }) => (
              <Ionicons
                size={24}
                name={focused ? 'book' : 'book-outline'}
                color={focused ? theme.iconColorFocused : theme.iconColor}
              />
            )
          }} />

        <Tabs.Screen
          name='create'
          options={{
            title: 'Create', tabBarIcon: ({ focused }) => (
              <Ionicons
                size={24}
                name={focused ? 'create' : 'create-outline'}
                color={focused ? theme.iconColorFocused : theme.iconColor}
              />
            )
          }} />

        <Tabs.Screen
          name='Books/[id]'
          options={{ href: null }} />
      </Tabs>
    </UserOnly>
  )
}

export default DashboardLayout;
