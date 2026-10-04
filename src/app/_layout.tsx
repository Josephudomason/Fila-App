import { Stack } from "expo-router";
import { StatusBar, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";
import { BooksProvider } from "../../contexts/BooksContext";
import { UserProvider } from "../../contexts/UserContext";
import "./global.css";


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const safeColorScheme = colorScheme === "light" || colorScheme === "dark" ? colorScheme : "light";
  const theme = colors[safeColorScheme] ?? colors.light;


  return (
    <SafeAreaProvider>
      <UserProvider>
        <BooksProvider>
        <StatusBar
          backgroundColor={theme.navBackground}
          barStyle={safeColorScheme === "dark" ? "light-content" : "dark-content"}
        />

        <Stack screenOptions={{
          headerStyle: {
            backgroundColor: theme.navBackground
          },
          headerTintColor: theme.title
        }}>
          <Stack.Screen name='index' options={{ title: 'Home' }} />

          <Stack.Screen name='(auth)' options={{ headerShown: false }} />

          <Stack.Screen name='(dashboard)' options={{ headerShown: false }} />
        </Stack>
        </BooksProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}
