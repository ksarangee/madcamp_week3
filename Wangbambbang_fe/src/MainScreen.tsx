import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';

type MainScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

type Props = {
  navigation: MainScreenNavigationProp;
};

const MainScreen: React.FunctionComponent<Props> = ({ navigation }) => {
  return (
    <View>
      
      <TouchableOpacity
        onPress={() => navigation.navigate('Ranking')}
      >
        <Image 
            style ={{
                width: 100,
                height: 100
            }}
          source={require('../assets/image/trophy.webp')}
        />
      </TouchableOpacity>

      <Text >왕밤빵</Text>

      <TouchableOpacity
        onPress = {() => navigation.navigate('Playing')}
        style ={{
            width: 200,
            height: 40,
            backgroundColor: '#FFED8D'
        }}>
        <Text>Play</Text>
      </TouchableOpacity>

      
    </View>
  );
};

export default MainScreen;
