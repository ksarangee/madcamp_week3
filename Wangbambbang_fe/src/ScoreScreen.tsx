import LottieView from 'lottie-react-native';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../App';

type MainScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

type Props = {
  navigation: MainScreenNavigationProp;
};

const ScoreScreen: React.FunctionComponent<Props> = ({navigation}) => {
  return (
    <View style={styles.container}>
      <LottieView
        style={{width: '100%', height: '100%', position: 'absolute'}}
        source={require('../assets/lottie/confetti.json')}
        autoPlay
        loop={false}
      />
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>100</Text>
        <Text style={styles.comment}>아나운서 아니세요?</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Main')}>
          <Text style={styles.buttonText}>메인화면</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('Ranking', {
              fromScoreScreen: true,
              score: 100, // 실제 점수로 대체
            } as const)
          }>
          <Text style={styles.buttonText}>저장하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A0EEFF',
    alignItems: 'center',
  },
  scoreContainer: {
    width: 320,
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 100,
    position: 'absolute',
  },
  scoreText: {
    fontSize: 120,
  },
  comment: {
    fontSize: 20,
  },
  buttonContainer: {
    height: 80,
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 80,
  },
  button: {
    height: 60,
    width: 150,
    borderRadius: 30,
    backgroundColor: '#FFED8D',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: '#706DFF',
  },
});

export default ScoreScreen;
