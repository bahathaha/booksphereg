import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Writer({ onBack }) {
  const [text, setText] = useState('');

  const handleSave = async () => {
    try {
      if (!text.trim()) return;

      await AsyncStorage.setItem('myNote', text);
      console.log('Saved!');
      onBack();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Write your own Plan</Text>
      </View>

      {/* SCROLLABLE CONTENT */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          placeholder="Start writing here"
          multiline
          value={text}
          onChangeText={setText}
          style={styles.input}
        />
      </ScrollView>

      {/* FLOATING + BUTTON */}
      <TouchableOpacity style={styles.plusBtn}>
        <Text style={styles.plusText}>+</Text>
      </TouchableOpacity>

      {/* SAVE BUTTON */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F3F1' },

  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  back: { fontSize: 30, marginRight: 10 },

  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B4A2B',
  },

  scrollContent: {
    paddingBottom: 220, // 🔥 extra space for buttons
  },

  input: {
    padding: 20,
    fontSize: 16,
    minHeight: 500,
    textAlignVertical: 'top',
  },

  /* SAVE BUTTON */
  saveBtn: {
    position: 'absolute',
    bottom: 60, // ✅ as you asked
    left: 20,
    right: 20,
    backgroundColor: '#557C8D',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 5,
  },

  saveText: {
    color: '#fff',
    fontSize: 16,
  },

  /* + BUTTON */
  plusBtn: {
    position: 'absolute',
    right: 20,
    bottom: 140, // ✅ above save (60 + button height gap)
    backgroundColor: '#557C8D',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },

  plusText: {
    color: '#fff',
    fontSize: 28,
    lineHeight: 30,
  },
});
