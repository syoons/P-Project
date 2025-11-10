// app/(tabs)/calendar.tsx - 캘린더 화면
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Dimensions, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles, colors } from '../../styles/globalStyles';

const { width: screenWidth } = Dimensions.get('window');

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

interface SelectedCalendarDate {
  day: number;
  dateString: string;
  displayDate: string;
  hasDiary: boolean;
  diary?: Diary;
}

export default function CalendarScreen() {
  const router = useRouter();
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<SelectedCalendarDate | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    loadDiaries();
  }, []);

  const loadDiaries = async () => {
    try {
      const diariesData = await AsyncStorage.getItem('diaries');
      if (diariesData) {
        setDiaries(JSON.parse(diariesData));
      }
    } catch (error) {
      console.error('일기 로드 실패:', error);
    }
  };

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  const calendarDays: (number | null)[] = [];
  
  // 빈 날짜들 추가
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // 실제 날짜들 추가
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const handleDatePress = (day: number) => {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const diaryForDate = diaries.find(diary => diary.dateString === dateString);
    
    setSelectedCalendarDate({
      day,
      dateString,
      displayDate: `${currentYear}년 ${currentMonth + 1}월 ${day}일`,
      hasDiary: !!diaryForDate,
      diary: diaryForDate
    });
    setShowDateModal(true);
  };

  const handleDateAction = (action: 'view' | 'write') => {
    setShowDateModal(false);
    
    switch (action) {
      case 'view':
        if (selectedCalendarDate?.diary) {
          router.push({
            pathname: '/diary/detail',
            params: { id: selectedCalendarDate.diary.id.toString() }
          } as any);
        }
        break;
      case 'write':
        if (selectedCalendarDate) {
          router.push({
            pathname: '/diary/write',
            params: { 
              date: selectedCalendarDate.dateString,
              displayDate: selectedCalendarDate.displayDate
            }
          } as any);
        }
        break;
    }
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentMonth - 1);
    } else {
      newDate.setMonth(currentMonth + 1);
    }
    setCurrentDate(newDate);
  };

  // 독후감 리스트 필터링
  const bookReviews = diaries.filter(d => d.type === 'book_review');

  return (
    <ScrollView style={globalStyles.screen}>
      {/* 헤더 */}
      <View style={globalStyles.header}>
        <Text style={globalStyles.title}>캘린더</Text>
        <View style={styles.monthNavigation}>
          <TouchableOpacity onPress={() => changeMonth('prev')}>
            <Text style={styles.navigationButton}>◀</Text>
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {currentYear}년 {currentMonth + 1}월
          </Text>
          <TouchableOpacity onPress={() => changeMonth('next')}>
            <Text style={styles.navigationButton}>▶</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 캘린더 그리드 */}
      <View style={styles.calendarContainer}>
        <View style={styles.weekHeader}>
          {['일', '월', '화', '수', '목', '금', '토'].map(day => (
            <View key={day} style={styles.dayHeader}>
              <Text style={styles.dayHeaderText}>{day}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.calendarGrid}>
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <View key={`empty-${index}`} style={styles.calendarDay} />;
            }
            
            const isToday = day === todayDate && currentMonth === todayMonth && currentYear === todayYear;
            const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const hasDiary = diaries.some(diary => diary.dateString === dateString);
            
            return (
              <TouchableOpacity
                key={day}
                style={[styles.calendarDay, isToday && styles.todayStyle, hasDiary && styles.hasDiaryStyle]}
                onPress={() => handleDatePress(day)}
              >
                <Text style={[styles.dayText, isToday && styles.todayText, hasDiary && styles.hasDiaryText]}>
                  {day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 독후감 리스트 배너 */}
      <View style={styles.bookReviewBanner}>
        <Text style={styles.bannerTitle}>📚 독후감 리스트</Text>
        <TouchableOpacity onPress={() => router.push('../book-reviews')} style={styles.bannerButton}>
          <Text style={styles.bannerText}>보기</Text>
        </TouchableOpacity>
      </View>

      {/* 날짜 선택 모달 */}
      <Modal
        visible={showDateModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDateModal(false)}
      >
        <View style={globalStyles.modalOverlay}>
          <View style={globalStyles.modalContent}>
            <Text style={globalStyles.modalTitle}>
              {selectedCalendarDate?.displayDate}
            </Text>
            
            {selectedCalendarDate?.hasDiary ? (
              <>
                <Text style={globalStyles.modalText}>이 날짜에 작성된 글이 있습니다.</Text>
                <View style={globalStyles.modalButtons}>
                  <TouchableOpacity 
                    style={[globalStyles.button, globalStyles.primaryButton, globalStyles.modalButton]}
                    onPress={() => handleDateAction('view')}
                  >
                    <Text style={globalStyles.buttonText}>조회</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[globalStyles.button, globalStyles.secondaryButton, globalStyles.modalButton]}
                    onPress={() => setShowDateModal(false)}
                  >
                    <Text style={globalStyles.secondaryButtonText}>취소</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={globalStyles.modalText}>새로운 글을 작성하시겠습니까?</Text>
                <View style={globalStyles.modalButtons}>
                  <TouchableOpacity 
                    style={[globalStyles.button, globalStyles.primaryButton, globalStyles.modalButton]}
                    onPress={() => handleDateAction('write')}
                  >
                    <Text style={globalStyles.buttonText}>작성</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[globalStyles.button, globalStyles.secondaryButton, globalStyles.modalButton]}
                    onPress={() => setShowDateModal(false)}
                  >
                    <Text style={globalStyles.secondaryButtonText}>취소</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  monthNavigation: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    width: 200,
    marginTop: 10,
  },
  navigationButton: {
    fontSize: 20,
    color: colors.primary,
    padding: 10,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: colors.dark,
  },
  calendarContainer: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weekHeader: {
    flexDirection: 'row' as const,
    marginBottom: 10,
  },
  dayHeader: {
    width: (screenWidth - 80) / 7,
    alignItems: 'center' as const,
    paddingVertical: 8,
  },
  dayHeaderText: {
    fontSize: 14,
    fontWeight: 'bold' as const,
    color: colors.gray,
  },
  calendarGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
  },
  calendarDay: {
    width: (screenWidth - 80) / 7,
    height: 50,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginVertical: 2,
    borderRadius: 6,
    position: 'relative' as const,
  },
  todayStyle: {
    backgroundColor: colors.primary,
  },
  hasDiaryStyle: {
    backgroundColor: colors.secondary,
  },
  dayText: {
    fontSize: 14,
    color: colors.dark,
  },
  todayText: {
    color: colors.white,
    fontWeight: 'bold' as const,
  },
  hasDiaryText: {
    color: colors.white,
    fontWeight: '600' as const,
  },
  bookReviewBanner: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  bannerButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  bannerText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
