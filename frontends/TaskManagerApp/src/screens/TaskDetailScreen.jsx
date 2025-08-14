import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, updateTask } from '../redux/taskSlice';
import { LinearGradient } from 'expo-linear-gradient';

export default function TaskDetailScreen({ route, navigation }) {
  const dispatch = useDispatch();
  const { taskId } = route.params || {};
  const tasks = useSelector(state => state.tasks.tasks);
  const user = useSelector(state => state.auth.user);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('OPEN');

  useEffect(() => {
    if (taskId) {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        setTitle(task.title);
        setDescription(task.description);
        setStatus(task.status);
      }
    }
  }, [taskId, tasks]);

  const handleSave = async () => {
    if (!title) return Alert.alert('Error', 'Title is required');

    try {
      if (taskId) {
        await dispatch(updateTask({ id: taskId, title, description, status })).unwrap();
      } else {
        await dispatch(createTask({ title, description })).unwrap();
      }
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#1e3c72', '#2a5298', '#3f6bb6']}
        style={styles.gradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <View style={styles.headerIconCircle}>
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                style={styles.headerIconGradient}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
              >
                <Text style={styles.headerIcon}>📋</Text>
              </LinearGradient>
            </View>
            <Text style={styles.headerTitle}>
              {taskId ? 'Edit Task' : 'Create New Task'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {taskId ? 'Update your task details' : 'Add a new task to your workspace'}
            </Text>
          </View>

          <View style={styles.container}>
            <View style={styles.formCard}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Task Title</Text>
                <View style={styles.inputWrapper}>
                  <TextInput 
                    style={styles.input} 
                    placeholder="Enter task title" 
                    placeholderTextColor="#8394a4"
                    value={title} 
                    onChangeText={setTitle} 
                  />
                  <View style={styles.inputFocusLine} />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Description</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Enter task description"
                    placeholderTextColor="#8394a4"
                    value={description}
                    onChangeText={setDescription}
                    multiline={true}
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                  <View style={styles.inputFocusLine} />
                </View>
              </View>

              {taskId && (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Status</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="Status (OPEN / IN_PROGRESS / DONE)"
                      placeholderTextColor="#8394a4"
                      value={status}
                      onChangeText={setStatus}
                    />
                    <View style={styles.inputFocusLine} />
                  </View>
                </View>
              )}

              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={handleSave}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.buttonGradient}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                  >
                    <View style={styles.buttonContent}>
                      <Text style={styles.buttonIcon}>
                        {taskId ? '💾' : '➕'}
                      </Text>
                      <Text style={styles.buttonText}>
                        {taskId ? 'Update Task' : 'Create Task'}
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
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
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  headerContainer: {
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 40,
  },
  headerIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  headerIconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    fontWeight: '400',
  },
  container: { 
    flex: 1, 
    paddingHorizontal: 24,
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 28,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputContainer: {
    marginBottom: 28,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
    marginLeft: 4,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: { 
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 16,
    color: '#2c3e50',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    fontWeight: '500',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  inputFocusLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#667eea',
    borderRadius: 1,
    transform: [{ scaleX: 0 }],
  },
  buttonContainer: {
    marginTop: 20,
  },
  saveButton: {
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  buttonGradient: {
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});