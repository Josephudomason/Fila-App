import { ActivityIndicator, useColorScheme } from "react-native";
import { colors } from "../constants/colors";
import ThemedView from "./ThemedView";

const ThemedLoader = () => {
  const colorScheme = useColorScheme();
  const safeColorTheme = colorScheme === 'light' || colorScheme === 'dark' ? colorScheme : 'light';
  const theme = colors[safeColorTheme] ?? colors.light;


  return (
    <ThemedView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size={'large'} color={theme.text} />
    </ThemedView>
  )
}


export default ThemedLoader;