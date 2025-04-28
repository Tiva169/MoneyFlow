import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions, ViewStyle, TextStyle } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getGoals } from '../services/database';
import { colors, spacing, typography, shadows, borderRadius } from '../theme';

interface Goal {
  id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  created_at: string;
}

const { width } = Dimensions.get('window');

export default function GoalsScreen() {
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const data = await getGoals();
      // Sort goals by completion percentage (highest first)
      const sortedGoals = data.sort((a, b) => {
        const progressA = (a.current_amount / a.target_amount) * 100;
        const progressB = (b.current_amount / b.target_amount) * 100;
        return progressB - progressA;
      });
      setGoals(sortedGoals);
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  // Load data when screen comes into focus
  useFocusEffect(() => {
    loadGoals();
  });

  const calculateProgress = (current: number, target: number) => {
    return (current / target) * 100;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return '#4ECDC4';
    if (progress >= 75) return '#FFD166';
    if (progress >= 50) return '#FF6B6B';
    if (progress >= 25) return '#A8DADC';
    return '#FF6B6B';
  };

  const handleGoalPress = (goal: Goal) => {
    router.push({
      pathname: '/goal-details',
      params: { goal: JSON.stringify(goal) }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2D3436" />
        </TouchableOpacity>
        <Text style={styles.title}>เป้าหมาย</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/add-goal')}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {goals.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="flag" size={64} color="#A8DADC" />
            <Text style={styles.emptyStateText}>ยังไม่มีเป้าหมาย</Text>
            <Text style={styles.emptyStateSubtext}>กดปุ่ม + เพื่อเพิ่มเป้าหมายใหม่</Text>
          </View>
        ) : (
          <View style={styles.goalsList}>
            {goals.map((goal) => {
              const progress = calculateProgress(goal.current_amount, goal.target_amount);
              const progressColor = getProgressColor(progress);
              
              return (
                <TouchableOpacity 
                  key={goal.id} 
                  style={styles.goalCard}
                  onPress={() => handleGoalPress(goal)}
                >
                  <View style={styles.cardContent}>
                    <View style={styles.goalHeader}>
                      <Text style={styles.goalTitle}>{goal.title}</Text>
                      <View style={styles.amountContainer}>
                        <View style={styles.amountItem}>
                          <Text style={styles.amountLabel}>เงินที่มี</Text>
                          <Text style={styles.currentAmount}>
                            {goal.current_amount.toLocaleString()} บาท
                          </Text>
                        </View>
                        <View style={styles.amountItem}>
                          <Text style={styles.amountLabel}>เป้าหมาย</Text>
                          <Text style={styles.targetAmount}>
                            {goal.target_amount.toLocaleString()} บาท
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            { 
                              width: `${Math.min(progress, 100)}%`,
                              backgroundColor: progressColor
                            },
                          ]}
                        />
                      </View>
                      <Text style={[styles.progressText, { color: progressColor }]}>
                        {progress.toFixed(1)}%
                      </Text>
                    </View>

                    <View style={styles.goalFooter}>
                      <View style={styles.dateContainer}>
                        <Ionicons name="calendar" size={16} color="#636E72" />
                        <Text style={styles.dateText}>
                          ถึงวันที่: {new Date(goal.deadline).toLocaleDateString('th-TH')}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
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
  addButton: {
    backgroundColor: '#FF6B6B',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  } as ViewStyle,
  content: {
    flex: 1,
  } as ViewStyle,
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  } as ViewStyle,
  emptyStateText: {
    ...typography.h3,
    color: '#2D3436',
    marginTop: spacing.md,
  } as TextStyle,
  emptyStateSubtext: {
    ...typography.caption,
    color: '#636E72',
    marginTop: spacing.xs,
  } as TextStyle,
  goalsList: {
    padding: spacing.md,
  } as ViewStyle,
  goalCard: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.large,
    backgroundColor: 'white',
    ...shadows.medium,
  } as ViewStyle,
  cardContent: {
    padding: spacing.md,
  } as ViewStyle,
  goalHeader: {
    marginBottom: spacing.sm,
  } as ViewStyle,
  goalTitle: {
    ...typography.h3,
    color: '#2D3436',
    marginBottom: spacing.sm,
  } as TextStyle,
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  } as ViewStyle,
  amountItem: {
    flex: 1,
  } as ViewStyle,
  amountLabel: {
    ...typography.small,
    color: '#636E72',
    marginBottom: spacing.xs,
  } as TextStyle,
  currentAmount: {
    ...typography.body,
    fontWeight: 'bold',
    color: '#4ECDC4',
  } as TextStyle,
  targetAmount: {
    ...typography.body,
    fontWeight: 'bold',
    color: '#FF6B6B',
  } as TextStyle,
  progressContainer: {
    marginTop: spacing.sm,
  } as ViewStyle,
  progressBar: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: borderRadius.small,
    marginBottom: spacing.xs,
  } as ViewStyle,
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.small,
  } as ViewStyle,
  progressText: {
    ...typography.caption,
    fontWeight: 'bold',
    textAlign: 'right',
  } as TextStyle,
  goalFooter: {
    marginTop: spacing.sm,
  } as ViewStyle,
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  dateText: {
    ...typography.small,
    color: '#636E72',
    marginLeft: spacing.xs,
  } as TextStyle,
}); 