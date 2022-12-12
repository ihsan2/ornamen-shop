import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Label from '../components/Label';
import Input from '../components/Input';
import Button from '../components/Button';
import {useSelector, useDispatch} from 'react-redux';
import {showToast} from '../config/toast';
import Loading from '../components/Loading';
import {primary_green} from '../config/color';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {setUserInfo} from '../redux/actions/userActions';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const user = useSelector(state => state.user);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const _doLogin = () => {
    if (email && password) {
      setLoading(true);
      auth()
        .signInWithEmailAndPassword(email.trim(), password)
        .then(async res => {
          let uid = res?.user?.uid;
          const user = await firestore().collection('Users').doc(uid).get();
          showToast({text1: 'Berhasil Login.'});
          setLoading(false);
          dispatch(setUserInfo(user.data()));
          navigation.replace('Splash');
        })
        .catch(error => {
          setLoading(false);
          showToast({type: 'error', text1: error.code});
        });
    } else {
      showToast({
        type: 'error',
        text1: 'Email dan password tidak boleh kosong/',
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <StatusBar backgroundColor={'#113764'} barStyle={'light-content'} />
      <Loading loading={loading} />
      <View style={styles.container}>
        <Image source={require('../images/logo.png')} style={styles.pic} />
        <Label size={24} bold mb={20}>
          Log In
        </Label>

        <Input
          placeholder={'Your Email'}
          label={'Email'}
          value={email}
          onChange={v => setEmail(v)}
        />
        <Input
          placeholder={'Your Password'}
          label={'Password'}
          isPassword
          value={password}
          onChange={v => setPassword(v)}
        />

        <Button label={'Log In'} onPress={() => _doLogin()} />

        <View style={styles.register}>
          <Label size={16}>Belum Punya Akun?</Label>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Label size={16} ml={4} bold color={primary_green}>
              Register
            </Label>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  pic: {
    height: 106,
    width: 106,
    marginBottom: 30,
    alignSelf: 'center',
  },
  register: {flexDirection: 'row', justifyContent: 'center', marginTop: 16},
});

export default Login;
