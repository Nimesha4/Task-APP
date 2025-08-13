import React from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';

export default function PermissionGuard({ allowedRoles, children }) {
  const user = useSelector(state => state.auth.user);

  if (!user) return <Text>Redirecting to login...</Text>;
  if (!allowedRoles.includes(user.role)) return <Text>Access Denied</Text>;

  return <>{children}</>;
}
