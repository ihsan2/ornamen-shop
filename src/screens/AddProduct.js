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

const AddProduct = ({navigation}) => {
  const [price, setPrice] = useState('');
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [stok, setStok] = useState('');
  const [images, setImages] = useState('');
  const [loading, setLoading] = useState(false);
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();

  const _doAdd = async () => {
    if (price && name && desc && stok && images) {
      setLoading(true);
      let nowName = Date.now();
      await storage().ref(`images/${nowName}-${name}.jpg`).putFile(images);
      let url = await storage()
        .ref(`images/${nowName}-${name}.jpg`)
        .getDownloadURL();

      let data = {
        storeName: user?.storeName,
        storeAddress: user?.storeAddress,
        email: user?.email,
        uid: user?.uid,
        phone: user?.phone,
        bank: user?.bank,
        no_rekening: user?.no_rekening,
        price,
        name,
        desc,
        stok,
        image: url,
        isPublished: '1',
      };
      firestore()
        .collection('Products')
        .add(data)
        .then(res => {
          setLoading(false);
          showToast({text1: 'Berhasil Tambah Produk!'});
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
        <Input
          placeholder={'Nama Furniture / Produk'}
          label={'Nama Furniture / Produk'}
          value={name}
          onChange={v => setName(v)}
        />
        <Input
          placeholder={'Harga'}
          label={'Harga'}
          value={price}
          onChange={v => setPrice(v)}
        />
        <Input
          placeholder={'Jumlah'}
          label={'Jumlah'}
          value={stok}
          onChange={v => setStok(v)}
        />
        <Input
          placeholder={'Deskripsi'}
          label={'Deskripsi'}
          value={desc}
          onChange={v => setDesc(v)}
        />

        <Label mb={8} color={'#868686'}>
          Foto
        </Label>
        <TouchableOpacity style={styles.addPhoto} onPress={() => pick()}>
          {images ? (
            <Image source={{uri: images}} style={styles.images} />
          ) : (
            <Icon name="add" size={30} color={'#bbb'} />
          )}
        </TouchableOpacity>

        <Button label={'Tambah Produk'} onPress={() => _doAdd()} />
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
});

export default AddProduct;
