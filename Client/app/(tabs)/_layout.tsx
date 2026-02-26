import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
        },
        headerStyle: {
          backgroundColor: '#f8f9fa',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {/* 1. Dashboard - First thing they see */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 2. Main Tracking Map */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Live Tracking',
          tabBarLabel: 'Map',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="location-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 3. Lead Management */}
      <Tabs.Screen
        name="leads"
        options={{
          title: 'Lead Management',
          tabBarLabel: 'Leads',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 4. Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'My Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />

      {/* --- HIDDEN SCREENS --- */}

      {/* Hide Details: Accessible via router.push but not visible in the bottom bar */}
      <Tabs.Screen
        name="details"
        options={{
          href: null,
        }}
      />

      {/* Hide Explore: Unused default screen */}
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}