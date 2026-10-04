import {
  Image,
  StyleSheet,
  useColorScheme,
  type ImageProps,
  type ImageStyle,
  type StyleProp,
} from 'react-native';
import DarkImg from '../assets/images/Fila-Dark.png';
import img from '../assets/images/Fila-Light.png';

type ThemedLogoProps = Omit<ImageProps, 'source' | 'style'> & {
  style?: StyleProp<ImageStyle>;
};

const ThemedLogo = ({ resizeMode = 'contain', style, ...props }: ThemedLogoProps) => {
  const colorScheme = useColorScheme();
  const logo = colorScheme === 'dark' ? DarkImg : img;
  return (
    <Image
      {...props}
      resizeMode={resizeMode}
      source={logo}
      style={[styles.logo, style]}
    />
  )
}

export default ThemedLogo

const styles = StyleSheet.create({
  logo: {
    height: '100%',
    width: '100%',
  },
});

