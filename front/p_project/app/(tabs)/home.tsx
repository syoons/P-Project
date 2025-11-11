// app/(tabs)/index.tsx - 홈 화면
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles, colors } from '../../styles/globalStyles';

interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  joinDate: string;
  profileImage?: string | null;
}

interface Diary {
  id: number;
  title: string;
  content: string;
  emotion: string;
  date: string;
  dateString: string;
  type: 'diary' | 'book_review';
  genre?: string | null;
  author: string;
  rating?: number | null;
  privacy: 'private' | 'friends' | 'public';
}

export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [diaries, setDiaries] = useState<Diary[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const diariesData = await AsyncStorage.getItem('diaries');

      if (userData) setUser(JSON.parse(userData));
      if (diariesData) setDiaries(JSON.parse(diariesData));
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    }
  };

  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  const todayDiary = diaries.find(diary => diary.dateString === todayString);

  const recentDiaries = diaries.slice(0, 5);
  const thisWeekCount = diaries.filter(diary => {
    const diaryDate = new Date(diary.dateString);
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return diaryDate >= weekAgo;
  }).length;

  return (
    <ScrollView style={globalStyles.screen}>
      {/* 헤더 */}
      <View style={globalStyles.header}>
        <View style={globalStyles.headerTop}>
          <View>
            <Text style={globalStyles.title}>안녕하세요, {user?.username}님!</Text>
            <Text style={globalStyles.subtitle}>닉네임</Text>
          </View>
        </View>
      </View>

      {/* 오늘의 기록 섹션 */}
      <View style={styles.todaySection}>
        <Text style={globalStyles.sectionTitle}>오늘의 기록</Text>
        {todayDiary ? (
          <TouchableOpacity 
            style={styles.todayCard}
            onPress={() => router.push({
              pathname: '/diary/detail',
              params: { id: todayDiary.id.toString() }
            } as any)}
          >
            <Text style={styles.todayCardTitle}>
              {todayDiary.type === 'diary' ? '일기 작성하였습니다' : todayDiary.title}
            </Text>
            <Text style={styles.todayCardEmotion}>{todayDiary.emotion}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.todayEmptyCard}
            onPress={() => router.push('/diary/write' as any)}
          >
            <Text style={styles.todayEmptyText}>오늘의 일기는 10시에 작성하였습니다</Text>
            <Text style={styles.todayEmptySubtext}>탭해서 작성하기</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 이번 주 활동 */}
      <View style={globalStyles.card}>
        <Text style={styles.statsTitle}>이번 주 활동</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{thisWeekCount}</Text>
            <Text style={styles.statLabel}>개 기록</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{diaries.length}</Text>
            <Text style={styles.statLabel}>총 기록</Text>
          </View>
        </View>
      </View>

      {/* 최근 기록 */}
      <View style={styles.recentSection}>
        <View style={globalStyles.sectionHeader}>
          <Text style={globalStyles.sectionTitle}>최근 기록</Text>
          <TouchableOpacity onPress={() => router.push('/calendar' as any)}>
          </TouchableOpacity>
        </View>

        {recentDiaries.length === 0 ? (
          <Text style={globalStyles.emptyText}>아직 작성된 기록이 없습니다.</Text>
        ) : (
          recentDiaries.map((diary, index) => (
            <TouchableOpacity
              key={index}
              style={globalStyles.listItem}
              onPress={() => router.push({
                pathname: '/diary/detail',
                params: { id: diary.id.toString() }
              } as any)}
            >
              <View style={globalStyles.listItemHeader}>
                <Text style={globalStyles.listItemTitle}>{diary.title}</Text>
                <Text style={styles.diaryType}>
                  {diary.type === 'diary' ? '일기' : '독후감'}
                </Text>
              </View>
              <Text style={globalStyles.listItemSubtitle}>{diary.date}</Text>
              <Text style={styles.diaryEmotion}>감정: {diary.emotion}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  todaySection: {
    marginBottom: 25,
  },
  todayCard: {
    backgroundColor: colors.primary,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center' as const,
  },
  todayCardTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold' as const,
    marginBottom: 5,
  },
  todayCardEmotion: {
    color: colors.white,
    fontSize: 14,
  },
  todayEmptyCard: {
    backgroundColor: colors.light,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center' as const,
    borderWidth: 2,
    borderColor: colors.lightGray,
    borderStyle: 'dashed' as const,
  },
  todayEmptyText: {
    color: colors.gray,
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 5,
  },
  todayEmptySubtext: {
    color: colors.gray,
    fontSize: 12,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: colors.dark,
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
  },
  statItem: {
    alignItems: 'center' as const,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 4,
  },
  recentSection: {
    marginBottom: 25,
  },
  moreText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  diaryType: {
    fontSize: 12,
    color: colors.primary,
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  diaryEmotion: {
    fontSize: 14,
    color: colors.primary,
  },
});
