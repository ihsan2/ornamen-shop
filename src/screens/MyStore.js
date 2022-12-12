import {
  View,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {primary, primary_green} from '../config/color';
import Label from '../components/Label';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/EvilIcons';
import {setUserInfo} from '../redux/actions/userActions';

const MyStore = ({navigation}) => {
  const photo =
    'https://static.vecteezy.com/system/resources/previews/003/346/398/original/shopping-store-or-market-icon-free-vector.jpg';
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();

  return (
    <SafeAreaView>
      <StatusBar backgroundColor={primary_green} />
      <View style={styles.top}>
        <View style={styles.topBottom}>
          <View>
            <Image source={{uri: photo}} style={styles.avatar} />
          </View>
          <View style={styles.profile}>
            <Label size={20} color={'#fff'} bold>
              {user?.storeName}
            </Label>
            <Label color="#fff" mt={4} mb={4}>
              {user?.storeAddress}
            </Label>
          </View>
        </View>
      </View>

      <View style={{marginTop: 20}}>
        <TouchableOpacity
          style={[styles.menu, {marginBottom: 16}]}
          onPress={() => navigation.navigate('MyOrder')}>
          <Icon name={'cart'} size={24} color={'#000'} />
          <Label bold size={15} ml={10} color="#113764">
            Pesanan Saya
          </Label>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menu, {marginBottom: 16}]}
          onPress={() => navigation.navigate('MyProduct')}>
          <Icon name={'archive'} size={24} color={'#000'} />
          <Label bold size={15} ml={10} color="#113764">
            Produk Saya
          </Label>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menu}
          onPress={() => {
            navigation.navigate('AddProduct');
          }}>
          <Icon name={'plus'} size={24} color={'#000'} />
          <Label bold size={15} ml={10} color="#113764">
            Tambah Produk
          </Label>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MyStore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  top: {
    backgroundColor: primary_green,

    paddingVertical: 36,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  topBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
  },
  profile: {
    marginLeft: 12,
    flex: 1,
  },
  menu: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bbb',
    marginHorizontal: 20,
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 16,
  },
  menuLogout: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e70000',
    marginHorizontal: 20,
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    backgroundColor: '#e70000',
    marginTop: 16,
  },
  mystore: {
    flexDirection: 'row',
    backgroundColor: '#1890FF',
    marginBottom: 20,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
    alignItems: 'center',
  },
});
