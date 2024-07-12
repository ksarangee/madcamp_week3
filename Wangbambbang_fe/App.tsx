import React from 'react';
import {
  StyleSheet,
} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import MainScreen from './src/MainScreen';
import PlayingScreen from './src/PlayingScreen';
import ScoreScreen from './src/ScoreScreen';
import RankingScreen from './src/RankingScreen';

export type RootStackParamList = {
  Main: undefined;
  Ranking: undefined;
  Playing: undefined;
  Score: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen 
          name = "Main"
          component={MainScreen}
          options={{headerShown: false}}/>
          <Stack.Screen 
          name = "Playing"
          component={PlayingScreen}
          options={{headerShown: false}}/>
          <Stack.Screen 
          name = "Score"
          component={ScoreScreen}
          options={{headerShown: false}}/>
          <Stack.Screen 
          name = "Ranking"
          component={RankingScreen}
          options={{headerShown: false}}/>
      </Stack.Navigator>

    </NavigationContainer>
  );
}

export default App;
