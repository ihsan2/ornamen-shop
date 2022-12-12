import Toast from 'react-native-toast-message';

export const showToast = ({
  text1 = '',
  text2 = '',
  offset = 0,
  duration = 3000,
  type = 'success',
  onPress = () => {},
} = {}) => {
  Toast.show({
    text1: text1,
    text2: text2,
    topOffset: offset,
    visibilityTime: duration,
    type: type,
    onPress: onPress,
  });
};
