import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Goal {
  id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  created_at: string;
}

const { width } = Dimensions.get('window');

export default function GoalDetailsScreen() {
  const router = useRouter();
  const { goal } = useLocalSearchParams();
  const goalData: Goal = JSON.parse(goal as string);

  const calculateProgress = (current: number, target: number) => {
    return (current / target) * 100;
  };

  const calculateRemaining = (target: number, current: number) => {
    return target - current;
  };

  const calculateDaysLeft = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return '#4CAF50';
    if (progress >= 75) return '#8BC34A';
    if (progress >= 50) return '#FFC107';
    if (progress >= 25) return '#FF9800';
    return '#F44336';
  };

  const progress = calculateProgress(goalData.current_amount, goalData.target_amount);
  const progressColor = getProgressColor(progress);
  const remainingAmount = calculateRemaining(goalData.target_amount, goalData.current_amount);
  const daysLeft = calculateDaysLeft(goalData.deadline);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>รายละเอียดเป้าหมาย</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.goalCard}>
          <View style={styles.cardContent}>
            <Text style={styles.goalTitle}>{goalData.title}</Text>
            
            <View style={styles.amountContainer}>
              <View style={styles.amountItem}>
                <Text style={styles.amountLabel}>เงินที่มี</Text>
                <Text style={styles.currentAmount}>{goalData.current_amount.toLocaleString()} บาท</Text>
              </View>
              <View style={styles.amountItem}>
                <Text style={styles.amountLabel}>เป้าหมาย</Text>
                <Text style={styles.targetAmount}>{goalData.target_amount.toLocaleString()} บาท</Text>
              </View>
              <View style={styles.amountItem}>
                <Text style={styles.amountLabel}>เงินที่เหลือ</Text>
                <Text style={styles.remainingAmount}>{remainingAmount.toLocaleString()} บาท</Text>
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

            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Ionicons name="calendar" size={20} color="#666" />
                <Text style={styles.infoText}>
                  ถึงวันที่: {new Date(goalData.deadline).toLocaleDateString('th-TH')}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="time" size={20} color="#666" />
                <Text style={styles.infoText}>
                  เหลืออีก {daysLeft} วัน
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="create" size={20} color="#666" />
                <Text style={styles.infoText}>
                  วันที่สร้าง: {new Date(goalData.created_at).toLocaleDateString('th-TH')}
                </Text>
              </View>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{progress.toFixed(1)}%</Text>
                <Text style={styles.statLabel}>ความคืบหน้า</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{daysLeft}</Text>
                <Text style={styles.statLabel}>วัน</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {Math.ceil(remainingAmount / Math.max(daysLeft, 1))}
                </Text>
                <Text style={styles.statLabel}>บาท/วัน</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
    backgroundColor: '#4CAF50',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
  },
  goalCard: {
    margin: 16,
    borderRadius: 16,
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    padding: 20,
  },
  goalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  amountContainer: {
    marginBottom: 20,
  },
  amountItem: {
    marginBottom: 16,
  },
  amountLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  currentAmount: {
    fontSize: 20,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  targetAmount: {
    fontSize: 20,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  remainingAmount: {
    fontSize: 20,
    color: '#F44336',
    fontWeight: 'bold',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  infoContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
}); 