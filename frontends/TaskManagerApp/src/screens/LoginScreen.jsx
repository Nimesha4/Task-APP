import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser } from '../redux/authSlice';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen({ navigation }) {
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
          setIsRegister(false);
          setName('');
          setPassword('');
          Alert.alert('Success', 'Registration successful! Please login.');
        })
        .catch(err => Alert.alert('Error', err.message));
    } else {
      dispatch(loginUser({ email, password }))
        .unwrap()
        .then(() => {
          navigation.replace('TaskList');
        })
        .catch(err => Alert.alert('Error', err.message));
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
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardContainer}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <LinearGradient
                  colors={['#4facfe', '#00f2fe']}
                  style={styles.logoGradient}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                >
                  <Text style={styles.logoText}>TM</Text>
                </LinearGradient>
              </View>
              <Text style={styles.appTitle}>Task Manager Pro</Text>
              <Text style={styles.subtitle}>Streamline your productivity workflow</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{isRegister ? 'Create Account' : 'Welcome Back'}</Text>
                <Text style={styles.titleSubtext}>
                  {isRegister ? 'Join thousands of productive professionals' : 'Sign in to access your workspace'}
                </Text>
              </View>
              
              {isRegister && (
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="Full Name"
                      placeholderTextColor="#8394a4"
                      value={name}
                      onChangeText={setName}
                    />
                    <View style={styles.inputFocusLine} />
                  </View>
                </View>
              )}
              
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    placeholderTextColor="#8394a4"
                    value={email}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onChangeText={setEmail}
                  />
                  <View style={styles.inputFocusLine} />
                </View>
              </View>
              
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#8394a4"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                  <View style={styles.inputFocusLine} />
                </View>
              </View>
              
              {isRegister && (
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="Role (ADMIN / USER)"
                      placeholderTextColor="#8394a4"
                      value={role}
                      onChangeText={setRole}
                    />
                    <View style={styles.inputFocusLine} />
                  </View>
                </View>
              )}

              {loading ? (
                <View style={styles.loadingContainer}>
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.loadingGradient}
                  >
                    <ActivityIndicator size="large" color="#FFFFFF" />
                    <Text style={styles.loadingText}>
                      {isRegister ? 'Creating account...' : 'Signing in...'}
                    </Text>
                  </LinearGradient>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.submitButton} 
                  onPress={handleSubmit}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.buttonGradient}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                  >
                    <Text style={styles.submitButtonText}>
                      {isRegister ? 'Create Account' : 'Sign In'}
                    </Text>
                    <View style={styles.buttonIcon}>
                      <Text style={styles.buttonIconText}>→</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              )}

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity 
                style={styles.switchContainer}
                onPress={() => setIsRegister(!isRegister)}
                activeOpacity={0.7}
              >
                <View style={styles.switchButton}>
                  <Text style={styles.switchText}>
                    {isRegister ? 'Already have an account?' : "Don't have an account?"}
                  </Text>
                  <Text style={styles.switchLink}>
                    {isRegister ? 'Sign In' : 'Sign Up'}
                  </Text>
                </View>
              </TouchableOpacity>

              {error && (
                <View style={styles.errorContainer}>
                  <LinearGradient
                    colors={['rgba(255, 107, 107, 0.1)', 'rgba(255, 142, 83, 0.1)']}
                    style={styles.errorGradient}
                  >
                    <Text style={styles.error}>{error}</Text>
                  </LinearGradient>
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  logoGradient: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
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
  titleContainer: {
    alignItems: 'center',
    marginBottom: 35,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
  },
  titleSubtext: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    fontWeight: '400',
  },
  inputContainer: {
    marginBottom: 24,
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
  submitButton: {
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIconText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  loadingGradient: {
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  switchContainer: {
    alignItems: 'center',
  },
  switchButton: {
    backgroundColor: '#f8fafc',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchText: {
    color: '#64748b',
    fontSize: 15,
    fontWeight: '500',
    marginRight: 4,
  },
  switchLink: {
    color: '#667eea',
    fontSize: 15,
    fontWeight: '700',
  },
  errorContainer: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  errorGradient: {
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  error: {
    color: '#dc2626',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
});