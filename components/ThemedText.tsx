import { Text, useColorScheme, type StyleProp, type TextProps, type TextStyle } from 'react-native';
import { colors } from '../constants/colors';

interface ThemedTextProps extends TextProps {
  style?: StyleProp<TextStyle>;
  title?: boolean;
  inverse?: boolean;
}

const ThemedText = ({ style, title = false, inverse = false, ...props }: ThemedTextProps) => {

  const colorScheme = useColorScheme();
  const safeColorTheme = colorScheme === 'light' || colorScheme === 'dark' ? colorScheme : 'light';
  const theme = colors[safeColorTheme] ?? colors.light;

  const textColor = inverse ? '#fff' : title ? theme.title : theme.text;

  return <Text style={[{ color: textColor }, style]} {...props} />;
};

export default ThemedText;

