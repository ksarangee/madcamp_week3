import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../App';

type MainScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

type Props = {
  navigation: MainScreenNavigationProp;
};

const {width, height} = Dimensions.get('window');

const MainScreen: React.FunctionComponent<Props> = ({navigation}) => {
  const [hasPermission, setHasPermission] = useState(false);
  useEffect(() => {
    const requestAudioPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
              title: 'Audio Permission',
              message: 'App needs access to your microphone to record audio.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert(
              'Permission denied',
              'You need to give audio permission to use this feature.',
            );
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };

    requestAudioPermission();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.trophyButton}
        onPress={() => navigation.navigate('Ranking')}>
        <Image
          style={styles.trophyImage}
          source={require('../assets/image/trophy.jpg')}
        />
      </TouchableOpacity>

      <Text style={styles.appName}>왕밤빵</Text>

      <View style={styles.iconPlaceholder} />

      <TouchableOpacity
        onPress={() => navigation.navigate('Playing1', {hasPermission})}
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
    width: 60,
    height: 60,
  },
  appName: {
    position: 'absolute',
    top: height / 2 - 170,
    fontSize: 55,
    //fontWeight: 'bold',
    color: 'black',
    fontFamily: 'Dongle-Bold',
  },
  iconPlaceholder: {
    width: 100,
    height: 100,
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  playButton: {
    position: 'absolute',
    bottom: height/7,
    flexDirection: 'row', // 아이콘과 텍스트를 나란히 배치
    alignItems: 'center', // 수직 중앙 정렬
    width: 200,
    height: 70,
    backgroundColor: '#FFED8D',
    justifyContent: 'center',
    borderRadius: 35,
  },
  playButtonText: {
    fontSize: 45,
    //fontWeight: 'bold',
    color: '#706DFF',
    fontFamily: 'Dongle-Bold',
    marginRight: 10, // 아이콘과 텍스트 사이에 공간 추가
  },
  playIcon: {
    width: 20, // 아이콘 크기 조절
    height: 20,
  },
});

export default MainScreen;
