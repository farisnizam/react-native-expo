
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import alMathurat from '../../data/alMathurat.json';

const Bookmark = ({ time = 'evening' }) => {
  const recitations = alMathurat[time];
  const [highlightedId, setHighlightedId] = useState(null);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/sample1.mp3')
    );
    setSound(sound);

    await sound.playAsync();

    sound.setOnPlaybackStatusUpdate(status => {
      if (status.isPlaying) {
        const currentTime = status.positionMillis / 1000;
        const currentSegment = recitations.find(
          recitation => currentTime >= recitation.timestamp
        );
        if (currentSegment) {
          setHighlightedId(currentSegment.id);
        }
      }
    });
  };

  return (
    <ScrollView>
      <TouchableOpacity onPress={playSound}>
        <Text>Play</Text>
      </TouchableOpacity>
      {recitations.map(recitation => (
        <View key={recitation.id} style={styles.textContainer}>
          <Text
            style={[
              styles.text,
              recitation.id === highlightedId && styles.highlightedText
            ]}
          >
            {recitation.text}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    marginVertical: 10,
    paddingHorizontal: 20
  },
  text: {
    fontSize: 18,
    textAlign: 'right',
    writingDirection: 'rtl'
  },
  highlightedText: {
    backgroundColor: 'yellow'
  }
});

export default Bookmark;
