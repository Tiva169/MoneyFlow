import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, ViewStyle, TextStyle } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getTransactions } from '../../services/database';
import { colors, spacing, typography, shadows, borderRadius } from '../../theme';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: 'income' | 'expense';
  date: string;
  category?: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);

  const loadTransactions = async () => {
    try {
      console.log('Loading transactions...');
      const data = await getTransactions();
      console.log('Loaded transactions:', data);
      setTransactions(data as Transaction[]);
      
      // Calculate balance
      const totalIncome = data
        .filter((t: Transaction) => t.type === 'income')
        .reduce((sum, t: Transaction) => sum + t.amount, 0);
      const totalExpenses = data
        .filter((t: Transaction) => t.type === 'expense')
        .reduce((sum, t: Transaction) => sum + t.amount, 0);
      setBalance(totalIncome - totalExpenses);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  // Load data when screen comes into focus
  useFocusEffect(() => {
    loadTransactions();
  });

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        <Text style={styles.transactionDate}>
          {new Date(item.date).toLocaleDateString('th-TH')}
        </Text>
        {item.category && (
          <Text style={styles.transactionCategory}>หมวดหมู่: {item.category}</Text>
        )}
      </View>
      <Text
        style={[
          styles.transactionAmount,
          { color: item.type === 'income' ? colors.success : colors.danger },
        ]}
      >
        {item.type === 'income' ? '+' : '-'}฿{item.amount.toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>MoneyFlow</Text>
        <View style={styles.logoDecoration} />
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>ยอดเงินคงเหลือ</Text>
        <Text style={styles.balanceAmount}>฿ {balance.toLocaleString()}</Text>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#FF6B6B' }]}
          onPress={() => router.push('/add-transaction')}
        >
          <Ionicons name="add-circle" size={24} color="white" />
          <Text style={[styles.actionText, { color: 'white' }]}>บันทึกรายการ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#4ECDC4' }]}
          onPress={() => router.push('/goals')}
        >
          <Ionicons name="flag" size={24} color="white" />
          <Text style={[styles.actionText, { color: 'white' }]}>เป้าหมาย</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#FFD166' }]}
          onPress={() => router.push('/statistics')}
        >
          <Ionicons name="stats-chart" size={24} color="white" />
          <Text style={[styles.actionText, { color: 'white' }]}>สถิติ</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.recentTransactions}>
        <Text style={styles.sectionTitle}>รายการล่าสุด</Text>
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: '#F7F9FC', // Light blue background
  } as ViewStyle,
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    position: 'relative',
  } as ViewStyle,
  logo: {
    ...typography.h1,
    color: '#2D3436', // Dark gray
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    backgroundImage: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #FFD166)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  } as TextStyle,
  logoDecoration: {
    position: 'absolute',
    bottom: -8,
    width: '60%',
    height: 4,
    backgroundImage: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #FFD166)',
    borderRadius: 2,
  } as ViewStyle,
  balanceCard: {
    backgroundColor: 'white',
    padding: spacing.lg,
    borderRadius: borderRadius.large,
    marginBottom: spacing.md,
    borderLeftWidth: 8,
    borderLeftColor: '#4ECDC4',
    ...shadows.medium,
  } as ViewStyle,
  balanceLabel: {
    ...typography.body,
    color: '#2D3436',
  } as TextStyle,
  balanceAmount: {
    ...typography.h2,
    color: '#2D3436',
    marginTop: spacing.xs,
    fontWeight: 'bold',
  } as TextStyle,
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  } as ViewStyle,
  actionButton: {
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.medium,
    width: '30%',
    ...shadows.small,
  } as ViewStyle,
  actionText: {
    ...typography.small,
    marginTop: spacing.xs,
    fontWeight: 'bold',
  } as TextStyle,
  recentTransactions: {
    flex: 1,
    backgroundColor: 'white',
    padding: spacing.md,
    borderRadius: borderRadius.large,
    ...shadows.medium,
  } as ViewStyle,
  sectionTitle: {
    ...typography.h3,
    color: '#2D3436',
    marginBottom: spacing.md,
  } as TextStyle,
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  } as ViewStyle,
  transactionInfo: {
    flex: 1,
  } as ViewStyle,
  transactionDescription: {
    ...typography.body,
    color: '#2D3436',
    marginBottom: spacing.xs,
  } as TextStyle,
  transactionDate: {
    ...typography.small,
    color: '#636E72',
    marginBottom: spacing.xs,
  } as TextStyle,
  transactionCategory: {
    ...typography.small,
    color: '#636E72',
  } as TextStyle,
  transactionAmount: {
    ...typography.body,
    fontWeight: 'bold',
  } as TextStyle,
});
