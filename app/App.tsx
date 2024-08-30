import React from 'react';
import AppNavigator from './navigation/routes';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Mappable from 'react-native-mappable';
import {MAP_KEY} from './examples/api_keys';

Mappable.init(MAP_KEY);

Mappable.setLocale('en_US');

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <AppNavigator />
    </GestureHandlerRootView>
  );
};

export default App;
