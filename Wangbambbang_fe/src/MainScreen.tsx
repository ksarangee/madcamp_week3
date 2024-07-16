import React, {useState, useEffect} from 'react';
import {
  View,
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

const MainScreen: React.FunctionComponent<Props> = ({navigation}) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [fishImage, setFishImage] = useState(
    require('../assets/image/fishclose.png'),
  );
  const [playImage, setPlayImage] = useState(
    require('../assets/image/play1.png'),
  );

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

  useEffect(() => {
    const fishInterval = setInterval(() => {
      setFishImage((prevImage: any) =>
        prevImage === require('../assets/image/fishclose.png')
          ? require('../assets/image/fishopen.png')
          : require('../assets/image/fishclose.png'),
      );
    }, 500); // 전환 주기를 500ms로 설정

    const playInterval = setInterval(() => {
      setPlayImage((prevImage: any) =>
        prevImage === require('../assets/image/play1.png')
          ? require('../assets/image/play2.png')
          : require('../assets/image/play1.png'),
      );
    }, 250); // 전환 주기를 250ms로 설정

    return () => {
      clearInterval(fishInterval);
      clearInterval(playInterval);
    };
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.coralButton}
        onPress={() => navigation.navigate('Ranking')}>
        <Image
          style={styles.coralImage}
          source={require('../assets/image/coral.png')}
        />
      </TouchableOpacity>

      <Image
        style={styles.appNameImage}
        source={require('../assets/image/pkpk.png')}
      />

      <Image style={styles.iconPlaceholder} source={fishImage} />

      <TouchableOpacity
        onPress={() => navigation.navigate('Playing1', {hasPermission})}
        style={styles.playButton}>
        <Image style={styles.playButtonImage} source={playImage} />
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
  coralButton: {
    position: 'absolute',
    top: 20,
    right: 10,
  },
  coralImage: {
    width: 80,
    height: 80,
  },
  appNameImage: {
    position: 'absolute',
    top: height / 2 - 190,
    width: 300, // pkpk.png의 너비
    height: 100, // pkpk.png의 높이
    resizeMode: 'contain',
  },
  iconPlaceholder: {
    width: 250,
    height: 250,
    marginBottom: -30,
    resizeMode: 'contain',
  },
  playButton: {
    position: 'absolute',
    bottom: 90,
    justifyContent: 'center',
    alignItems: 'center',
    width: 220,
    height: 45,
  },
  playButtonImage: {
    width: '250%', // play1.png와 play2.png의 너비 조정
    height: '250%', // play1.png와 play2.png의 높이 조정
    resizeMode: 'contain',
  },
});

export default MainScreen;
