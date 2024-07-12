import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../App';
import LottieView from 'lottie-react-native';

type PlayingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Playing'
>;

type Props = {
  navigation: PlayingScreenNavigationProp;
};

const shortScript = [
  '경찰청 쇠창살',
  '홍천군청',
  '챠프포프프',
  '새우로얄뉴로얄',
  '시골 찹쌀 챗찹쌀 도시 찹쌀 촌찹쌀',
];

const longScript = [
  '저기 가는 저 상장사가 새 상 상장사냐 헌 상 상장사냐',
  '칠월칠일은 평창친구 친정 칠순 잔칫날',
  '신진 샹숑가수의 신춘 샹숑쇼우',
  '서울특별시 특허허가과 허가과장 허과장',
  '청단풍잎 홍단풍잎 흑단풍잎 백단풍잎',
];

const getRandomElements = (array: string[], count: number) => {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const PlayingScreen: React.FunctionComponent<Props> = ({navigation}) => {
  const [progress, setProgress] = useState(new Animated.Value(0));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [isPaused, setIsPaused] = useState(false);
  const [scripts, setScripts] = useState<string[]>([]);

  useEffect(() => {
    const initialScripts = [
      ...getRandomElements(shortScript, 3),
      ...getRandomElements(longScript, 3),
    ];
    setScripts(initialScripts);
  }, []);

  const getDuration = (script: string) => {
    if (shortScript.includes(script)) {
      return 1500; // 1.5초
    } else {
      return 4000; // 4초
    }
  };

  // startTimer 함수를 useCallback으로 감싸기
  const startTimer = useCallback(
    (duration: number) => {
      Animated.timing(progress, {
        toValue: 1,
        duration: duration,
        useNativeDriver: false,
      }).start(({finished}) => {
        if (finished) {
          if (currentQuestion < 5) {
            setCompletedQuestions(prevState => {
              const newState = [...prevState];
              newState[currentQuestion] = true;
              return newState;
            });
            setCurrentQuestion(currentQuestion + 1);
            progress.setValue(0);
            startTimer(getDuration(scripts[currentQuestion + 1]));
          } else {
            navigation.navigate('Score');
          }
        }
      });
    },
    [currentQuestion, progress, scripts, navigation],
  );

  // useEffect의 의존성 배열 수정
  useEffect(() => {
    if (!isPaused && scripts.length > 0) {
      startTimer(getDuration(scripts[currentQuestion]));
    }
  }, [currentQuestion, isPaused, scripts, startTimer]);

  const handleBackPress = () => {
    setIsPaused(true);
    progress.stopAnimation();
    Alert.alert(
      '정말 나가시겠습니까?',
      '기록은 저장되지 않습니다',
      [
        {
          text: '취소',
          onPress: () => {
            setIsPaused(false);
            startTimer(getDuration(scripts[currentQuestion]));
          },
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: () => navigation.navigate('Main'),
        },
      ],
      {cancelable: false},
    );
  };

  const animatedWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 260],
  });

  const barColor = progress.interpolate({
    inputRange: [0, 160 / 260, 200 / 260, 1],
    outputRange: ['#A0EEFF', '#A0EEFF', '#FF5C5C', '#FF5C5C'],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={handleBackPress}>
        <Image
          style={styles.backIcon}
          source={require('../assets/image/check.png')}
        />
      </TouchableOpacity>

      <View style={styles.checkContainer}>
        {completedQuestions.map((completed, index) => (
          <View key={index} style={styles.checkCircle}>
            {completed && (
              <Image
                style={styles.checkIcon}
                source={require('../assets/image/check.png')}
              />
            )}
            {index === currentQuestion && (
              <View style={styles.currentQuestionIndicator} />
            )}
          </View>
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
        <Text style={styles.text}>{scripts[currentQuestion]}</Text>
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
    height: 60,
    justifyContent: 'center',
  },
  backIcon: {
    width: 50,
    height: 50,
    justifyContent: 'flex-start',
  },
  checkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFDF1',
    margin: 7,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  currentQuestionIndicator: {
    width: 20,
    height: 20,
    borderRadius: 15,
    backgroundColor: '#706DFF',
    position: 'absolute',
  },
  checkIcon: {
    width: 30,
    height: 30,
  },
  timeBarContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    justifyContent: 'center',
    height: 50,
    width: 320,
  },
  clockImage: {
    width: 40,
    height: 40,
    position: 'absolute',
    left: 5,
    top: 5,
  },
  barBack: {
    position: 'absolute',
    height: 30,
    width: 260,
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
    width: 340,
    height: 300,
    borderRadius: 30,
    backgroundColor: '#FFFDF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  text: {
    fontSize: 40,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  micContainer: {
    width: 320,
    height: 120,
    alignItems: 'center',
    marginTop: 40,
    flexDirection: 'row',
  },
  micButton: {
    height: 120,
    width: 120,
    borderRadius: 60,
    backgroundColor: '#FFFDF1',
  },
  micImage: {
    width: 120,
    height: 120,
  },
});

export default PlayingScreen;
