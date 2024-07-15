import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { AudioUtils, AudioRecorder } from 'react-native-audio';
import axios from 'axios';

import { RootStackParamList } from '../App';

type PlayingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Playing3'>;
type PlayingScreenRouterProp = RouteProp<RootStackParamList, 'Playing3'>;

type Props = {
    navigation: PlayingScreenNavigationProp;
    route: PlayingScreenRouterProp;
};

const shortScript = ["맑음", "엄마", "아빠", "동생", "웃음"];
const longScript = ["안녕하세요 저는 이수민입니다", "만나서 반가워요", "막내가 제일 힘들어", "저는 커서 선생님이 될거에요"];

const getRandomElements = (array: string[], count: number) => {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

const PlayingScreen3: React.FunctionComponent<Props> = ({ navigation, route }) => {
    const [progress, setProgress] = useState(new Animated.Value(0));
    const [scripts, setScripts] = useState<string[]>([]);
    const [recording, setRecording] = useState(false);
    const [recordingFinished, setRecordingFinished] = useState(false);
    const [audioPath] = useState(`${AudioUtils.DocumentDirectoryPath}/test.aac`);
    const [timerFinished, setTimerFinished] = useState(false);
    const [base64String, setBase64String] = useState('');
    const [scores, setScores] = useState<number[]>(route.params?.scores || []);

    const getDuration = (script: string) => {
        return shortScript.includes(script) ? 2000 : 4000;
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
        }).start(({ finished }) => {
            if (finished) {              
                setTimerFinished(true);
            }
        });
    };

    useEffect(() => {

            AudioRecorder.prepareRecordingAtPath(audioPath, {
                SampleRate: 16000,
                Channels: 1,
                AudioQuality: "High",
                AudioEncoding: "aac",
                IncludeBase64: true,
            });

            AudioRecorder.onFinished = (data) => {
                setRecordingFinished(data.status === "OK");
                setBase64String(data.base64);
            };

    }, []);

    useEffect(() => {
        if (recording) {
            stopRecording();
        }
    }, [timerFinished]);

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
            let { score } = response.data;

            if (isNaN(score)) {
                score = 1.00;
            }
            
            console.log('Score:', score);
            setScores([...scores, score]); // 점수를 배열에 추가

            navigation.navigate('Playing4', { scores: [...scores, score], scripts: scripts.slice(1) });
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
            startTimer(getDuration(scripts[0]));
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
                    <Image style={styles.checkIcon} source={require('../assets/image/check.png')} />
                </View>
                <View style={styles.checkCircle}>
                    <Image style={styles.checkIcon} source={require('../assets/image/check.png')} />
                </View>
                <View style={styles.checkCircle}>
                    <View style={styles.currentQuestionIndicator} />
                </View>
                {[...Array(3)].map((_, index) => (
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
    checkIcon: {
        width: 30,
        height: 30,
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

export default PlayingScreen3;
