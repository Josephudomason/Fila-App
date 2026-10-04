import { TextInput, TextInputProps, useColorScheme, type StyleProp, type TextStyle } from 'react-native';
import { colors } from '../constants/colors';


interface ThemedTextInputProps extends TextInputProps {
  style?: StyleProp<TextStyle>;
}

const ThemedTextInput = ({ style, ...props }: ThemedTextInputProps) => {
  const colorScheme = useColorScheme();
  const safeColorTheme = colorScheme === 'light' || colorScheme === 'dark' ? colorScheme : 'light';
  const theme = colors[safeColorTheme] ?? colors.light;

  return (
    <TextInput
      placeholderTextColor={theme.iconColor}
      cursorColor={theme.text}
      selectionColor={theme.text}
      style={[{
        backgroundColor: theme.uiBackground,
        color: theme.text,
        padding: 20,
        borderRadius: 6
      }, style]}
      {...props}
    />
  )
}

export default ThemedTextInput;
