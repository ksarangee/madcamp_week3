import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Alert
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import LottieView from 'lottie-react-native';

type PlayingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Playing5'>;
type PlayingScreenRouteProp = RouteProp<RootStackParamList, 'Playing5'>;

type Props = {
    navigation: PlayingScreenNavigationProp;
    route: PlayingScreenRouteProp;
};

const PlayingScreen6: React.FunctionComponent<Props> = ({ navigation, route }) => {
    const [progress, setProgress] = useState(new Animated.Value(0));
    const { scripts } = route.params;

    const getDuration = (script: string) => {
        if (script.includes("short")) {
            return 1500; // 1.5초
        } else {
            return 4000; // 4초
        }
    };

    const startTimer = (duration: number) => {
        Animated.timing(progress, {
            toValue: 1,
            duration: duration,
            useNativeDriver: false,
        }).start(({ finished }) => {
            if (finished) {
                navigation.navigate('Score');
            }
        });
    };

    useEffect(() => {
        if (scripts.length > 0) {
            startTimer(getDuration(scripts[0]));
        }
    }, [scripts]);

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
                    <View style={styles.currentQuestionIndicator} />
                </View>
                {[...Array(0)].map((_, index) => (
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

export default PlayingScreen6;
