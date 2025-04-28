import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ViewStyle, TextStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getMonthlyStatistics } from '../services/database';
import { spacing, typography, shadows, borderRadius } from '../theme';

interface CategoryStat {
  category: string;
  total_expenses: number;
  total_income: number;
  type: 'income' | 'expense';
}

interface MonthlyStat {
  month: string;
  total_income: number;
  total_expense: number;
}

export default function StatisticsScreen() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [statistics, setStatistics] = useState<CategoryStat[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStat[]>([]);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const currentDate = new Date();
      const data = await getMonthlyStatistics(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1
      );
      setStatistics(data as CategoryStat[]);

      // Calculate totals
      const expenses = data.reduce((sum, item) => sum + (item.total_expenses || 0), 0);
      const income = data.reduce((sum, item) => sum + (item.total_income || 0), 0);
      setTotalExpenses(expenses);
      setTotalIncome(income);

      const monthlyData = await getMonthlyStatistics();
      if (Array.isArray(monthlyData)) {
        setMonthlyStats(monthlyData as MonthlyStat[]);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const getCategoryColor = (index: number) => {
    const colors = ['#FF9800', '#2196F3', '#E91E63', '#9C27B0', '#4CAF50', '#FFC107'];
    return colors[index % colors.length];
  };

  const formatMonth = (monthString: string) => {
    const [year, month] = monthString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'long' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2D3436" />
        </TouchableOpacity>
        <Text style={styles.title}>สถิติ</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {monthlyStats.map((stat) => (
          <View key={stat.month} style={styles.statCard}>
            <Text style={styles.monthText}>{formatMonth(stat.month)}</Text>
            
            <View style={styles.incomeContainer}>
              <View style={styles.labelContainer}>
                <Ionicons name="arrow-up" size={20} color="#4ECDC4" />
                <Text style={styles.label}>รายรับ</Text>
              </View>
              <Text style={styles.incomeAmount}>
                ฿{stat.total_income.toLocaleString()}
              </Text>
            </View>

            <View style={styles.expenseContainer}>
              <View style={styles.labelContainer}>
                <Ionicons name="arrow-down" size={20} color="#FF6B6B" />
                <Text style={styles.label}>รายจ่าย</Text>
              </View>
              <Text style={styles.expenseAmount}>
                ฿{stat.total_expense.toLocaleString()}
              </Text>
            </View>

            <View style={styles.balanceContainer}>
              <Text style={styles.balanceLabel}>ยอดคงเหลือ</Text>
              <Text style={[
                styles.balanceAmount,
                { color: stat.total_income - stat.total_expense >= 0 ? '#4ECDC4' : '#FF6B6B' }
              ]}>
                ฿{(stat.total_income - stat.total_expense).toLocaleString()}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
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
  content: {
    flex: 1,
    padding: spacing.md,
  } as ViewStyle,
  statCard: {
    backgroundColor: 'white',
    padding: spacing.lg,
    borderRadius: borderRadius.large,
    marginBottom: spacing.md,
    ...shadows.medium,
  } as ViewStyle,
  monthText: {
    ...typography.h3,
    color: '#2D3436',
    marginBottom: spacing.lg,
    textAlign: 'center',
  } as TextStyle,
  incomeContainer: {
    marginBottom: spacing.md,
  } as ViewStyle,
  expenseContainer: {
    marginBottom: spacing.md,
  } as ViewStyle,
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  } as ViewStyle,
  label: {
    ...typography.body,
    color: '#636E72',
    marginLeft: spacing.xs,
  } as TextStyle,
  incomeAmount: {
    ...typography.h3,
    color: '#4ECDC4',
    fontWeight: 'bold',
  } as TextStyle,
  expenseAmount: {
    ...typography.h3,
    color: '#FF6B6B',
    fontWeight: 'bold',
  } as TextStyle,
  balanceContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    alignItems: 'center',
  } as ViewStyle,
  balanceLabel: {
    ...typography.body,
    color: '#636E72',
    marginBottom: spacing.xs,
  } as TextStyle,
  balanceAmount: {
    ...typography.h2,
    fontWeight: 'bold',
  } as TextStyle,
}); 