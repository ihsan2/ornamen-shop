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

const Account = ({navigation}) => {
  const photo =
    'https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg';
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();

  const doLogout = () => {
    dispatch(setUserInfo(null));
    navigation.replace('Splash');
  };

  return (
    <SafeAreaView>
      <StatusBar backgroundColor={primary_green} />
      <View style={styles.top}>
        {user?.isSeller && (
          <TouchableOpacity
            style={styles.mystore}
            onPress={() => navigation.navigate('MyStore')}>
            <Label color="#fff" bold>
              Toko Saya
            </Label>
            <Icon name={'chevron-right'} size={20} color={'#fff'} />
          </TouchableOpacity>
        )}

        <View style={styles.topBottom}>
          <View>
            <Image source={{uri: photo}} style={styles.avatar} />
          </View>
          <View style={styles.profile}>
            <Label size={20} color={'#fff'} bold>
              {user?.name}
            </Label>
            <Label color="#fff" mt={4} mb={4}>
              {user?.email}
            </Label>
            <Label color="#fff">{user?.phone}</Label>
          </View>
        </View>
      </View>

      <View style={{marginTop: 20}}>
        {!user?.isSeller && (
          <TouchableOpacity
            style={styles.menu}
            onPress={() => navigation.navigate('RegisterToko')}>
            <Label bold size={15} color="#113764">
              Daftar Toko
            </Label>
            <Icon name={'chevron-right'} size={24} color={'#000'} />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.menuLogout}
          onPress={() => {
            doLogout();
          }}>
          <Label bold size={15} color="#fff">
            Logout
          </Label>
          <Icon name={'chevron-right'} size={24} color={'#fff'} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Account;

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
    justifyContent: 'space-between',
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
