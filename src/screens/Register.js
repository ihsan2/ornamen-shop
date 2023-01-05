import React, {useEffect, useState} from 'react';
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
import {useIsFocused} from '@react-navigation/native';

const Register = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hp, setHp] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState([]);
  const focus = useIsFocused();
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    getData();
  }, [focus]);

  const getData = async () => {
    let arr = [];
    firestore()
      .collection('Users')
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          arr.push({...doc.data(), id: doc.id});
        });
        setUsers(arr);
      });
  };

  const _doRegister = () => {
    if (email && password && hp && name && address && username) {
      if (users.filter(e => e?.email === email).length > 0) {
        showToast({type: 'error', text1: 'Email sudah terdaftar.'});
      } else if (users.filter(e => e?.username === username).length > 0) {
        showToast({type: 'error', text1: 'Username sudah digunakan.'});
      } else {
        setLoading(true);
        auth()
          .createUserWithEmailAndPassword(email, password)
          .then(res => {
            let uid = res?.user?.uid;

            firestore()
              .collection('Users')
              .doc(uid)
              .set({
                name,
                phone: hp,
                email,
                uid,
                address,
                username,
              })
              .then(() => {
                setLoading(false);
                showToast({text1: 'Berhasil Daftar!'});
                navigation.navigate('Login');
              });
          })
          .catch(error => {
            setLoading(false);
            if (error.code === 'auth/email-already-in-use') {
              showToast({
                type: 'error',
                text1: 'That email address is already in use!',
              });
              return;
            }

            if (error.code === 'auth/invalid-email') {
              showToast({
                type: 'error',
                text1: 'That email address is invalid!',
              });
              return;
            }

            showToast({type: 'error', text1: error.code});
          });
      }
    } else {
      showToast({type: 'error', text1: 'All Form must be filled.'});
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <StatusBar backgroundColor={'#113764'} barStyle={'light-content'} />
      <Loading loading={loading} />
      <View style={styles.container}>
        <Image source={require('../images/logo.png')} style={styles.pic} />
        <Label size={24} bold mb={20}>
          Register
        </Label>

        <Input
          placeholder={'Your Name'}
          label={'Name'}
          value={name}
          onChange={v => setName(v)}
        />
        <Input
          placeholder={'Your Username'}
          label={'Username'}
          value={username}
          onChange={v => setUsername(v)}
          autoCapitalize={'none'}
        />
        <Input
          placeholder={'Your No. HP'}
          label={'No .HP'}
          value={hp}
          onChange={v => setHp(v)}
        />
        <Input
          placeholder={'Your Address'}
          label={'Alamat'}
          value={address}
          onChange={v => setAddress(v)}
        />
        <Input
          placeholder={'Your Email'}
          label={'Email'}
          value={email}
          onChange={v => setEmail(v)}
          type={'email-address'}
        />

        <Input
          placeholder={'Your Password'}
          label={'Password'}
          isPassword
          value={password}
          onChange={v => setPassword(v)}
        />

        <Button label={'Daftar'} onPress={() => _doRegister()} />

        <View style={styles.register}>
          <Label size={16}>Sudah Punya Akun?</Label>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Label size={16} ml={4} bold color={primary_green}>
              Login
            </Label>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    // flex: 1,
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

export default Register;
