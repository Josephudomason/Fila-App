import type { ReactNode } from 'react';
import { StyleSheet, useColorScheme, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { colors } from '../constants/colors';

type ThemedCardProps = ViewProps & {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};


const ThemedCard = ({ style, children, ...props }: ThemedCardProps) => {
  const colorTheme = useColorScheme();
  const safeColorTheme = colorTheme === 'light' || colorTheme === 'dark' ? colorTheme : 'light';
  const theme = colors[safeColorTheme] ?? colors.light;
  return (
    <View style={[{ backgroundColor: theme.uiBackground }, styles.card, style]} {...props}>
      {children}
    </View>
  )
}

export default ThemedCard

const styles = StyleSheet.create({
  card: {
    borderRadius: 5,
    padding: 20
  }
})
