import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import Label from './Label';

const Button = ({
  primary,
  border,
  color,
  label,
  children,
  lebelStyle,
  style,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          backgroundColor: primary ?? '#113764',
          borderColor: border ?? '#113764',
          borderWidth: 1,
          height: 48,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
          paddingHorizontal: 15,
        },
        style ?? {},
      ]}>
      {children ? (
        children
      ) : (
        <Label bold color={color ?? '#fff'} style={lebelStyle ?? {}}>
          {label}
        </Label>
      )}
    </TouchableOpacity>
  );
};

export default Button;
