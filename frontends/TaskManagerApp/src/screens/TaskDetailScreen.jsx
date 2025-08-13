import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, updateTask } from '../redux/taskSlice';

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
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      {taskId && (
        <TextInput
          style={styles.input}
          placeholder="Status (OPEN / IN_PROGRESS / DONE)"
          value={status}
          onChangeText={setStatus}
        />
      )}
      <Button title={taskId ? 'Update Task' : 'Create Task'} onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
});
