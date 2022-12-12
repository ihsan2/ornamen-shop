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
import {useIsFocused} from '@react-navigation/native';

const MyOrder = ({navigation}) => {
  const [text, setText] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const isFocus = useIsFocused();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    let arr = [];
    setLoading(true);
    firestore()
      .collection('Orders')
      .where('email_seller', '==', user?.email)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          arr.push({...doc.data(), id: doc.id});
        });
        setOrders(arr);
        setLoading(false);
      });
  };

  const renderItem = (item, key) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('DetailMyOrder', {item});
        }}
        style={styles.listItem}
        key={key}>
        <View style={styles.listItemTop}>
          <View>
            <Label bold size={15} color={'#113764'}>
              {item?.detail?.name}
            </Label>
            <Label bold size={13} color={'gray'}>
              {item?.detail?.storeName}
            </Label>
          </View>
          <View>
            <Label
              bold
              size={13}
              color={item?.status == '0' ? '#e70000' : primary_green}>
              {item?.status == '0' ? 'Not Transfer' : 'Transfer'}
            </Label>
          </View>
        </View>
        <View style={styles.listItemSub}>
          <View>
            <Image source={{uri: item?.detail?.image}} style={styles.images} />
          </View>
          <View style={styles.detailItem}>
            <Label size={13} color={'gray'}>
              {item?.stok} x {formatRupiah(item?.detail?.price)}
            </Label>
            <Label bold size={14} color={'gray'}>
              Total:{' '}
              {formatRupiah(Number(item?.stok) * Number(item?.detail?.price))}
            </Label>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.scrollContainer}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => getData()} />
        }>
        <StatusBar backgroundColor={'#113764'} barStyle={'light-content'} />
        <Loading loading={loading} />
        <View style={styles.container}>
          <View>{orders.map((item, key) => renderItem(item, key))}</View>
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
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  listItem: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
  },
  listItemSub: {
    flexDirection: 'row',
  },
  listItemTop: {
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {marginLeft: 8, flex: 1},
});

export default MyOrder;
