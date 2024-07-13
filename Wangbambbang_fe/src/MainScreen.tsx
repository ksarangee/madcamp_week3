import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../App';

type MainScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

type Props = {
  navigation: MainScreenNavigationProp;
};

const MainScreen: React.FunctionComponent<Props> = ({navigation}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.trophyButton}
        onPress={() => navigation.navigate('Ranking')}>
        <Image
          style={styles.trophyImage}
          source={require('../assets/image/trophy.webp')}
        />
      </TouchableOpacity>

      <Text style={styles.appName}>왕밤빵</Text>

      <View style={styles.iconPlaceholder}></View>

      <TouchableOpacity
        onPress={() => navigation.navigate('Playing')}
        style={styles.playButton}>
        <Text style={styles.playButtonText}>Play!</Text>
        <Image
          style={styles.playIcon}
          source={require('../assets/image/play.png')} // 아이콘 이미지 파일 경로
        />
      </TouchableOpacity>
    </View>
  );
};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A0EEFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trophyButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  trophyImage: {
    width: 70,
    height: 70,
  },
  appName: {
    position: 'absolute',
    top: height / 2 - 170,
    fontSize: 55,
    fontWeight: 'bold',
    color: 'black',
  },
  iconPlaceholder: {
    width: 100,
    height: 100,
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  playButton: {
    position: 'absolute',
    bottom: 100,
    flexDirection: 'row', // 아이콘과 텍스트를 나란히 배치
    alignItems: 'center', // 수직 중앙 정렬
    width: 200,
    height: 50,
    backgroundColor: '#FFED8D',
    justifyContent: 'center',
    borderRadius: 25,
  },
  playButtonText: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#706DFF',
    marginRight: 10, // 아이콘과 텍스트 사이에 공간 추가
  },
  playIcon: {
    width: 25, // 아이콘 크기 조절
    height: 25,
  },
});

export default MainScreen;
