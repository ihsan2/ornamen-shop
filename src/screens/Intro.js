import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import React from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';
import {primary, primary_green} from '../config/color';
import Label from '../components/Label';
import Button from '../components/Button';
import {useDispatch} from 'react-redux';
import {setFirstOpen} from '../redux/actions/userActions';

const slides = [
  {
    key: 1,
    title: 'Ornamen Shop',
    text: 'Selamat datang di Ornamen Shop. Dapatkan pengalaman berbelanja ornamen yang semakin mudah, cepat, dan nyaman.',
    image: require('../images/slider1.png'),
    backgroundColor: '#59b2ab',
  },
  {
    key: 2,
    title: 'Dapatkan Ornamen yang Menarik',
    text: 'Anda dapat melihat dan membeli berbagai macam ornamen bangunan yang menarik dari berbagai macam toko ornamen bangunan di Kabupaten Gowa',
    image: require('../images/slider1.png'),
    backgroundColor: '#febe29',
  },
  {
    key: 3,
    title: 'Gabung Member Tanpa Ribet',
    text: 'Anda dapat Menjadi member dan penjual di Ornamen Shop dengan sangat mudah dan tanpa ribet.',
    image: require('../images/slider1.png'),
    backgroundColor: '#22bcb5',
  },
];

const Intro = ({navigation}) => {
  const dispatch = useDispatch();

  const _renderItem = ({item}) => {
    return (
      <View style={styles.slide}>
        <Image source={item.image} />
        <Label ml={50} mr={50} center bold size={24} color={'#0F1B41'} mb={15}>
          {item?.title}
        </Label>
        <Label
          style={{lineHeight: 24}}
          ml={50}
          mr={50}
          center
          size={16}
          color={'#4A4A4A'}>
          {item?.text}
        </Label>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={primary_green} />
      <Image
        style={{alignSelf: 'center'}}
        source={require('../images/logo.png')}
      />
      <View style={styles.wrap}>
        <AppIntroSlider
          renderItem={_renderItem}
          data={slides}
          onDone={() => {}}
          activeDotStyle={{backgroundColor: primary_green}}
          showDoneButton={false}
          showNextButton={false}
        />
      </View>
      <View style={styles.btnWrap}>
        <Button
          onPress={() => {
            dispatch(setFirstOpen(false));
            navigation.navigate('BottomNav');
          }}
          style={styles.btn}
          label={'Mulai'}
        />
      </View>
    </SafeAreaView>
  );
};

export default Intro;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  wrap: {flex: 5},
  slide: {
    alignItems: 'center',
  },
  btnWrap: {
    width: '100%',
    flex: 1,
    paddingHorizontal: 36,
  },
  btn: {borderRadius: 100},
});
