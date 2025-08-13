import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, deleteTask } from '../redux/taskSlice';
import { logout } from '../redux/authSlice';

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

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.item, item.status === 'DONE' ? { backgroundColor: '#d4edda' } : {}]}
      onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text>Status: {item.status}</Text>
      {user.role === 'ADMIN' || item.userId === user.id ? (
        <Button title="Delete" color="red" onPress={() => handleDelete(item.id)} />
      ) : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={() => dispatch(logout())} />
      <FlatList
        data={tasks}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No tasks found</Text>}
      />
      <Button title="Add Task" onPress={() => navigation.navigate('TaskDetail')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  item: { padding: 15, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 10 },
  title: { fontWeight: 'bold', fontSize: 16 },
});
