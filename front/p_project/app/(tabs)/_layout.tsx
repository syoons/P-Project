// app/(tabs)/_layout.tsx - 탭 레이아웃
import { Tabs } from 'expo-router';
import React from 'react';
import { colors } from '../../styles/globalStyles';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.lightGray,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      }}
    >
      {/* 순서를 home - 캘린더 - 마이페이지로 설정 */}
      <Tabs.Screen
        name="home"
        options={{
          title: '홈',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: focused ? 22 : 20 }}>🏠</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: '캘린더',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: focused ? 22 : 20 }}>📅</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{
          title: '마이페이지',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: focused ? 22 : 20 }}>👤</Text>
          ),
        }}
      />
    </Tabs>
  );
}
