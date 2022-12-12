import {View, Text} from 'react-native';
import React from 'react';

const Label = ({
  children,
  style = {},
  bold,
  center,
  right,
  size = 14,
  color = '#000',
  mb = 0,
  mt = 0,
  ml = 0,
  mr = 0,
}) => {
  const _renderAlign = () => {
    let align = '';
    if (center) {
      align = 'center';
    } else if (right) {
      align = 'right';
    } else {
      align = 'left';
    }
    return align;
  };

  return (
    <View>
      <Text
        style={[
          {
            color: color,
            textAlign: _renderAlign(),
            fontSize: size,
            fontWeight: bold ? 'bold' : 'normal',
            marginBottom: mb,
            marginTop: mt,
            marginLeft: ml,
            marginRight: mr,
          },
          style,
        ]}>
        {children}
      </Text>
    </View>
  );
};

export default Label;
