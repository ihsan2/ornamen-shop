import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
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

const DetailMyOrder = ({navigation, route}) => {
  const item = route?.params?.item;
  const [loading, setLoading] = useState(false);
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();

  const renderDetail = () => {
    return (
      <View>
        <Image
          resizeMode="contain"
          source={{uri: item?.detail?.image}}
          style={styles.images}
        />
        <View style={styles.detail}>
          <Label bold size={24} color={'#113764'} mb={12}>
            {item?.detail?.name}
          </Label>

          <View>
            <Label mb={4} color={'#868686'}>
              Nama Pemesan
            </Label>
            <Label size={16} mb={8} color={'#000'}>
              {item?.name}
            </Label>
          </View>

          <View>
            <Label mb={4} color={'#868686'}>
              No. HP
            </Label>
            <Label size={16} mb={8} color={'#000'}>
              {item?.phone}
            </Label>
          </View>

          <View>
            <Label mb={4} color={'#868686'}>
              Tipe Pesanan
            </Label>
            <Label size={16} mb={8} color={'#000'}>
              {item?.tipe == 'antar' ? 'Pengantaran' : 'Ambil Di Toko'}
            </Label>
          </View>
          {item?.tipe == 'antar' && (
            <View>
              <Label mb={4} color={'#868686'}>
                Alamat Pengantaran
              </Label>
              <Label size={16} mb={8} color={'#000'}>
                {item?.alamat_pengantaran}
              </Label>
            </View>
          )}

          <View>
            <Label mb={4} color={'#868686'}>
              Harga
            </Label>
            <Label size={16} mb={8} color={'#000'}>
              {formatRupiah(item?.detail?.price)}
            </Label>
          </View>

          <View>
            <Label mb={4} color={'#868686'}>
              Jumlah yang dipesan
            </Label>
            <Label size={16} mb={8} color={'#000'}>
              {item?.stok}
            </Label>
          </View>

          <View>
            <Label mb={4} color={'#868686'}>
              Total Harga
            </Label>
            <Label size={16} mb={8} color={'#000'}>
              {formatRupiah(Number(item?.stok) * Number(item?.detail?.price))}
            </Label>
          </View>

          <View>
            <Label mb={4} color={'#868686'}>
              Status Transfer
            </Label>
            <Label
              bold
              size={16}
              mb={8}
              color={item?.status == '0' ? '#e70000' : primary_green}>
              {item?.status == '0' ? 'Not Transfer' : 'Transfer'}
            </Label>
          </View>

          {item?.status == '1' && (
            <View>
              <View>
                <Label mb={4} color={'#868686'}>
                  Nama Pemilik Rekening
                </Label>
                <Label size={16} mb={8} color={'#000'}>
                  {item?.proof?.name}
                </Label>
              </View>
              <View>
                <Label mb={4} color={'#868686'}>
                  Nomor Rekening
                </Label>
                <Label size={16} mb={8} color={'#000'}>
                  {item?.proof?.number}
                </Label>
              </View>
              <View>
                <Label mb={4} color={'#868686'}>
                  Bank
                </Label>
                <Label size={16} mb={8} color={'#000'}>
                  {item?.proof?.bank}
                </Label>
              </View>

              <View>
                <Label mb={4} color={'#868686'}>
                  Foto
                </Label>
                <Image
                  source={{uri: item?.proof?.image}}
                  style={styles.imageProof}
                />
              </View>
            </View>
          )}
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
      {/* <View style={styles.bottom}>
        <View style={styles.bottomChild}>
          <Button
            onPress={() => navigation.goBack()}
            label={'Hapus'}
            primary={'#fff'}
            border={'#E70000'}
            color={'#e70000'}
            style={{flex: 1}}
          />
          <Button
            onPress={() => navigation.navigate('EditMyProduct')}
            label={'Edit'}
            primary={'#52C41A'}
            border={'#52C41A'}
            style={{marginLeft: 12, flex: 1}}
          />
        </View>
      </View> */}
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
  imageProof: {
    height: 240,
    resizeMode: 'contain',
  },
});

export default DetailMyOrder;
