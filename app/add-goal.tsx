import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ViewStyle, TextStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { addGoal } from '../services/database';
import { colors, spacing, typography, shadows, borderRadius } from '../theme';

export default function AddGoalScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = async () => {
    if (!title || !targetAmount || !deadline) {
      Alert.alert('กรุณากรอกข้อมูล', 'กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }

    try {
      await addGoal(
        title,
        parseFloat(targetAmount),
        0,
        deadline
      );
      router.back();
    } catch (error) {
      console.error('Error adding goal:', error);
      Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกเป้าหมายได้');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2D3436" />
        </TouchableOpacity>
        <Text style={styles.title}>เพิ่มเป้าหมาย</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>ชื่อเป้าหมาย</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="เช่น ซื้อรถใหม่"
            placeholderTextColor="#636E72"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>จำนวนเงินเป้าหมาย</Text>
          <TextInput
            style={styles.input}
            value={targetAmount}
            onChangeText={setTargetAmount}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor="#636E72"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>วันที่ต้องการให้สำเร็จ</Text>
          <TextInput
            style={styles.input}
            value={deadline}
            onChangeText={setDeadline}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#636E72"
          />
        </View>

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>บันทึก</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    paddingTop: spacing.xl,
    backgroundColor: 'white',
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    ...shadows.large,
  } as ViewStyle,
  title: {
    ...typography.h2,
    color: '#2D3436',
    backgroundImage: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #FFD166)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  } as TextStyle,
  form: {
    padding: spacing.md,
  } as ViewStyle,
  inputGroup: {
    marginBottom: spacing.lg,
  } as ViewStyle,
  label: {
    ...typography.body,
    color: '#2D3436',
    marginBottom: spacing.sm,
  } as TextStyle,
  input: {
    backgroundColor: 'white',
    padding: spacing.md,
    borderRadius: borderRadius.medium,
    ...typography.body,
    color: '#2D3436',
    ...shadows.small,
  } as TextStyle,
  submitButton: {
    backgroundColor: '#4ECDC4',
    padding: spacing.lg,
    borderRadius: borderRadius.medium,
    alignItems: 'center',
    marginTop: spacing.xl,
    ...shadows.medium,
  } as ViewStyle,
  submitButtonText: {
    color: 'white',
    ...typography.body,
    fontWeight: 'bold',
  } as TextStyle,
}); 