import type { ReactNode } from 'react';
import { useColorScheme, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';

type ThemedViewProps = ViewProps & {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  safe?: boolean;
};

const ThemedView = ({ style, safe = false, children, ...props }: ThemedViewProps) => {
  const colorTheme = useColorScheme();
  const safeColorTheme = colorTheme === 'light' || colorTheme === 'dark' ? colorTheme : 'light';
  const theme = colors[safeColorTheme] ?? colors.light;

  const insets = useSafeAreaInsets();

  if (!safe) return (
    <View
      style={[{ backgroundColor: theme.background, }, style]}
      {...props}
    >
      {children}
    </View>
  );



  return (
    <View
      style={[{
        backgroundColor: theme.background,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      },
        style
      ]}
      {...props}
    >
      {children}
    </View>
  )
};

export default ThemedView;
