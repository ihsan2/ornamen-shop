import {TouchableOpacity} from 'react-native';
import React from 'react';

const Card = ({style = {}, children, disabled = false, onPress = null}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.18,
          shadowRadius: 1.0,
          elevation: 1,
          padding: 12,
          marginBottom: 12,
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: '#eee',
          borderRadius: 4,
        },
        style,
      ]}>
      {children}
    </TouchableOpacity>
  );
};

export default Card;
