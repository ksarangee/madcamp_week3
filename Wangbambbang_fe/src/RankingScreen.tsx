/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ImageBackground,
} from 'react-native';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import {StackNavigationProp} from '@react-navigation/stack';
import axios from 'axios';

// 유저 타입 정의
interface User {
  username: string;
  score: number;
}

// axios 인스턴스 생성
const api = axios.create({
  baseURL: 'http://172.20.10.2:3000',
  timeout: 30000,
});

// React Navigation 관련 타입 정의
type RankingScreenRouteProp = RouteProp<RootStackParamList, 'Ranking'>;
type RankingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Ranking'
>;

const RankingScreen = () => {
  const route = useRoute<RankingScreenRouteProp>();
  const navigation = useNavigation<RankingScreenNavigationProp>();
  const [name, setName] = useState('');
  const score = route.params?.score || 0;
  const fromScoreScreen = route.params?.fromScoreScreen || false;
  const [users, setUsers] = useState<User[]>([]);

  const checkAndResetRanking = async () => {
    try {
      const response = await api.get('/users');
      const today = new Date().toISOString().split('T')[0]; // 오늘 날짜

      if (response.data.length > 0) {
        const firstUserDate = response.data[0].createdAt; // 첫 번째 유저의 날짜
        if (firstUserDate !== today) {
          // 날짜가 다르면 초기화
          await api.delete('/users');
          console.log('Ranking has been reset.');
        }
      }
    } catch (error) {
      console.error('Error checking/resetting ranking:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');
      await checkAndResetRanking(); // 유저 데이터 확인 및 초기화
      const response = await api.get('/users');
      console.log('Raw response:', response);
      if (Array.isArray(response.data)) {
        const sortedUsers = response.data.sort(
          (a: User, b: User) => b.score - a.score,
        );
        setUsers(sortedUsers);
        console.log('Sorted users:', sortedUsers);
      } else {
        console.error('Unexpected data format:', response.data);
        Alert.alert('Error', 'Unexpected data format received from server');
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Error response:', error.response.data);
          Alert.alert('Error', `Server error: ${error.response.data}`);
        } else if (error.request) {
          console.error('Error request:', error.request);
          Alert.alert('Error', 'No response received from server');
        } else {
          console.error('Error message:', error.message);
          Alert.alert('Error', `Request failed: ${error.message}`);
        }
      } else {
        console.error('Unknown error:', error);
        Alert.alert('Error', 'An unknown error occurred');
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddScore = async () => {
    if (name.trim() === '') return;
    try {
      const newUser = {username: name, score};
      await api.post('/users/save-score', newUser);
      setName('');
      navigation.navigate('Ranking', {fromScoreScreen: false});
      fetchUsers(); // 새 유저 추가 후 유저 리스트 다시 가져오기
    } catch (error: any) {
      console.error('Error saving score:', error);
      Alert.alert('Error', 'Failed to save score. Please try again.');
    }
  };

  const handleCancel = () => {
    setName('');
    navigation.navigate('Main');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.trophyImage}
        source={require('../assets/image/trophy.webp')}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.rankingContainer}>
          {users.length === 0 ? (
            <Text style={styles.emptyMessage}>
              오늘은 아직 아무도 플레이하지 않았어요!{'\n'}랭킹의 첫 주인공이
              되어주세요!
            </Text>
          ) : (
            users.slice(0, 10).map((user, index) => (
              <View key={index} style={styles.rankingItem}>
                {index < 3 ? (
                  <Image
                    style={styles.medalImage}
                    source={
                      index === 0
                        ? require('../assets/image/gold.png')
                        : index === 1
                        ? require('../assets/image/silver.png')
                        : require('../assets/image/bronze.png')
                    }
                  />
                ) : (
                  <Text style={styles.indexText}>{index + 1}</Text>
                )}
                <Text style={styles.rankingText}>{user.username}</Text>
                <Text style={styles.scoreText}>{user.score}</Text>
              </View>
            ))
          )}
        </View>
        {fromScoreScreen ? (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="기록하시겠어요? 이름을 남겨주세요!"
              value={name}
              onChangeText={setName}
            />
            <Text style={styles.scoreTextInput}>Score: {score}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleAddScore}>
                <Text style={styles.buttonText}>추가</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleCancel}>
                <Text style={styles.buttonText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.mainButtonContainer}>
            <TouchableOpacity
              style={styles.mainButton}
              onPress={() => navigation.navigate('Main')}>
              <Text style={styles.mainButtonText}>메인으로 돌아가기</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A0EEFF',
  },
  trophyImage: {
    width: 50,
    height: 50,
    alignSelf: 'center',
    marginVertical: 5,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  rankingContainer: {
    backgroundColor: '#FFFDF1',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  indexText: {
    fontSize: 25,
    fontFamily: 'Dongle-Bold',
    marginRight: 10, // 인덱스와 유저 이름 간격
    textAlign: 'center',
  },
  rankingText: {
    fontSize: 25,
    fontFamily: 'Dongle-Bold',
    flex: 1, // 유저 이름 공간 확장
    textAlign: 'center', // 유저 이름 가운데 정렬
  },
  scoreText: {
    fontSize: 25,
    fontFamily: 'Dongle-Bold',
    marginLeft: 20, // 유저 이름과 점수 간격 추가
  },
  medalImage: {
    width: 50,
    height: 50,
    marginLeft: -20, // 메달 이미지와 유저 이름 간격 추가
  },
  emptyMessage: {
    fontSize: 20,
    textAlign: 'center',
    color: '#D3D3D3',
    marginVertical: 30,
    fontFamily: 'Dongle-Regular',
  },
  inputContainer: {
    marginTop: 20,
    alignItems: 'center',
    width: '90%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  scoreTextInput: {
    fontSize: 25,
    marginVertical: 10,
    fontFamily: 'Dongle-Bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#FFED8D',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 30,
    color: '#706DFF',
    fontFamily: 'Dongle-Bold',
  },
  mainButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  mainButton: {
    backgroundColor: '#FFED8D',
    padding: 10,
    borderRadius: 5,
  },
  mainButtonText: {
    fontSize: 30,
    color: '#706DFF',
    fontFamily: 'Dongle-Bold',
  },
});

export default RankingScreen;
