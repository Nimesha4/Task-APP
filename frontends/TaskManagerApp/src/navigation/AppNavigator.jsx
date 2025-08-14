import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import TaskListScreen from '../screens/TaskListScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import PermissionGuard from '../components/PermissionGuard';
import { useSelector } from 'react-redux';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const user = useSelector(state => state.auth.user);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="TaskList" component={TaskListScreen} options={{ title: 'Tasks' }} />
            <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
