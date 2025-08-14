import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store';

// Screens
import LoginScreen from './src/screens/LoginScreen.jsx';
import TaskListScreen from './src/screens/TaskListScreen.jsx';
import TaskDetailScreen from './src/screens/TaskDetailScreen.jsx';

// PermissionGuard Component
function PermissionGuard({ allowedRoles, children }) {
  const user = useSelector((state) => state.auth.user);

  if (!user) return null; // or you can redirect to login using navigation
  if (!allowedRoles.includes(user.role)) return <Text style={{ padding: 20, color: 'red' }}>Access Denied</Text>;

  return children;
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TaskList"
              component={TaskListScreen}
              options={{
                title: 'Tasks',
              }}
            />
            <Stack.Screen
              name="TaskDetail"
              component={TaskDetailScreen}
              options={{
                title: 'Task Detail',
              }}
            />
            {/* Example of PermissionGuard usage */}
            <Stack.Screen
              name="AdminPanel"
              component={() => <TaskListScreen />}
              options={{
                title: 'Admin Panel',
                headerRight: () => (
                  <PermissionGuard allowedRoles={['ADMIN']}>
                    {/* You can place any component like EditButton here */}
                  </PermissionGuard>
                ),
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
