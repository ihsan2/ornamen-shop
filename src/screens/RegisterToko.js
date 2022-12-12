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
import {Picker} from '@react-native-picker/picker';

const RegisterToko = ({navigation}) => {
  const [address, setAddress] = useState('');
  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [bank, setBank] = useState('');
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();

  const _doRegister = () => {
    if (name && address) {
      setLoading(true);
      let data = {
        storeName: name,
        storeAddress: address,
        isSeller: true,
        no_rekening: number,
        bank: bank
      };
      firestore()
        .collection('Users')
        .doc(user?.uid)
        .update(data)
        .then(res => {
          setLoading(false);
          showToast({text1: 'Berhasil Daftar Toko!'});
          dispatch(setUserInfo({...data, ...user}));
          navigation.navigate('Splash');
        });
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
          Daftar Toko
        </Label>

        <Input
          placeholder={'Nama Toko'}
          label={'Nama Toko'}
          value={name}
          onChange={v => setName(v)}
        />
        <Input
          placeholder={'Alamat Toko'}
          label={'Alamat Toko'}
          value={address}
          onChange={v => setAddress(v)}
        />
        <Input
          placeholder={'No. Rekening'}
          label={'No. Rekening'}
          value={number}
          onChange={v => setNumber(v)}
          type={'phone-pad'}
        />
        <View>
          <Label mb={8} color={'#868686'}>
            Pilih Bank
          </Label>
          <View style={styles.picker}>
            <Picker
              selectedValue={bank}
              onValueChange={(itemValue, itemIndex) => setBank(itemValue)}>
              <Picker.Item color='grey' label="-- Pilih Bank --" value="" />
              <Picker.Item label="BRI" value="BRI" />
              <Picker.Item label="BNI" value="BNI" />
              <Picker.Item label="BCA" value="BCA" />
              <Picker.Item label="MANDIRI" value="MANDIRI" />
            </Picker>
          </View>
        </View>

        <Button label={'Daftar Toko'} onPress={() => _doRegister()} />
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
  picker: {
    borderRadius: 8,
    height: 48,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
});

export default RegisterToko;
