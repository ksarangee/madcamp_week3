import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Animated
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import LottieView from 'lottie-react-native';

type MainScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

type Props = {
    navigation: MainScreenNavigationProp;
};

const PlayingScreen: React.FunctionComponent<Props> = ({ navigation }) => {
    const [progress] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(progress, {
            toValue: 250,
            duration: 3000,
          useNativeDriver: false, // useNativeDriver를 명시적으로 설정합니다.
        }).start();
    }, [progress]);

    return (
        <View style ={styles.container}>
            <TouchableOpacity style = {styles.header}
                onPress={() => navigation.navigate('Main')}>
                <Text >뒤로가기</Text>
            </TouchableOpacity>

            <View style ={styles.checkContainer}> 
                <View style = {styles.checkCircle}></View>
                <View style = {styles.checkCircle}></View>
                <View style = {styles.checkCircle}></View>
                <View style = {styles.checkCircle}></View>
                <View style = {styles.checkCircle}></View>
                <View style = {styles.checkCircle}></View>
            </View>

            <View style = {styles.timeBarContainer}>
                <Image style ={styles.clockImage}
                    source={require('../assets/image/alarm.png')}/>
                <Animated.View style={[styles.timeBar, { width: progress }]} />
            </View>

            <View style = {styles.textContainer}>
                <Text style = {styles.text}>경찰청쇠창살</Text>
            </View>

            <View style = {styles.micContainer}>
                <LottieView
                    style={{width: '30%', height: '100%',}}
                    source={require('../assets/lottie/soundwave.json')}
                    autoPlay
                    loop={true}/>
                <TouchableOpacity style = {styles.micButton}>
                    <Image style = {styles.micImage}
                        source = {require('../assets/image/mic.png')}/>
                </TouchableOpacity>
                <LottieView
                    style={{width: '30%', height: '100%',}}
                    source={require('../assets/lottie/soundwave.json')}
                    autoPlay
                    loop={true}/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#FFED8D',
        alignItems: 'center'
    },
    header: {
      height: 60,
      justifyContent: 'center'
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
        margin: 7
    },
    timeBarContainer: {
        flexDirection: 'row',
        marginVertical: 20,
        justifyContent: 'center',
        height: 50,

    },
    clockImage: {
        width: 40,
        height: 40,
    },
    timeBar: {
        height: 35,
        backgroundColor: '#A0EEFF',
        borderRadius: 35/2,
        marginLeft: 15,
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
        fontWeight: 'bold'
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
})

export default PlayingScreen;
