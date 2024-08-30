import React from 'react';
import {CLUSTERED_MAP, MAP_WITH_PRIMITIVES} from './routeNames';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import MapWithPrimitives from '../examples/MapWithPrimitives.tsx';
import ClusteredMap from '../examples/ClusteredMap.tsx';

const Stack = createStackNavigator();

function RootStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={MAP_WITH_PRIMITIVES}
        screenOptions={{headerShown: false}}>
        <Stack.Screen
          component={MapWithPrimitives}
          name={MAP_WITH_PRIMITIVES}
        />
        <Stack.Screen component={ClusteredMap} name={CLUSTERED_MAP} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootStack;
