import type { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  type PressableProps,
  type PressableStateCallbackType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors } from '../constants/colors';


type ThemedButtonProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle> | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>);
  children?: ReactNode;
};

const ThemedButton = ({ style, children, ...props }: ThemedButtonProps) => {
  return (
    <Pressable
      accessibilityRole="button"
      {...props}
      style={(state) => {
        const resolvedStyle = typeof style === 'function' ? style(state) : style;
        return [
          styles.btn,
          resolvedStyle,
          (state.pressed || props.disabled) && styles.pressed,
          props.disabled && styles.disabled,
        ];
      }}
    >
      {children}
    </Pressable>
  );
};

export default ThemedButton

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 5,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.55,
  }
})
