import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from 'react-native';
import React from 'react';
import {primary, primary_green} from '../config/color';
import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import messaging from '@react-native-firebase/messaging';

const Splash = ({navigation}) => {
  const user = useSelector(state => state.user);

  useEffect(() => {
    messaging()
      .subscribeToTopic('all')
      .then(() => console.log('Subscribed to topic!'));
    setTimeout(() => {
      if (user?.isFirstOpen) {
        navigation.replace('Intro');
      } else {
        navigation.replace('BottomNav');
      }
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={primary} />
      <Image source={require('../images/logo.png')} />
      <ActivityIndicator
        color={primary_green}
        style={styles.load}
        size={'large'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  load: {
    position: 'absolute',
    bottom: 120,
  },
});

export default Splash;
