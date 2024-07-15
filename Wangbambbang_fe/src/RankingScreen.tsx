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
  const [users, setUsers] = useState<User[]>([]); // 유저 타입을 명시적으로 지정

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('Fetching users...');
        const response = await axios.get('http://192.168.45.244:3000/users');
        console.log('Raw response:', response);
        console.log('Raw response data:', response.data);
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
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Axios error:', error.message);
          console.error('Error response:', error.response?.data);
          Alert.alert('Error', `Failed to fetch users: ${error.message}`);
        } else {
          console.error('Unknown error:', error);
          Alert.alert('Error', 'An unknown error occurred');
        }
      }
    };

    fetchUsers();
  }, []);

  const handleAddScore = () => {
    if (name.trim() === '') return;
    // addPlayer(name, score); // 이 부분은 현재 사용되지 않으므로 주석 처리
    setName('');
    navigation.navigate('Ranking', {fromScoreScreen: false});
  };

  const handleCancel = () => {
    setName('');
    navigation.navigate('Main');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.rankingContainer}>
          {users.map((user, index) => (
            <View key={index} style={styles.rankingItem}>
              <Text style={styles.rankingText}>
                {index + 1}. {user.username} - {user.score}
              </Text>
            </View>
          ))}
        </View>
        {fromScoreScreen ? (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="기록하시겠어요? 이름을 남겨주세요!"
              value={name}
              onChangeText={setName}
            />
            <Text style={styles.scoreText}>Score: {score}</Text>
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
    marginVertical: 5,
  },
  rankingText: {
    fontSize: 16,
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
  scoreText: {
    fontSize: 16,
    marginVertical: 10,
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
    fontSize: 20,
    color: '#706DFF',
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
    fontSize: 16,
    color: '#706DFF',
  },
});

export default RankingScreen;
