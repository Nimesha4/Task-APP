import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser } from '../redux/authSlice';

export default function LoginScreen() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState('USER');

  const handleSubmit = () => {
    if (isRegister) {
      if (!name) return Alert.alert('Error', 'Name is required');
      dispatch(registerUser({ name, email, password, role }))
        .unwrap()
        .then(() => {
          setIsRegister(false); // Switch to login mode //
          setName('');
          setPassword('');
          Alert.alert('Success', 'Registration successful! Please login.');
        })
        .catch(err => Alert.alert('Error', err.message));
    } else {
      dispatch(loginUser({ email, password }))
        .unwrap()
        .catch(err => Alert.alert('Error', err.message));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegister ? 'Register' : 'Login'}</Text>
      {isRegister && (
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        autoCapitalize="none"
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {isRegister && (
        <TextInput
          style={styles.input}
          placeholder="Role (ADMIN / USER)"
          value={role}
          onChangeText={setRole}
        />
      )}
      {loading ? <ActivityIndicator size="large" /> :
        <Button title={isRegister ? 'Register' : 'Login'} onPress={handleSubmit} />}
      <Text style={styles.switchText} onPress={() => setIsRegister(!isRegister)}>
        {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
      </Text>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
  switchText: { color: 'blue', textAlign: 'center', marginTop: 15 },
  error: { color: 'red', textAlign: 'center', marginTop: 10 },
});
