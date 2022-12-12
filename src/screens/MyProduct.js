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
import {useIsFocused} from '@react-navigation/native';

const MyProduct = ({navigation}) => {
  const [text, setText] = useState('');
  const [products, setProducts] = useState([]);
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const focus = useIsFocused();

  useEffect(() => {
    getData();
  }, [focus]);

  const getData = async () => {
    let arr = [];
    setLoading(true);
    firestore()
      .collection('Products')
      .where('email', '==', user?.email)
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

  const renderItem = (item, key) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('DetailMyProduct', {item})}
        style={[styles.listItem, {marginRight: key % 2 !== 0 ? 0 : 10}]}
        key={key}>
        <Image source={{uri: item?.image}} style={styles.images} />
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
        <Label bold size={15} color={'#113764'} ml={8} mr={8} mt={12} mb={12}>
          {item?.name}
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
              setText('');
              getData();
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
    marginTop: 10,
  },
  listItem: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    width: '48%',
    marginBottom: 16,
  },
  status: {
    position: 'absolute',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
    top: 4,
    right: 4,
  },
});

export default MyProduct;
