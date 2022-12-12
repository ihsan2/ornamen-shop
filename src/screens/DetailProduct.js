import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  Linking,
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

const DetailProduct = ({navigation, route}) => {
  const item = route?.params?.item;
  const [loading, setLoading] = useState(false);
  const [stok, setStok] = useState(0);
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();

  const toWA = () => {
    if (user) {
      Number(stok) > 0
        ? Number(stok) > Number(item?.stok)
          ? showToast({
              text1: 'Stok tidak boleh melebihi batas stok yang tersedia.',
              type: 'error',
            })
          : Linking.openURL(
              `whatsapp://send?text=Hello Admin, Saya ${
                user?.name
              }. Saya ingin memesan produk ornamen ${
                item?.name
              } dengan jumlah ${Number(stok)}.&phone=62${item?.phone?.substring(
                1,
              )}`,
            )
        : showToast({
            text1: 'Silahkan tambahkan stok terlebih dahulu.',
            type: 'error',
          });
    } else {
      showToast({
        text1: 'Silahkan login terlebih dahulu untuk menambahkan pesanan.',
        type: 'error',
      });
      navigation.navigate('Login');
    }
  };

  const onAdd = () => {
    setStok(Number(stok) + 1);
  };
  const onMin = () => {
    if (Number(stok) > 0) setStok(Number(stok) - 1);
  };

  const renderDetail = () => {
    return (
      <View>
        <Image
          resizeMode="contain"
          source={{uri: item?.image}}
          style={styles.images}
        />
        <View style={styles.detail}>
          <Label bold size={24} color={'#113764'} mb={12}>
            {item?.name}
          </Label>

          <View style={{marginBottom: 10}}>
            <Label mb={4} color={'#868686'}>
              Harga
            </Label>
            <Label size={16} mb={8} color={'#000'}>
              {formatRupiah(item?.price)}
            </Label>
          </View>

          <View>
            <Label mb={4} color={'#868686'}>
              Stok yang tersedia
            </Label>
            <Label size={16} mb={8} color={'#000'}>
              {item?.stok}
            </Label>
          </View>

          <View>
            <Label mb={4} color={'#868686'}>
              Deskripsi
            </Label>
            <Label size={16} mb={8} color={'#000'}>
              {item?.desc}
            </Label>
          </View>

          <View>
            <Label mb={4} color={'#868686'}>
              Jumlah yg akan dipesan
            </Label>
            <View style={styles.stok}>
              <TouchableOpacity style={styles.minus} onPress={() => onMin()}>
                <Icon name="remove" size={26} color={'white'} />
              </TouchableOpacity>
              <Input
                style={styles.inputStok}
                label={''}
                value={stok.toString()}
                onChange={v => {
                  setStok(v);
                }}
                type={'phone-pad'}
              />
              <TouchableOpacity style={styles.add} onPress={() => onAdd()}>
                <Icon name="add" size={26} color={'white'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.scrollContainer}>
      <ScrollView>
        <StatusBar backgroundColor={'#113764'} barStyle={'light-content'} />
        <Loading loading={loading} />
        <View style={styles.container}>
          <View>{renderDetail()}</View>
        </View>
      </ScrollView>
      <View style={styles.bottom}>
        <View style={styles.bottomChild}>
          <TouchableOpacity style={styles.wa} onPress={() => toWA()}>
            <Icon name="logo-whatsapp" size={26} color={'#fff'} />
          </TouchableOpacity>

          <Button
            onPress={() => {
              if (user) {
                Number(stok) > 0
                  ? Number(stok) > Number(item?.stok)
                    ? showToast({
                        text1:
                          'Stok tidak boleh melebihi batas stok yang tersedia.',
                        type: 'error',
                      })
                    : navigation.navigate('OrderProduct', {
                        item,
                        stok: Number(stok),
                      })
                  : showToast({
                      text1: 'Silahkan tambahkan stok terlebih dahulu.',
                      type: 'error',
                    });
              } else {
                showToast({
                  text1:
                    'Silahkan login terlebih dahulu untuk menambahkan pesanan.',
                  type: 'error',
                });
                navigation.navigate('Login');
              }
            }}
            label={'Beli'}
            style={{marginLeft: 12, flex: 1}}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  images: {
    width: '100%',
    height: 240,
  },
  detail: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  bottom: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 30,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 0.2,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  bottomChild: {
    flexDirection: 'row',
  },
  wa: {
    backgroundColor: '#42DE5D',
    height: 48,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stok: {flexDirection: 'row', marginTop: 5},
  minus: {
    height: 48,
    backgroundColor: '#1890FF',
    borderRadius: 8,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  add: {
    height: 48,
    backgroundColor: '#1890FF',
    borderRadius: 8,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  inputStok: {
    width: 80,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DetailProduct;
