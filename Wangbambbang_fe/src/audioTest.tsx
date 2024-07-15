import React, {useEffect, useState} from 'react';
import {View, Button, Text, PermissionsAndroid, Alert} from 'react-native';
import {AudioRecorder, AudioUtils} from 'react-native-audio';

const AudioRecordExample = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [recording, setRecording] = useState(false);
  const [finished, setFinished] = useState(false);
  const [audioPath, setAudioPath] = useState(
    `${AudioUtils.DocumentDirectoryPath}/test.aac`,
  );

  useEffect(() => {
    const requestPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Audio Recording Permission',
            message: 'App needs access to your microphone to record audio.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      } catch (err) {
        console.warn(err);
      }
    };
    requestPermission();
  }, []);

  useEffect(() => {
    if (hasPermission) {
      AudioRecorder.prepareRecordingAtPath(audioPath, {
        SampleRate: 22050,
        Channels: 1,
        AudioQuality: 'High',
        AudioEncoding: 'aac',
        IncludeBase64: true, // Base64 인코딩을 포함하도록 설정
      });

      AudioRecorder.onProgress = data => {
        setCurrentTime(Math.floor(data.currentTime));
      };

      AudioRecorder.onFinished = data => {
        setFinished(data.status === 'OK');
        console.log(`Finished recording: ${data.audioFileURL}`);
        console.log(`Base64 Data: ${data.base64}`);
      };
    }
  }, [hasPermission, audioPath]);

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

  return (
    <View>
      <Text>Current Time: {currentTime}s</Text>
      <Button title="Start Recording" onPress={startRecording} />
      <Button title="Stop Recording" onPress={stopRecording} />
      {finished && <Text>Recording finished. File saved at: {audioPath}</Text>}
    </View>
  );
};

export default AudioRecordExample;
