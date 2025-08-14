import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, RefreshControl, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, deleteTask } from '../redux/taskSlice';
import { logout } from '../redux/authSlice';
import { LinearGradient } from 'expo-linear-gradient';

export default function TaskListScreen({ navigation }) {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector(state => state.tasks);
  const user = useSelector(state => state.auth.user);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks());
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchTasks());
    setRefreshing(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteTask(id));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigation.replace('Login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return '#3498db';
      case 'IN_PROGRESS': return '#f39c12';
      case 'DONE': return '#27ae60';
      default: return '#3498db';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'OPEN': return '📝';
      case 'IN_PROGRESS': return '⚡';
      case 'DONE': return '✅';
      default: return '📝';
    }
  };

  

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.item, item.status === 'DONE' ? styles.itemCompleted : {}]}
      onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={item.status === 'DONE' ? ['#e8f8f5', '#d5f4e6'] : ['#ffffff', '#f8fafc']}
        style={styles.itemGradient}
      >
        <View style={styles.itemHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.statusContainer}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusIcon}>{getStatusIcon(item.status)}</Text>
                <Text style={styles.statusText}>{item.status.replace('_', ' ')}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.itemActions}>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.detailsButtonGradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
            >
              <Text style={styles.detailsButtonText}>View Details</Text>
              <Text style={styles.detailsButtonIcon}>👁️</Text>
            </LinearGradient>
          </TouchableOpacity>

          {user.role === 'ADMIN' || item.userId === user.id ? (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item.id)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['#ff6b6b', '#ff5252']}
                style={styles.deleteButtonGradient}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
                <Text style={styles.deleteButtonIcon}>🗑️</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : null}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

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
              </View>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
                  style={styles.logoutButtonGradient}
                >
                  <Text style={styles.logoutButtonText}>Logout</Text>
                  <Text style={styles.logoutButtonIcon}>🚪</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{tasks.length}</Text>
                <Text style={styles.statLabel}>Total Tasks</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {tasks.filter(task => task.status === 'DONE').length}
                </Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {tasks.filter(task => task.status === 'IN_PROGRESS').length}
                </Text>
                <Text style={styles.statLabel}>In Progress</Text>
              </View>
            </View>
          </View>

          {/* Task List Section */}
          <View style={styles.listContainer}>
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>Your Tasks</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('TaskDetail', { taskId: null })}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#4facfe', '#00f2fe']}
                  style={styles.addButtonGradient}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                >
                  <Text style={styles.addButtonIcon}>➕</Text>
                  <Text style={styles.addButtonText}>Add Task</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <FlatList
              data={tasks}
              keyExtractor={item => item.id.toString()}
              renderItem={renderItem}
              refreshControl={
                <RefreshControl 
                  refreshing={refreshing} 
                  onRefresh={onRefresh}
                  colors={['#667eea']}
                  tintColor="#667eea"
                />
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <View style={styles.emptyIconContainer}>
                    <Text style={styles.emptyIcon}>📝</Text>
                  </View>
                  <Text style={styles.emptyTitle}>No tasks found</Text>
                  <Text style={styles.emptySubtitle}>Create your first task to get started</Text>
                </View>
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          </View>
        </View>

        {/* Navigation Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigation.goBack()}
            disabled={!navigation.canGoBack()}
          >
            <Text style={[styles.navIcon, !navigation.canGoBack() && styles.disabledNavIcon]}>⬅️</Text>
            <Text style={[styles.navText, !navigation.canGoBack() && styles.disabledNavText]}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.navIcon}>🏠</Text>
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>
        </View>

      </LinearGradient>
    </SafeAreaView>
  );
}

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
    paddingBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
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
  logoutButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  logoutButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  logoutButtonIcon: {
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  listContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 24,
    paddingHorizontal: 4,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  listTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2c3e50',
  },
  addButton: {
    shadowColor: '#4facfe',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addButtonIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  item: { 
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  itemCompleted: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  itemGradient: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  itemHeader: {
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: { 
    fontWeight: '700', 
    fontSize: 18,
    color: '#2c3e50',
    flex: 1,
    marginRight: 12,
    lineHeight: 24,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 12,
  },
  detailsButton: {
    flex: 1,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  detailsButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  detailsButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  detailsButtonIcon: {
    fontSize: 14,
  },
  deleteButton: {
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  deleteButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  deleteButtonIcon: {
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  emptyIcon: {
    fontSize: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  navBar: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  backgroundColor: 'rgba(30, 60, 114, 0.9)',
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
disabledNavIcon: {
  opacity: 0.3,
},
disabledNavText: {
  opacity: 0.5,
},
});