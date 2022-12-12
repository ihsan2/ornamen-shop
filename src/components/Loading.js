import {View, StatusBar, Modal, ActivityIndicator} from 'react-native';
import React from 'react';

const Loading = ({loading}) => {
  if (!loading) {
    return null;
  }

  return (
    <View>
      <StatusBar backgroundColor={'#113764'} barStyle={'light-content'} />
      <Modal visible={loading} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              padding: 24,
              borderRadius: 8,
            }}>
            <ActivityIndicator color={'#113764'} size={'large'} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Loading;
