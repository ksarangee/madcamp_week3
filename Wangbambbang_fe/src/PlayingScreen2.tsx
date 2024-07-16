/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
  BackHandler,
  Dimensions,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import {AudioUtils, AudioRecorder} from 'react-native-audio';
import axios from 'axios';

import {RootStackParamList} from '../App';

type PlayingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Playing2'
>;
type PlayingScreenRouterProp = RouteProp<RootStackParamList, 'Playing2'>;

type Props = {
  navigation: PlayingScreenNavigationProp;
  route: PlayingScreenRouterProp;
};

type ScriptType = {
  content: string;
  level: string;
};

const {width, height} = Dimensions.get('window')

const PlayingScreen2: React.FunctionComponent<Props> = ({
  navigation,
  route,
}) => {
  const [progress, setProgress] = useState(new Animated.Value(0));
  const [scripts, setScripts] = useState<ScriptType[]>(
    route.params?.scripts || [],
  );
  const [recording, setRecording] = useState(false);
  const [recordingFinished, setRecordingFinished] = useState(false);
  const [audioPath] = useState(`${AudioUtils.DocumentDirectoryPath}/test.aac`);
  const [timerFinished, setTimerFinished] = useState(false);
  const [base64String, setBase64String] = useState('');
  const [scores, setScores] = useState<string[]>(route.params?.scores || []);
  const [isCancelled, setIsCancelled] = useState(false); // 녹음이 취소되었는지 여부를 나타내는 상태 변수

  const getDuration = (level: string) => {
    switch (level) {
      case '1':
        return 1500;
      default:
        return 3000;
    }
  };

  const startTimer = (duration: number) => {
    setTimerFinished(false);
    Animated.timing(progress, {
      toValue: 1,
      duration: duration,
      useNativeDriver: false,
    }).start(({finished}) => {
      if (finished) {
        setTimerFinished(true);
      }
    });
  };

  useEffect(() => {
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 16000,
      Channels: 1,
      AudioQuality: 'High',
      AudioEncoding: 'aac',
      IncludeBase64: true,
    });

    AudioRecorder.onFinished = data => {
      setRecordingFinished(data.status === 'OK');
      setBase64String(data.base64);
    };
  }, []);

  useEffect(() => {
    if (recording) {
      stopRecording();
    }
  }, [timerFinished]);

  useEffect(() => {
    if (recordingFinished && base64String && !isCancelled) {
      sendPost();
    }
  }, [recordingFinished, base64String]);

  const sendPost = async () => {
    try {
      const response = await axios.post(
        'http://10.0.2.2:3000/users/evaluate-pronunciation',
        {
          audioData: base64String,
          script: scripts[0].content,
        },
      );
      let {score} = response.data;

      if (isNaN(score)) {
        score = 1.0;
      }

      console.log('Score:', score);
      setScores([...scores, score]); // 점수를 배열에 추가

      navigation.navigate('Playing3', {
        scores: [...scores, score],
        scripts: scripts.slice(1),
      });
    } catch (error: any) {
      if (error.response) {
        console.error('Error response:', error.response.data);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }
  };

  useEffect(() => {
    if (scripts.length > 0) {
      startRecording();
      startTimer(getDuration(scripts[0].level));
    }
  }, [scripts]);

  const startRecording = async () => {
    if (recording) {
      return Alert.alert('Recording', 'Already recording');
    }

    try {
      await AudioRecorder.startRecording();
      setRecording(true);
    } catch (error) {
      console.error(error);
    }
  };

  const stopRecording = async () => {
    if (!recording) {
      return Alert.alert('Recording', 'Not currently recording');
    }

    try {
      await AudioRecorder.stopRecording();
      setRecording(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const backAction = () => {
      handleBackPress();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [recording]);

  const handleBackPress = () => {
    progress.stopAnimation();
    Alert.alert(
      '정말 나가시겠습니까?',
      '기록은 저장되지 않습니다',
      [
        {
          text: '취소',
          onPress: () => startTimer(getDuration(scripts[0].level)),
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: async () => {
            if (recording) {
              await stopRecording();
            }
            setIsCancelled(true); // 녹음 취소 상태로 설정
            navigation.navigate('Main');
          },
        },
      ],
      {cancelable: false},
    );
  };

  const animatedWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 220],
  });

  const barColor = progress.interpolate({
    inputRange: [0, 160 / 220, 200 / 220, 1],
    outputRange: ['#A0EEFF', '#A0EEFF', '#FF5C5C', '#FF5C5C'],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={handleBackPress}>
        <Image
          style={styles.backIcon}
          source={require('../assets/image/arrow_back.png')}
        />
      </TouchableOpacity>

      <View style={styles.checkContainer}>
        <View style={styles.checkCircle}>
          <Image
            style={styles.checkIcon}
            source={require('../assets/image/check.png')}
          />
        </View>
        <View style={styles.checkCircle}>
          <View style={styles.currentQuestionIndicator} />
        </View>
        {[...Array(4)].map((_, index) => (
          <View key={index} style={styles.checkCircle} />
        ))}
      </View>

      <View style={styles.timeBarContainer}>
        <Image
          style={styles.clockImage}
          source={require('../assets/image/alarm.png')}
        />
        <View style={styles.barBack} />
        <Animated.View
          style={[
            styles.timeBar,
            {width: animatedWidth, backgroundColor: barColor},
          ]}
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.text}>{scripts[0].content}</Text>
      </View>

      <View style={styles.micContainer}>
        <LottieView
          style={{width: '30%', height: '100%'}}
          source={require('../assets/lottie/soundwave.json')}
          autoPlay
          loop={true}
        />
        <TouchableOpacity style={styles.micButton}>
          <Image
            style={styles.micImage}
            source={require('../assets/image/mic.png')}
          />
        </TouchableOpacity>
        <LottieView
          style={{width: '30%', height: '100%'}}
          source={require('../assets/lottie/soundwave.json')}
          autoPlay
          loop={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFED8D',
    alignItems: 'center',
  },
  header: {
    height: 50,
    justifyContent: 'center',
  },
  backIcon: {
    width: 30,
    height: 30,
    marginLeft:  -170
  },
  checkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50
  },
  checkIcon: {
    width: 25,
    height: 25
  },
  checkCircle: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#FFFDF1',
    margin: 7,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  currentQuestionIndicator: {
    width: 35/2,
    height: 35/2,
    borderRadius: 35/4,
    backgroundColor: '#706DFF',
    position: 'absolute',
  },
  timeBarContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'center',
    height: height*0.08,
    width: width*0.8,
  },
  clockImage: {
    width: 35,
    height: 35,
    position: 'absolute',
    left: 5,
    top: 5,
  },
  barBack: {
    position: 'absolute',
    height: 30,
    width: 220,
    left: 60,
    top: 10,
    borderRadius: 15,
    backgroundColor: '#FFFDF1',
  },
  timeBar: {
    height: 30,
    borderRadius: 15,
    position: 'absolute',
    left: 60,
    top: 10,
  },
  textContainer: {
    width: width*0.8,
    height: height*0.35,
    borderRadius: 30,
    backgroundColor: '#FFFDF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  text: {
    fontSize: 60,
    color: 'black',
    //fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Dongle-Bold',
  },
  micContainer: {
    width: 320,
    height: 120,
    alignItems: 'center',
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  micButton: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: '#FFFDF1',
  },
  micImage: {
    width: 100,
    height: 100,
  },
});

export default PlayingScreen2;
