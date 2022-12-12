import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Clipboard,
  ToastAndroid,
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

const ProofTransfer = ({navigation, route}) => {
  const item = route?.params?.item;
  const [rek, setRek] = useState('');
  const [name, setName] = useState('');
  const [bank, setBank] = useState('');
  const [images, setImages] = useState('');
  const [loading, setLoading] = useState(false);
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();

  const _doSend = async () => {
    if (name && bank && rek && images) {
      setLoading(true);
      let nowName = Date.now();
      await storage().ref(`images/${nowName}-${name}.jpg`).putFile(images);
      let url = await storage()
        .ref(`images/${nowName}-${name}.jpg`)
        .getDownloadURL();

      let data = {
        status: '1',
        proof: {
          name,
          number: rek,
          bank,
          image: url,
        },
      };
      firestore()
        .collection('Orders')
        .doc(item?.id)
        .update(data)
        .then(res => {
          setLoading(false);
          showToast({text1: 'Berhasil kirim bukti transfer!'});
          navigation.goBack();
        });
    } else {
      showToast({type: 'error', text1: 'All Form must be filled.'});
    }
  };

  const pick = () => {
    launchImageLibrary({
      mediaType: 'photo',
    }).then(res => {
      if (!res.didCancel) {
        setImages(res.assets[0].uri);
      }
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <StatusBar backgroundColor={'#113764'} barStyle={'light-content'} />
      <Loading loading={loading} />
      <View style={styles.container}>
        <View>
          <Label bold size={15} color={'#113764'}>
            {item?.detail?.name}
          </Label>
          <Label bold size={13} color={'gray'} mb={4}>
            {item?.detail?.storeName}
          </Label>
          <Label size={13} color={'gray'}>
            {item?.stok} x {formatRupiah(item?.detail?.price)}
          </Label>
          {item?.tipe == 'antar' ? (
            <Label size={13} color={'gray'}>
              Ongkir: {formatRupiah(item?.ongkir)}
            </Label>
          ) : null}

          <Label mt={2} bold size={16} color={'gray'}>
            Total:{' '}
            {formatRupiah(
              Number(item?.stok) * Number(item?.detail?.price) +
                Number(item?.ongkir),
            )}
          </Label>

          <Label mt={12} size={15} color={'black'} mr={8}>
            Rekening Tujuan:
          </Label>
          <View
            style={{
              marginTop: 1,
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
            }}>
            <Label bold size={16} color={'black'} mr={8}>
              {item?.detail?.sellerName} - {item?.detail?.bank} -{' '}
              {item?.detail?.no_rekening}
            </Label>
            <TouchableOpacity
              onPress={() => {
                Clipboard.setString(item?.detail?.no_rekening);
                ToastAndroid.show(
                  'No. Rekening telah disalin',
                  ToastAndroid.SHORT,
                );
              }}>
              <Icon name="copy-outline" color={'black'} size={22} />
            </TouchableOpacity>
          </View>
        </View>

        <Input
          placeholder={'Nama Pengirim'}
          label={'Nama Pengirim'}
          value={name}
          onChange={v => setName(v)}
        />
        <Input
          placeholder={'Nomor Rekening Pengirim'}
          label={'Nomor Rekening Pengirim'}
          value={rek}
          onChange={v => setRek(v)}
        />
        <View>
          <Label mb={8} color={'#868686'}>
            Pilih Bank Pengirim
          </Label>
          <View style={styles.picker}>
            <Picker
              selectedValue={bank}
              onValueChange={(itemValue, itemIndex) => setBank(itemValue)}>
              <Picker.Item
                color="grey"
                label="-- Pilih Bank Pengirim --"
                value=""
              />
              <Picker.Item label="BRI" value="BRI" />
              <Picker.Item label="BNI" value="BNI" />
              <Picker.Item label="BCA" value="BCA" />
              <Picker.Item label="MANDIRI" value="MANDIRI" />
            </Picker>
          </View>
        </View>
        {/* <Input
          placeholder={'Bank'}
          label={'Bank'}
          value={bank}
          onChange={v => setBank(v)}
        /> */}

        <Label mb={8} color={'#868686'}>
          Screenshot Bukti Pengirim
        </Label>
        <TouchableOpacity style={styles.addPhoto} onPress={() => pick()}>
          {images ? (
            <Image source={{uri: images}} style={styles.images} />
          ) : (
            <Icon name="add" size={30} color={'#bbb'} />
          )}
        </TouchableOpacity>

        <Button label={'Kirim Bukti Transfer'} onPress={() => _doSend()} />
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
  picker: {
    borderRadius: 8,
    height: 48,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
});

export default ProofTransfer;
