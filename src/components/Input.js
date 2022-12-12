import {View, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import Label from './Label';
import Icon from 'react-native-vector-icons/Entypo';

const Input = ({
  bgColor,
  style,
  label,
  type,
  placeholder,
  value,
  onChange,
  isPassword,
  isSearch,
  withoutMB,
}) => {
  const [show, setShow] = useState(isPassword ? true : false);

  return (
    <View>
      {label ? (
        <Label mb={8} color={'#868686'}>
          {label}
        </Label>
      ) : null}
      <View
        style={[
          styles.inputContainer,
          {backgroundColor: bgColor ?? '#fff'},
          {justifyContent: isSearch ? 'flex-start' : 'space-between'},
          {marginBottom: withoutMB ? 0 : 15},
          style ?? {},
        ]}>
        {isSearch ? (
          <View style={{marginRight: 8}}>
            <Icon name={'magnifying-glass'} size={20} color={'#9e9e9e'} />
          </View>
        ) : null}
        <TextInput
          placeholder={placeholder}
          keyboardType={type ?? 'default'}
          value={value}
          onChangeText={onChange}
          secureTextEntry={show}
        />
        {isPassword ? (
          <TouchableOpacity onPress={() => setShow(!show)}>
            <Icon
              name={!show ? 'eye-with-line' : 'eye'}
              size={20}
              color={'#9e9e9e'}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderRadius: 8,
    height: 48,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default Input;
