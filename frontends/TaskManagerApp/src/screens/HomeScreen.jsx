import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';

const HomeScreen = ({ navigation }) => {
  const user = useSelector(state => state.auth.user);
  const tasks = useSelector(state => state.tasks.tasks);
  
  // Calculate statistics
  const completedTasks = tasks.filter(task => task.status === 'DONE').length;
  const inProgressTasks = tasks.filter(task => task.status === 'IN_PROGRESS').length;
  const urgentTasks = tasks.filter(task => task.priority === 'HIGH').length;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const productivityScore = Math.min(100, Math.round((completedTasks * 10) + (inProgressTasks * 5)));

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#1e3c72', '#2a5298', '#3f6bb6']}
        style={styles.gradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
      >
        <View style={styles.container}>
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <View style={styles.headerContent}>
              <View style={styles.welcomeSection}>
                <Text style={styles.welcomeText}>Welcome back,</Text>
                <Text style={styles.userName}>{user?.name || 'User'}</Text>
                <Text style={styles.userStatus}>
                  {user?.role === 'ADMIN' ? 'Administrator' : 'Team Member'}
                </Text>
              </View>
            </View>
          </View>

          {/* Main Content - Three Enhanced Cards */}
          <View style={styles.contentContainer}>
            <Text style={styles.sectionTitle}>Task Manager</Text>
            
            {/* Card 1: Task List */}
            <TouchableOpacity 
              style={[styles.card, styles.taskListCard]}
              onPress={() => navigation.navigate('TaskList')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                style={styles.cardGradient}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardIcon}>📋</Text>
                  <View style={styles.taskCountBadge}>
                    <Text style={styles.taskCountText}>{tasks.length}</Text>
                  </View>
                </View>
                <Text style={styles.cardTitle}>Task List</Text>
                <View style={styles.taskStatusContainer}>
                  <View style={styles.taskStatusItem}>
                    <Text style={styles.taskStatusValue}>{completedTasks}</Text>
                    <Text style={styles.taskStatusLabel}>Done</Text>
                  </View>
                  <View style={styles.taskStatusItem}>
                    <Text style={styles.taskStatusValue}>{inProgressTasks}</Text>
                    <Text style={styles.taskStatusLabel}>In Progress</Text>
                  </View>
                  <View style={styles.taskStatusItem}>
                    <Text style={styles.taskStatusValue}>{urgentTasks}</Text>
                    <Text style={styles.taskStatusLabel}>Urgent</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Card 2: Create Task */}
            <TouchableOpacity 
              style={[styles.card, styles.createTaskCard]}
              onPress={() => navigation.navigate('TaskDetail', { taskId: null })}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.cardGradient}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
              >
                <View style={styles.createTaskContent}>
                  <Text style={styles.cardIconLarge}>➕</Text>
                  <Text style={styles.cardTitleLarge}>Create Task</Text>
                  <Text style={styles.cardSubtitle}>Tap to add a new task</Text>
                </View>
                <View style={styles.taskTypes}>
                  <View style={styles.taskType}>
                    <Text style={styles.taskTypeIcon}>💼</Text>
                    <Text style={styles.taskTypeText}>Work</Text>
                  </View>
                  <View style={styles.taskType}>
                    <Text style={styles.taskTypeIcon}>🏠</Text>
                    <Text style={styles.taskTypeText}>Personal</Text>
                  </View>
                  <View style={styles.taskType}>
                    <Text style={styles.taskTypeIcon}>🔔</Text>
                    <Text style={styles.taskTypeText}>Reminder</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

          
          </View>
        </View>

        {/* Bottom Navigation Bar */}
        <View style={styles.navBar}>

          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigation.replace('Login')}
          >
            <Text style={styles.navIcon}>🔒</Text>
            <Text style={styles.navText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1e3c72',
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerContainer: {
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
  },
  userName: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
    marginTop: 4,
  },
  userStatus: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontStyle: 'italic',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cardGradient: {
    padding: 20,
  },
  taskListCard: {
    height: 180,
  },
  createTaskCard: {
    height: 180,
  },
  productivityCard: {
    height: 280,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 36,
    color: '#fff',
  },
  cardIconLarge: {
    fontSize: 48,
    color: '#fff',
    marginBottom: 8,
  },
  taskCountBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  taskCountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    marginBottom: 16,
  },
  cardTitleLarge: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  taskStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskStatusItem: {
    alignItems: 'center',
  },
  taskStatusValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  taskStatusLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  createTaskContent: {
    alignItems: 'center',
    marginBottom: 16,
  },
  taskTypes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  taskType: {
    alignItems: 'center',
  },
  taskTypeIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  taskTypeText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  productivityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  specialCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  profileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  progressRingContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  progressRingBackground: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressRingFill: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: '#fff',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    transformOrigin: 'center',
  },
  progressRingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  productivityStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  productivityStat: {
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  recentActivity: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 12,
  },
  activityTitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  activityText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 60, 114, 0.95)',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  navButton: {
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  navIcon: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 4,
  },
  navText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default HomeScreen;