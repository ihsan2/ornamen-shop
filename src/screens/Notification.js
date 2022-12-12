import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Loading from '../components/Loading';
import Label from '../components/Label';
import {useSelector} from 'react-redux';
import moment from 'moment';

const Notification = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const focus = useIsFocused();
  const user = useSelector(state => state.user.user);

  useEffect(() => {
    getData();
  }, [focus]);

  const getData = async () => {
    let arr = [];
    setLoading(true);
    firestore()
      .collection('Notifications')
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          arr.push({...doc.data(), id: doc.id});
        });
        setList(arr);
        setLoading(false);
      });
  };

  const renderItem = (item, key) => {
    return (
      <TouchableOpacity
        onPress={() => {
          user?.email == item?.detail?.email
            ? navigation.navigate('DetailMyProduct', {item: item?.detail})
            : navigation.navigate('DetailProduct', {item: item?.detail});
        }}
        style={[styles.listItem]}
        key={key}>
        <Label bold size={13} color={'#bbb'} mb={2}>
          Produk
        </Label>
        <Label bold size={14} color={'#113764'} mb={4}>
          {item?.title}
        </Label>
        <Label size={13} color={'#aaa'} mb={10}>
          {item?.body}
        </Label>
        <Label bold size={12} color={'#bbb'}>
          {moment(item?.created_at).format('DD MMMM YYYY HH:mm')}
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
            }}
          />
        }>
        <StatusBar backgroundColor={'#113764'} barStyle={'light-content'} />
        <Loading loading={loading} />
        <View style={styles.container}>
          <View style={styles.listWrap}>
            {list.map((item, key) => renderItem(item, key))}
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
  listWrap: {},
  listItem: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
  },
});

export default Notification;
