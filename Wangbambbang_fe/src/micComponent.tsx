import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Easing } from 'react-native';

const Mic = () => {
  const [micImage, setMicImage] = useState(require('../assets/image/mic.png'));
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {

    const startRotation = () => {
      Animated.sequence([
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 1000, // Slower rotation
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(rotateValue, {
          toValue: -1,
          duration: 1000, // Slower rotation
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start(() => startRotation());
    };

    startRotation();
  }, [rotateValue]);

  const rotate = rotateValue.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-10deg', '10deg'],
  });

  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      <Image source={micImage} style={styles.mic} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  mic: {
    height: 80,
    width: 60,
  },
});

export default Mic;
