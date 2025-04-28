import AsyncStorage from '@react-native-async-storage/async-storage';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: 'income' | 'expense';
  date: string;
  category?: string;
}

interface Goal {
  id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  created_at: string;
}

const TRANSACTIONS_KEY = '@moneyflow_transactions';
const GOALS_KEY = '@moneyflow_goals';

let isInitialized = false;

export const initDatabase = async () => {
  if (isInitialized) return;
  
  try {
    console.log('Initializing database...');
    // Initialize empty arrays if they don't exist
    const transactions = await AsyncStorage.getItem(TRANSACTIONS_KEY);
    if (!transactions) {
      console.log('Creating transactions array...');
      await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify([]));
    }

    const goals = await AsyncStorage.getItem(GOALS_KEY);
    if (!goals) {
      console.log('Creating goals array...');
      await AsyncStorage.setItem(GOALS_KEY, JSON.stringify([]));
    }
    
    isInitialized = true;
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export const addTransaction = async (
  amount: number,
  description: string,
  type: 'income' | 'expense',
  date: string,
  category?: string
) => {
  try {
    if (!isInitialized) {
      await initDatabase();
    }
    const transactionsStr = await AsyncStorage.getItem(TRANSACTIONS_KEY);
    const transactions: Transaction[] = transactionsStr ? JSON.parse(transactionsStr) : [];
    
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      amount,
      description,
      type,
      date,
      category,
    };

    transactions.push(newTransaction);
    await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
    console.log('Transaction added successfully:', newTransaction);
    return newTransaction.id;
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};

export const getTransactions = async () => {
  try {
    if (!isInitialized) {
      await initDatabase();
    }
    const transactionsStr = await AsyncStorage.getItem(TRANSACTIONS_KEY);
    const transactions: Transaction[] = transactionsStr ? JSON.parse(transactionsStr) : [];
    console.log('Transactions retrieved:', transactions);
    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error getting transactions:', error);
    throw error;
  }
};

export const addGoal = async (title: string, targetAmount: number, currentAmount: number, deadline: string) => {
  try {
    if (!isInitialized) {
      await initDatabase();
    }
    const goalsStr = await AsyncStorage.getItem(GOALS_KEY);
    const goals: Goal[] = goalsStr ? JSON.parse(goalsStr) : [];
    
    const newGoal: Goal = {
      id: Date.now().toString(),
      title,
      target_amount: targetAmount,
      current_amount: currentAmount,
      deadline,
      created_at: new Date().toISOString(),
    };

    goals.push(newGoal);
    await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(goals));
    console.log('Goal added successfully:', newGoal);
    return newGoal.id;
  } catch (error) {
    console.error('Error adding goal:', error);
    throw error;
  }
};

export const getGoals = async () => {
  try {
    if (!isInitialized) {
      await initDatabase();
    }
    const goalsStr = await AsyncStorage.getItem(GOALS_KEY);
    const goals: Goal[] = goalsStr ? JSON.parse(goalsStr) : [];
    console.log('Goals retrieved:', goals);
    return goals.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  } catch (error) {
    console.error('Error getting goals:', error);
    throw error;
  }
};

export const getMonthlyStatistics = async () => {
  try {
    if (!isInitialized) {
      await initDatabase();
    }
    const transactionsStr = await AsyncStorage.getItem(TRANSACTIONS_KEY);
    const transactions: Transaction[] = transactionsStr ? JSON.parse(transactionsStr) : [];

    const statistics = transactions.reduce((acc: any, transaction) => {
      const month = transaction.date.substring(0, 7); // YYYY-MM
      if (!acc[month]) {
        acc[month] = {
          month,
          total_income: 0,
          total_expense: 0,
        };
      }
      if (transaction.type === 'income') {
        acc[month].total_income += transaction.amount;
      } else {
        acc[month].total_expense += transaction.amount;
      }
      return acc;
    }, {});

    const result = Object.values(statistics).sort((a: any, b: any) => b.month.localeCompare(a.month));
    console.log('Monthly statistics retrieved:', result);
    return result;
  } catch (error) {
    console.error('Error getting monthly statistics:', error);
    throw error;
  }
}; 