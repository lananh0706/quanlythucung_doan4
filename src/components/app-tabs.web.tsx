import React from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

import {
  HomeIcon,
  AdvisorIcon,
  BlogIcon,
  OrdersIcon,
  ProfileIcon,
} from '@/components/icons';

export default function AppTabs() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDark ? '#38BDF8' : '#0284C7',
        tabBarInactiveTintColor: isDark ? '#94A3B8' : '#64748B',
        tabBarStyle: {
          position: 'fixed' as any,
          bottom: 0,
          left: 0,
          right: 0,
          height: 64,
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.96)' : 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTopColor: isDark ? '#1E293B' : '#BAE6FD',
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          boxShadow: isDark
            ? '0 -4px 20px rgba(0, 0, 0, 0.4)'
            : '0 -4px 20px rgba(14, 165, 233, 0.08)',
          zIndex: 9999,
        } as any,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.2,
          marginTop: 2,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Cửa hàng',
          tabBarIcon: ({ color }) => (
            <HomeIcon size={20} color={String(color)} />
          ),
        }}
      />
      <Tabs.Screen
        name="advisor"
        options={{
          title: 'Tư vấn',
          tabBarIcon: ({ color }) => (
            <AdvisorIcon size={20} color={String(color)} />
          ),
        }}
      />
      <Tabs.Screen
        name="blog"
        options={{
          title: 'Blog',
          tabBarIcon: ({ color }) => (
            <BlogIcon size={20} color={String(color)} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Đơn hàng',
          tabBarIcon: ({ color }) => (
            <OrdersIcon size={20} color={String(color)} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Bé cưng',
          tabBarIcon: ({ color }) => (
            <ProfileIcon size={20} color={String(color)} />
          ),
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="detail"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
    </Tabs>
  );
}
