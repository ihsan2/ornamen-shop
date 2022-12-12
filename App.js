import * as React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './src/redux/configureStore';
import Label from './src/components/Label';

// welcome
import Splash from './src/screens/Splash';
import BottomNav from './src/screens/BottomNav';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import RegisterToko from './src/screens/RegisterToko';
import MyStore from './src/screens/MyStore';
import AddProduct from './src/screens/AddProduct';
import MyProduct from './src/screens/MyProduct';
import DetailMyProduct from './src/screens/DetailMyProduct';
import DetailProduct from './src/screens/DetailProduct';
import OrderProduct from './src/screens/OrderProduct';
import ProofTransfer from './src/screens/ProofTransfer';
import MyOrder from './src/screens/MyOrder';
import DetailMyOrder from './src/screens/DetailMyOrder';
import EditProduct from './src/screens/EditProduct';
import Intro from './src/screens/Intro';

const toastConfig = {
  success: ({text1, props}) => (
    <View style={_styles.containerSuccess}>
      <Image
        source={require('./src/images/ic-success.png')}
        style={{tintColor: '#fff'}}
      />
      <Text style={_styles.message}>{text1}</Text>
    </View>
  ),
  error: ({text1, props}) => (
    <View style={_styles.containerError}>
      <Image
        source={require('./src/images/ic-close.png')}
        style={{tintColor: '#fff'}}
      />
      <Text style={_styles.message}>{text1}</Text>
    </View>
  ),
  warning: ({text1, props}) => (
    <View style={_styles.containerWarning}>
      <Image
        source={require('./src/images/ic-info.png')}
        style={{tintColor: '#fff'}}
      />
      <Text style={_styles.message}>{text1}</Text>
    </View>
  ),
  notif: ({text1, text2, onPress, props}) => (
    <TouchableOpacity style={_styles.containerNotif} onPress={() => onPress()}>
      <Image style={_styles.logo} source={require('./src/images/logo1.png')} />
      <View style={_styles.bodyNotif}>
        <Text style={_styles.messageNotif}>{text1}</Text>
        <Text style={_styles.messageNotifSub}>{text2}</Text>
      </View>
    </TouchableOpacity>
  ),
};

const Stack = createNativeStackNavigator();
const AppStack = createStackNavigator();

function LogoTitle() {
  return (
    <Label size={20} bold color="#fff" style={{letterSpacing: 4}}>
      Ornamen
    </Label>
  );
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen
              options={{headerShown: false}}
              name="Splash"
              component={Splash}
            />
            <Stack.Screen
              options={{headerShown: false}}
              name="Intro"
              component={Intro}
            />
            <Stack.Screen
              options={{headerShown: false}}
              name="BottomNav"
              component={BottomNav}
            />
            <Stack.Screen
              options={{headerShown: false}}
              name="Login"
              component={Login}
            />
            <Stack.Screen
              options={{headerShown: false}}
              name="Register"
              component={Register}
            />
            <Stack.Screen
              options={{headerShown: false}}
              name="RegisterToko"
              component={RegisterToko}
            />
            <Stack.Screen
              options={{headerShown: false}}
              name="MyStore"
              component={MyStore}
            />
            <Stack.Screen
              options={{title: 'Tambah Produk'}}
              name="AddProduct"
              component={AddProduct}
            />
            <Stack.Screen
              options={{title: 'Ubah Produk'}}
              name="EditProduct"
              component={EditProduct}
            />
            <Stack.Screen
              options={{title: 'Produk Saya'}}
              name="MyProduct"
              component={MyProduct}
            />
            <Stack.Screen
              options={{title: 'Detail Produk'}}
              name="DetailMyProduct"
              component={DetailMyProduct}
            />
            <Stack.Screen
              options={{title: 'Detail Produk'}}
              name="DetailProduct"
              component={DetailProduct}
            />
            <Stack.Screen
              options={{title: 'Order Produk'}}
              name="OrderProduct"
              component={OrderProduct}
            />
            <Stack.Screen
              options={{title: 'Kirim Bukti Transfer'}}
              name="Proof"
              component={ProofTransfer}
            />
            <Stack.Screen
              options={{title: 'Pesanan Saya'}}
              name="MyOrder"
              component={MyOrder}
            />
            <Stack.Screen
              options={{title: 'Detail Pesanan'}}
              name="DetailMyOrder"
              component={DetailMyOrder}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <Toast ref={ref => Toast.setRef(ref)} config={toastConfig} />
      </PersistGate>
    </Provider>
  );
}

export default App;

const _styles = StyleSheet.create({
  containerSuccess: {
    backgroundColor: '#52C41A',
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  containerError: {
    backgroundColor: '#e70000',
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  containerWarning: {
    backgroundColor: '#FFA70B',
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  containerNotif: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    flexDirection: 'row',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  logo: {
    width: 60,
    height: 60,
  },
  messageNotif: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  messageNotifSub: {
    fontSize: 14,
    marginLeft: 8,
  },
  bodyNotif: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 8,
  },
});
