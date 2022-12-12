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
import Icon from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import {formatRupiah} from '../config/format';
import {Picker} from '@react-native-picker/picker';

const areas = [
  {
    value: '-- Pilih Area Pengantaran --',
    label: '',
  },
  {
    value: 'Palangga',
    label: 30000,
  },
  {
    value: 'Manggarupi',
    label: 30000,
  },
  {
    value: 'Samata',
    label: 30000,
  },
  {
    value: 'Sultan Hasanuddin',
    label: 30000,
  },
  {
    value: 'Patalassang',
    label: 30000,
  },
  {
    value: 'Alauddin',
    label: 30000,
  },
  {
    value: 'Hertasning',
    label: 30000,
  },
  {
    value: 'Toddopuli',
    label: 50000,
  },
  {
    value: 'Batua Raya',
    label: 50000,
  },
  {
    value: 'Cendrawasih',
    label: 50000,
  },
  {
    value: 'Kumala',
    label: 50000,
  },
  {
    value: 'Dg Tata Raya',
    label: 50000,
  },
  {
    value: 'Sam Ratulangi',
    label: 50000,
  },
  {
    value: 'Urip Sumoharjo',
    label: 50000,
  },
];

const OrderProduct = ({navigation, route}) => {
  const item = route?.params?.item;
  const stok = route?.params?.stok;
  const [loading, setLoading] = useState(false);
  const [tipe, setTipe] = useState('0');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('');
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();

  const _doAdd = async () => {
    let validated = tipe == '1' ? address : address || !address;
    if (validated) {
      // setLoading(true);

      let areaSelected = areas.filter(e => e.value === area)[0];
      let data = {
        detail: item,
        email: user?.email,
        name: user?.name,
        phone: user?.phone,
        stok: stok,
        tipe: tipe == '1' ? 'antar' : 'ambil_sendiri',
        alamat_pengantaran: tipe == '1' ? address : '',
        area_pengantaran: tipe == '1' ? areaSelected?.value : '',
        ongkir: tipe == '1' ? areaSelected?.label.toString() : '',
        status: '0',
        email_seller: item?.email,
      };

      firestore()
        .collection('Orders')
        .add(data)
        .then(res => {
          setLoading(false);
          showToast({text1: 'Berhasil Buat Pesanan!'});
          navigation.navigate('Home');
        });
    } else {
      showToast({
        type: 'error',
        text1: 'Alamat Pengantaran tidak boleh kosong.',
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <StatusBar backgroundColor={'#113764'} barStyle={'light-content'} />
      <Loading loading={loading} />
      <View style={styles.container}>
        <Label bold size={24} color={'#113764'} mb={12}>
          {item?.name}
        </Label>

        <View>
          <Label mb={4} color={'#868686'}>
            Harga
          </Label>
          <Label size={16} mb={8} color={'#000'}>
            {formatRupiah(item?.price)}
          </Label>
        </View>

        <View>
          <Label mb={4} color={'#868686'}>
            Jumlah yang di pesan
          </Label>
          <Label size={16} mb={8} color={'#000'}>
            {stok}
          </Label>
        </View>

        <View>
          <Label mb={4} color={'#868686'}>
            Total Harga
          </Label>
          <Label size={16} mb={8} color={'#000'}>
            {formatRupiah(Number(stok) * Number(item?.price))}
          </Label>
        </View>

        <View>
          <Label mb={4} color={'#868686'}>
            Tipe Pesanan
          </Label>
          <View style={{marginBottom: 10}}>
            {['0', '1'].map((el, key) => {
              return (
                <TouchableOpacity
                  onPress={() => setTipe(el)}
                  key={key}
                  style={styles.tipe}>
                  <Icon
                    name={el == tipe ? 'radio-button-on' : 'radio-button-off'}
                    color={el == tipe ? '#1890FF' : 'gray'}
                    size={26}
                  />
                  <Label ml={4} size={15}>
                    {el == 0 ? 'Ambil Sendiri' : 'Pengantaran'}
                  </Label>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        {tipe == '1' && (
          <View>
            <View>
              <Label mb={8} color={'#868686'}>
                Pilih Area Pengantaran
              </Label>
              <View style={styles.picker}>
                <Picker
                  selectedValue={area}
                  onValueChange={(itemValue, itemIndex) => {
                    setArea(itemValue);
                  }}>
                  {areas.map((e, i) => {
                    return (
                      <Picker.Item
                        color={i === 0 ? 'grey' : 'black'}
                        key={i}
                        label={`${e?.value} - ${formatRupiah(e?.label)}`}
                        value={e?.value}
                      />
                    );
                  })}
                </Picker>
              </View>
            </View>
            <Input
              placeholder={'Alamat Pengantaran'}
              label={'Alamat Pengataran'}
              value={address}
              onChange={v => setAddress(v)}
            />
          </View>
        )}

        <Button label={'Buat Pesanan'} onPress={() => _doAdd()} />
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
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  pic: {
    height: 106,
    width: 106,
    marginBottom: 30,
    alignSelf: 'center',
  },
  register: {flexDirection: 'row', justifyContent: 'center', marginTop: 16},
  addPhoto: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#bbb',
  },
  images: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    borderRadius: 8,
  },
  tipe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  picker: {
    borderRadius: 8,
    height: 48,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
});

export default OrderProduct;
