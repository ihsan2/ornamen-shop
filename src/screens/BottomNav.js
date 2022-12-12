import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
import Ionicons from 'react-native-vector-icons/Ionicons';

// tab
import Home from '../screens/Home';
import Order from '../screens/Order';
import Account from '../screens/Account';
import {primary_green, primary} from '../config/color';
import {useSelector} from 'react-redux';
import Login from './Login';
import Notification from './Notification';

const BottomNav = () => {
  const user = useSelector(state => state.user.user);
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Order') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Notification') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabelStyle: {fontWeight: 'bold'},
        tabBarActiveTintColor: primary_green,
        tabBarInactiveTintColor: primary,
      })}>
      <Tab.Screen options={{headerShown: false}} name="Home" component={Home} />
      <Tab.Screen
        options={{headerShown: user ? true : false}}
        name="Order"
        component={user ? Order : Login}
      />
      <Tab.Screen
        options={{headerShown: user ? true : false}}
        name="Notification"
        component={user ? Notification : Login}
      />
      <Tab.Screen
        options={{headerShown: false}}
        name="Account"
        component={user ? Account : Login}
      />
    </Tab.Navigator>
  );
};

export default BottomNav;
