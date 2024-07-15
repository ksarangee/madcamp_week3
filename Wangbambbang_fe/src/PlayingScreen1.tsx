import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Alert,
    PermissionsAndroid,
    Platform
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import LottieView from 'lottie-react-native';
import { AudioUtils, AudioRecorder } from 'react-native-audio';
import { RouteProp } from '@react-navigation/native';
import axios from 'axios';

type PlayingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Playing1'>;
type PlayingScreenRouterProp = RouteProp<RootStackParamList, 'Playing1'>;

type Props = {
    navigation: PlayingScreenNavigationProp;
    route: PlayingScreenRouterProp;
};

const shortScript = [
    "맑음",
    "엄마",
    "아빠",
    "동생",
    "웃음",
];

const longScript = [
    "안녕하세요 저는 이수민입니다",
    "만나서 반가워요",
    "막내가 제일 힘들어",
    "저는 커서 선생님이 될거에요",
];



const getRandomElements = (array: string[], count: number) => {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

const PlayingScreen1: React.FunctionComponent<Props> = ({ navigation, route }) => {
    const [progress, setProgress] = useState(new Animated.Value(0));
    const [scripts, setScripts] = useState<string[]>([]);
    // const [hasPermission, setHasPermission] = useState(false);
    const {hasPermission} = route.params; 
    const [recording, setRecording] = useState(false);
    const [recordingFinished, setRecordingFinished] = useState(false);
    const [audioPath, setAudioPath] = useState(`${AudioUtils.DocumentDirectoryPath}/test.aac`);
    const [timerFinished, setTimerFinished] = useState(false);
    const [base64String, setBase64String] = useState('');
    


    const getDuration = (script: string) => {
        if (shortScript.includes(script)) {
            return 2000; // 1.5초
        } else {
            return 4000; // 4초
        }
    };

    useEffect(() => {
        const initialScripts = [
            ...getRandomElements(shortScript, 3),
            ...getRandomElements(longScript, 3)
        ];
        setScripts(initialScripts);
    }, []);


    const startTimer = (duration: number) => {
        setTimerFinished(false);
        Animated.timing(progress, {
            toValue: 1,
            duration: duration,
            useNativeDriver: false,
        }).start(async ({ finished }) => {
            if (finished) {              
                setTimerFinished(true);
                console.log("axios 앞", base64String);
            }
        });
    };

    useEffect(() => {
        if (hasPermission) {
            AudioRecorder.prepareRecordingAtPath(audioPath, {
                SampleRate: 16000,
                Channels: 1,
                AudioQuality: "High",
                AudioEncoding: "aac",
                IncludeBase64: true, // Base64 인코딩을 포함하도록 설정
            });

            AudioRecorder.onProgress = (data) => {
                // setCurrentTime(Math.floor(data.currentTime));
            };

            AudioRecorder.onFinished = (data) => {
                setRecordingFinished(data.status === "OK");
                setBase64String(data.base64);
                console.log(`Finished recording1: ${data.audioFileURL}`);
                // console.log(`Base64 Data: ${data.base64}`);

            };
        }
    }, []);

    useEffect (() => {
        console.log("recording start: ",recording)
    }, [recording])

    useEffect(() => {
        console.log("recording Stop: ", recordingFinished)
    }, [recordingFinished])

    useEffect(() => {
        if(recording) {
            stopRecording();
        }
        
    }, [timerFinished])

    useEffect(() => {
        if (recordingFinished && base64String) {
            sendPost();
        }
    }, [recordingFinished, base64String]);

    const sendPost = async () => {
        try {
          const response = await axios.post('http://10.0.2.2:3000/users/evaluate-pronunciation', {
            audioData: base64String,
            script: scripts[0]
          });
          console.log(response.data);
        } catch (error:any) {
          if (error.response) {
            // 서버가 응답했지만 상태 코드가 2xx 범위가 아닙니다.
            console.error('Error response:', error.response.data);
          } else if (error.request) {
            // 요청이 만들어졌지만 응답을 받지 못했습니다.
            console.error('Error request:', error.request);
          } else {
            // 요청을 설정하는 중에 오류가 발생했습니다.
            console.error('Error message:', error.message);
          }
        }
      };

    useEffect(() => {
        console.log("updated")
    }, [base64String])

    useEffect(() => {
        console.log(hasPermission);
        if (scripts.length > 0) {
            startRecording();
            startTimer(getDuration(scripts[0]));
        }
    }, [scripts, hasPermission]);

    const startRecording = async () => {
        if (!hasPermission) {
            return Alert.alert('Permission', 'Microphone permission not granted');
        }

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

    const handleBackPress = () => {
        progress.stopAnimation();
        Alert.alert(
            "정말 나가시겠습니까?",
            "기록은 저장되지 않습니다",
            [
                {
                    text: "취소",
                    onPress: () => startTimer(getDuration(scripts[0])),
                    style: "cancel"
                },
                {
                    text: "확인",
                    onPress: () => navigation.navigate('Main')
                }
            ],
            { cancelable: false }
        );
    };

    // const evaluatePronunciation = async (audioData: string, script: string) => {
    //     try {
    //       const response = await axios.post('http://10.0.2.2:3000/users/evaluate-pronunciation', {
    //         audioData,
    //         script,
    //       });
      
    //       console.log('Response:', response.data);
    //     } catch (error: any) {
    //         console.error('Error evaluating pronunciation:', error.response ? error.response.data : error.message);
    //       }
    //   };

    const animatedWidth = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 260]
    });

    const barColor = progress.interpolate({
        inputRange: [0, 160 / 260, 200 / 260, 1],
        outputRange: ['#A0EEFF', '#A0EEFF', '#FF5C5C', '#FF5C5C']
    });

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.header} onPress={handleBackPress}>
                <Image style={styles.backIcon} source={require('../assets/image/check.png')} />
            </TouchableOpacity>

            <View style={styles.checkContainer}>
                <View style={styles.checkCircle}>
                    <View style={styles.currentQuestionIndicator} />
                </View>
                {[...Array(5)].map((_, index) => (
                    <View key={index} style={styles.checkCircle} />
                ))}
            </View>

            <View style={styles.timeBarContainer}>
                <Image style={styles.clockImage} source={require('../assets/image/alarm.png')} />
                <View style={styles.barBack}></View>
                <Animated.View style={[styles.timeBar, { width: animatedWidth, backgroundColor: barColor }]} />
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.text}>{scripts[0]}</Text>
            </View>

            <View style={styles.micContainer}>
                <LottieView
                    style={{ width: '30%', height: '100%' }}
                    source={require('../assets/lottie/soundwave.json')}
                    autoPlay
                    loop={true}
                />
                <TouchableOpacity style={styles.micButton}>
                    <Image style={styles.micImage} source={require('../assets/image/mic.png')} />
                </TouchableOpacity>
                <LottieView
                    style={{ width: '30%', height: '100%' }}
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
        alignItems: 'center'
    },
    header: {
        height: 60,
        justifyContent: 'center'
    },
    backIcon: {
        width: 50,
        height: 50,
        justifyContent: 'flex-start'
    },
    checkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
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
        textAlign: 'center'
    },
    micContainer: {
        width: 320,
        height: 120,
        alignItems: 'center',
        marginTop: 40,
        flexDirection: 'row'
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
    }
});

export default PlayingScreen1;