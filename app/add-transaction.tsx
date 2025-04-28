import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ViewStyle, TextStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { addTransaction } from '../services/database';
import { spacing, typography, shadows, borderRadius } from '../theme';

export default function AddTransactionScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');

  const handleSubmit = async () => {
    if (!amount || !description) {
      Alert.alert('กรุณากรอกข้อมูล', 'กรุณากรอกจำนวนเงินและรายละเอียด');
      return;
    }

    try {
      await addTransaction(
        parseFloat(amount),
        description,
        type,
        new Date().toISOString(),
        category || undefined
      );
      router.back();
    } catch (error) {
      console.error('Error adding transaction:', error);
      Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกรายการได้');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2D3436" />
        </TouchableOpacity>
        <Text style={styles.title}>บันทึกรายการ</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.form}>
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'expense' && { backgroundColor: '#FF6B6B' }
            ]}
            onPress={() => setType('expense')}
          >
            <Text style={[
              styles.typeText,
              type === 'expense' && { color: 'white' }
            ]}>
              รายจ่าย
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'income' && { backgroundColor: '#4ECDC4' }
            ]}
            onPress={() => setType('income')}
          >
            <Text style={[
              styles.typeText,
              type === 'income' && { color: 'white' }
            ]}>
              รายรับ
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>จำนวนเงิน</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor="#636E72"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>รายละเอียด</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="รายละเอียดรายการ"
            placeholderTextColor="#636E72"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>หมวดหมู่ (ไม่บังคับ)</Text>
          <TextInput
            style={styles.input}
            value={category}
            onChangeText={setCategory}
            placeholder="เช่น อาหาร, การเดินทาง"
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
  typeSelector: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    backgroundColor: 'white',
    borderRadius: borderRadius.medium,
    padding: spacing.xs,
    ...shadows.small,
  } as ViewStyle,
  typeButton: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
    borderRadius: borderRadius.small,
  } as ViewStyle,
  typeText: {
    ...typography.body,
    color: '#636E72',
  } as TextStyle,
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