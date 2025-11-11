// app/utils/helpers.js - 유틸리티 함수들
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 데이터 저장 헬퍼 함수
 */
export const saveData = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`${key} 저장 실패:`, error);
    return false;
  }
};

/**
 * 데이터 로드 헬퍼 함수
 */
export const loadData = async (key, defaultValue = null) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`${key} 로드 실패:`, error);
    return defaultValue;
  }
};

/**
 * 날짜 포맷팅 함수
 */
export const formatDate = (date, format = 'YYYY-MM-DD') => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  switch (format) {
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'YYYY년 M월 D일':
      return `${year}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
    case 'M/D':
      return `${d.getMonth() + 1}/${d.getDate()}`;
    default:
      return d.toLocaleDateString();
  }
};

/**
 * 감정 분석 함수
 */
export const analyzeEmotion = (text) => {
  const lowerText = text.toLowerCase();
  
  const positiveWords = ['행복', '좋', '기쁘', '즐거', '만족', '감사', '사랑'];
  const negativeWords = ['슬프', '우울', '힘들', '아프', '괴로', '걱정', '스트레스'];
  const angryWords = ['화나', '짜증', '분노', '열받', '약올', '빡치'];
  
  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
  const angryCount = angryWords.filter(word => lowerText.includes(word)).length;
  
  if (angryCount > 0) return '😠 분노';
  if (positiveCount > negativeCount) return '😊 긍정';
  if (negativeCount > positiveCount) return '😢 부정';
  return '😐 중립';
};

/**
 * 연속 일기 작성 일수 계산
 */
export const calculateStreak = (diaries) => {
  if (!diaries || diaries.length === 0) return 0;
  
  const sortedDates = diaries
    .map(d => d.dateString)
    .sort()
    .reverse();
  
  let streak = 0;
  const today = new Date();
  
  for (let i = 0; i < sortedDates.length; i++) {
    const expectedDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const expectedDateString = formatDate(expectedDate);
    
    if (sortedDates[i] === expectedDateString) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

/**
 * 이번 주 작성된 일기 개수 계산
 */
export const getThisWeekCount = (diaries) => {
  if (!diaries) return 0;
  
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  return diaries.filter(diary => {
    const diaryDate = new Date(diary.dateString);
    return diaryDate >= weekAgo && diaryDate <= today;
  }).length;
};

/**
 * 장르별 통계 계산
 */
export const getGenreStats = (diaries) => {
  const genres = {};
  diaries
    .filter(diary => diary.type === 'book_review' && diary.genre)
    .forEach(diary => {
      const genre = diary.genre;
      genres[genre] = (genres[genre] || 0) + 1;
    });
  
  return Object.entries(genres)
    .sort(([,a], [,b]) => b - a)
    .reduce((acc, [genre, count]) => {
      acc[genre] = count;
      return acc;
    }, {});
};

/**
 * 감정 통계 계산
 */
export const getEmotionStats = (diaries) => {
  const emotions = {};
  diaries.forEach(diary => {
    const emotion = diary.emotion;
    emotions[emotion] = (emotions[emotion] || 0) + 1;
  });
  
  return emotions;
};

/**
 * 이메일 유효성 검사
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 비밀번호 유효성 검사
 */
export const validatePassword = (password) => {
  return {
    isValid: password.length >= 6,
    message: password.length < 6 ? '비밀번호는 6자 이상이어야 합니다.' : ''
  };
};

/**
 * 닉네임 유효성 검사
 */
export const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9가-힣_]{2,20}$/;
  return {
    isValid: usernameRegex.test(username),
    message: !usernameRegex.test(username) ? 
      '닉네임은 2-20자의 영문, 숫자, 한글, 밑줄만 사용 가능합니다.' : ''
  };
};

/**
 * 캘린더 생성 헬퍼
 */
export const generateCalendarDays = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();
  
  const calendarDays = [];
  
  // 빈 날짜들 추가
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // 실제 날짜들 추가
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }
  
  return calendarDays;
};

/**
 * 기본 알림 생성
 */
export const createNotification = (type, title, message) => {
  return {
    id: Date.now(),
    type,
    title,
    message,
    date: new Date().toLocaleDateString(),
    read: false,
    createdAt: new Date().toISOString()
  };
};

/**
 * 텍스트 자르기 (말줄임)
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

/**
 * 검색 필터링
 */
export const filterBySearch = (items, searchText, searchFields = ['title', 'content']) => {
  if (!searchText) return items;
  
  const lowerSearchText = searchText.toLowerCase();
  return items.filter(item => 
    searchFields.some(field => 
      item[field] && item[field].toLowerCase().includes(lowerSearchText)
    )
  );
};

/**
 * 정렬 함수
 */
export const sortItems = (items, sortBy = 'date', order = 'desc') => {
  return [...items].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.dateString) - new Date(b.dateString);
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'emotion':
        comparison = a.emotion.localeCompare(b.emotion);
        break;
      case 'rating':
        comparison = (a.rating || 0) - (b.rating || 0);
        break;
      default:
        comparison = 0;
    }
    
    return order === 'desc' ? -comparison : comparison;
  });
};

export default {
  saveData,
  loadData,
  formatDate,
  analyzeEmotion,
  calculateStreak,
  getThisWeekCount,
  getGenreStats,
  getEmotionStats,
  validateEmail,
  validatePassword,
  validateUsername,
  generateCalendarDays,
  createNotification,
  truncateText,
  filterBySearch,
  sortItems
};