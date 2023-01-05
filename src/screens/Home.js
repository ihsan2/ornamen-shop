import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Alert,
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
import {useIsFocused} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import dynamicLinks from '@react-native-firebase/dynamic-links';

const Home = ({navigation}) => {
  const [text, setText] = useState('');
  const [products, setProducts] = useState([]);
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const isFocus = useIsFocused();

  useEffect(() => {
    getData();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      let data = remoteMessage?.notification;
      let item = JSON.parse(remoteMessage?.data?.item);
      showToast({
        onPress: () => {
          user?.email == item?.email
            ? navigation.navigate('DetailMyProduct', {item})
            : navigation.navigate('DetailProduct', {item});
        },
        text1: data?.title,
        text2: data?.body,
        type: 'notif',
      });
    });

    messaging().onNotificationOpenedApp(rm => {
      let item = JSON.parse(rm?.data?.item);
      user?.email == item?.email
        ? navigation.navigate('DetailMyProduct', {item})
        : navigation.navigate('DetailProduct', {item});
    });

    messaging()
      .getInitialNotification()
      .then(rm => {
        if (rm) {
          let item = JSON.parse(rm?.data?.item);
          user?.email == item?.email
            ? navigation.navigate('DetailMyProduct', {item})
            : navigation.navigate('DetailProduct', {item});
        }
      });

    return unsubscribe;
  }, [isFocus]);

  const getData = async () => {
    let arr = [];
    setLoading(true);
    firestore()
      .collection('Products')
      .where('isPublished', '==', '1')
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          arr.push({...doc.data(), id: doc.id});
        });
        setProducts(arr);
        setAll(arr);
        setLoading(false);
      });
  };

  useEffect(() => {
    generateLink();
  }, []);

  const generateLink = async () => {
  };

  const handleDynamicLink = link => {
    console.log('jjk', link);
  };

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    // When the component is unmounted, remove the listener
    return () => unsubscribe();
  }, []);

  const renderItem = (item, key) => {
    return (
      <TouchableOpacity
        onPress={() => {
          user?.email == item?.email
            ? navigation.navigate('DetailMyProduct', {item})
            : navigation.navigate('DetailProduct', {item});
        }}
        style={[styles.listItem, {marginRight: key % 2 !== 0 ? 0 : 10}]}
        key={key}>
        <Image source={{uri: item?.image}} style={styles.images} />
        <Label bold size={15} color={'#113764'} ml={8} mr={8} mt={12} mb={2}>
          {item?.name}
        </Label>
        <Label bold size={13} color={'#1890FF'} ml={8} mr={8} mb={8}>
          {item?.storeName}
        </Label>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.scrollContainer}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              getData();
              setText('');
            }}
          />
        }>
        <StatusBar backgroundColor={'#113764'} barStyle={'light-content'} />
        <Loading loading={loading} />
        <View style={styles.container}>
          <Input
            isSearch={true}
            placeholder={'Cari Produk'}
            label={''}
            value={text}
            onChange={v => {
              setText(v);
              let tmp = [...all];
              let res = tmp.filter(e =>
                e.name.toLowerCase().match(v.toLowerCase()),
              );
              setProducts(res);
            }}
          />
          <View style={styles.listWrap}>
            {products.map((item, key) => renderItem(item, key))}
          </View>
        </View>
      </ScrollView>
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
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  images: {
    width: '100%',
    height: 160,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  listWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  listItem: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    width: '48%',
    marginBottom: 16,
  },
});

export default Home;
