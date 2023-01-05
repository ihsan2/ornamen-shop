import React, {memo, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
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
import axios from 'axios';
import moment from 'moment';

const DetailMyProduct = ({navigation, route}) => {
  const item = route?.params?.item;
  const [loading, setLoading] = useState(false);
  const [loadNotif, setLoadNotif] = useState(false);
  const userState = useSelector(state => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    const user = await firestore()
      .collection('Users')
      .doc(userState?.uid)
      .get();
    dispatch(setUserInfo(user?.data()));
  };

  const _doChangeStatus = async val => {
    setLoading(true);

    let sellerName = userState?.name

    let data = {
      // isPublished: val,
      sellerName
    };
    firestore()
      .collection('Products')
      .doc(item?.id)
      .update(data)
      .then(res => {
        setLoading(false);
        showToast({
          text1:
            val == '1'
              ? 'Produk berhasil dipublish.'
              : 'Produk ditambahkan ke draft.',
        });
        navigation.goBack();
      });
  };

  const _addNotifs = async () => {
    let data = {
      detail: item,
      created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
      body: `Ada pemberitahuan produk ${item?.name} dari ${item?.storeName}, sisa stok ${item?.stok}. Buruan dicek produknya sebelum kehabisan.`,
      title: `${item?.name} - ${item?.storeName}`,
      type: 'product',
    };
    firestore()
      .collection('Notifications')
      .add(data)
      .then(res => {
        showToast({
          text1: 'Berhasil kirim notifikasi.',
        });
      });
  };

  const sendNotif = () => {
    let dataNotif = {
      to: '/topics/all',
      priority: 'high',
      notification: {
        body: `Ada pemberitahuan produk ${item?.name} dari ${item?.storeName}, sisa stok ${item?.stok}. Buruan dicek produknya sebelum kehabisan.`,
        title: `${item?.name} - ${item?.storeName}`,
      },
      data: {
        item: item,
      },
    };
    setLoadNotif(true);
    axios
      .post('https://fcm.googleapis.com/fcm/send', dataNotif, {
        headers: {
          Authorization:
            'key=AAAAOs7K7vg:APA91bHRLAxWfGOkJPIUsIfRC12uJ75yqCyGyu856ThkIMysP1ct4F0zUjFy36CPUcrLkfeloMGWTABbcHEidMc3ti4C9GKM2qt80bzcS4lrvD9BtFKD6cua9A4mUb8KVGuMNsTsFB9g',
          'Content-Type': 'application/json',
        },
      })
      .then(res => {
        console.log('success send notif', res.data);
        setLoadNotif(false);
        firestore()
          .collection('Users')
          .doc(userState?.uid)
          .update({last_notif: moment().format('YYYY-MM-DD HH:mm:ss')});
        _addNotifs();
        getUserInfo();
      })
      .catch(err => {
        console.log('err', err);
        setLoadNotif(false);
      });
  };

  const renderDetail = () => {
    let startDate = moment(userState?.last_notif, 'YYYY-MM-DD HH:mm:ss');
    let endDate = moment();
    let duration = endDate.diff(startDate, 'hours');
    const isDisabled = userState?.last_notif
      ? duration < 24
        ? true
        : false
      : false;

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
              Status
            </Label>
            <View
              style={{
                ...styles.status,
                backgroundColor:
                  item?.isPublished == '1' ? primary_green : '#e70000',
              }}>
              <Label color="#fff">
                {item?.isPublished == '1' ? 'Published' : 'Draft'}
              </Label>
            </View>
          </View>

          {loadNotif || isDisabled ? (
            <TouchableOpacity
              style={styles.btnNotifDisabled}
              disabled={loadNotif || isDisabled}>
              <Icon name="notifications" size={26} color={'#fff'} />
              <Label color="#fff" bold ml={8} size={16}>
                Kirim Produk Notification
              </Label>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.btnNotif}
              onPress={() => {
                sendNotif();
              }}>
              <Icon name="notifications" size={26} color={'#fff'} />
              <Label color="#fff" bold ml={8} size={16}>
                Kirim Produk Notification
              </Label>
            </TouchableOpacity>
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
      <View style={styles.bottom}>
        <View style={styles.bottomChild}>
          {item?.isPublished == '1' ? (
            <Button
              onPress={() => _doChangeStatus('0')}
              label={'Draft'}
              primary={'#fff'}
              border={'#E70000'}
              color={'#e70000'}
              style={{flex: 1}}
            />
          ) : (
            <Button
              onPress={() => _doChangeStatus('1')}
              label={'Publish'}
              primary={'#fff'}
              border={primary_green}
              color={primary_green}
              style={{flex: 1}}
            />
          )}

          <Button
            onPress={() => navigation.navigate('EditProduct', {item})}
            label={'Edit'}
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
  status: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  btnNotif: {
    backgroundColor: '#30B7EA',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 8,
    marginTop: 20,
    flexDirection: 'row',
  },
  btnNotifDisabled: {
    backgroundColor: '#AAA',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 8,
    marginTop: 20,
    flexDirection: 'row',
  },
});

export default DetailMyProduct;
