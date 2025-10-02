import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import apiService, { LeaderboardEntry } from '@/services/apiService';
import { useAuth } from '@/contexts/AuthContext';

interface LeaderboardScreenProps {
  onClose: () => void;
}

type LeaderboardType = 'global' | 'daily' | 'weekly' | 'monthly';

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<LeaderboardType>('global');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchLeaderboard();
  }, [activeTab]);

  const fetchLeaderboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      let data: LeaderboardEntry[] = [];
      
      switch (activeTab) {
        case 'global':
          data = await apiService.getGlobalLeaderboard();
          break;
        case 'daily':
          data = await apiService.getDailyLeaderboard();
          break;
        case 'weekly':
          data = await apiService.getWeeklyLeaderboard();
          break;
        case 'monthly':
          data = await apiService.getMonthlyLeaderboard();
          break;
      }

      setLeaderboard(data);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load leaderboard');
      console.error('Leaderboard error:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchLeaderboard(true);
  };

  const renderLeaderboardItem = ({ item }: { item: LeaderboardEntry }) => {
    const isCurrentUser = user && item.username === user.username;
    
    return (
      <View style={[
        styles.leaderboardItem,
        isCurrentUser && styles.currentUserItem
      ]}>
        <View style={styles.rankContainer}>
          <Text style={[
            styles.rankText,
            item.rank <= 3 && styles.topRankText,
            isCurrentUser && styles.currentUserText
          ]}>
            {item.rank <= 3 ? getRankEmoji(item.rank) : `#${item.rank}`}
          </Text>
        </View>
        
        <View style={styles.userInfo}>
          <Text style={[
            styles.usernameText,
            isCurrentUser && styles.currentUserText
          ]}>
            {item.username}
            {isCurrentUser && ' (You)'}
          </Text>
        </View>
        
        <View style={styles.scoreContainer}>
          <Text style={[
            styles.scoreText,
            isCurrentUser && styles.currentUserText
          ]}>
            {item.score.toLocaleString()}
          </Text>
        </View>
      </View>
    );
  };

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getTabTitle = (type: LeaderboardType) => {
    switch (type) {
      case 'global': return 'All Time';
      case 'daily': return 'Today';
      case 'weekly': return 'This Week';
      case 'monthly': return 'This Month';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Leaderboard</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading leaderboard...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        {(['global', 'daily', 'weekly', 'monthly'] as LeaderboardType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab && styles.activeTabText
            ]}>
              {getTabTitle(tab)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.leaderboardContainer}>
        {leaderboard.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No scores yet!</Text>
            <Text style={styles.emptySubtext}>Be the first to set a high score</Text>
          </View>
        ) : (
          <FlatList
            data={leaderboard}
            renderItem={renderLeaderboardItem}
            keyExtractor={(item, index) => `${item.username}-${index}`}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                colors={['#4CAF50']}
                tintColor="#4CAF50"
              />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(17, 17, 17, 0.95)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#1a1a1a',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginHorizontal: 2,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#4CAF50',
  },
  tabText: {
    color: '#ccc',
    fontSize: 12,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  leaderboardContainer: {
    flex: 1,
    padding: 15,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  currentUserItem: {
    backgroundColor: '#4CAF50',
    borderColor: '#66BB6A',
  },
  rankContainer: {
    width: 60,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  topRankText: {
    fontSize: 24,
  },
  currentUserText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  usernameText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ccc',
    marginTop: 10,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubtext: {
    color: '#ccc',
    fontSize: 16,
  },
});

export default LeaderboardScreen;
