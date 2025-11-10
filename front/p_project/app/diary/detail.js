// app/diary/detail.js - 일기 상세 화면
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles, colors } from '../../styles/globalStyles';

export default function DiaryDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [diary, setDiary] = useState(null);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    loadDiary();
  }, []);

  const loadDiary = async () => {
    try {
      const diariesData = await AsyncStorage.getItem('diaries');
      if (diariesData) {
        const diaries = JSON.parse(diariesData);
        const foundDiary = diaries.find(d => d.id == params.id);
        if (foundDiary) {
          setDiary(foundDiary);
          setRating(foundDiary.rating || 0);
        }
      }
    } catch (error) {
      console.error('일기 로드 실패:', error);
    }
  };

  const handleEdit = () => {
    Alert.alert('편집', '편집 기능은 준비 중입니다.');
  };

  const handleDelete = () => {
    Alert.alert(
      '삭제 확인',
      '정말 이 글을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '삭제', 
          onPress: async () => {
            try {
              const diariesData = await AsyncStorage.getItem('diaries');
              if (diariesData) {
                const diaries = JSON.parse(diariesData);
                const updatedDiaries = diaries.filter(d => d.id !== diary.id);
                await AsyncStorage.setItem('diaries', JSON.stringify(updatedDiaries));
                router.back();
              }
            } catch (error) {
              console.error('삭제 실패:', error);
            }
          },
          style: 'destructive' 
        }
      ]
    );
  };

  if (!diary) {
    return (
      <View style={globalStyles.screen}>
        <Text style={globalStyles.emptyText}>일기를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.screen}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.title}>{diary.title}</Text>
        <Text style={globalStyles.subtitle}>{diary.date}</Text>
        <Text style={globalStyles.subtitle}>작성자: {diary.author}</Text>
      </View>

      <ScrollView style={globalStyles.scrollView}>
        {/* 상단 메타 정보 */}
        <View style={styles.metaContainer}>
          <View style={styles.typeAndPrivacy}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>
                {diary.type === 'diary' ? '📝 일기' : '📚 독후감'}
              </Text>
            </View>
            <View style={styles.privacyBadge}>
              <Text style={styles.privacyText}>
                {diary.privacy === 'private' ? '🔒 비공개' :
                 diary.privacy === 'friends' ? '👥 친구공개' : '🌍 전체공개'}
              </Text>
            </View>
          </View>
          
          <View style={styles.emotionBadge}>
            <Text style={styles.emotionText}>{diary.emotion}</Text>
          </View>
        </View>

        {/* 장르 (독후감일 경우) */}
        {diary.type === 'book_review' && (
          <View style={styles.bookMeta}>
            {diary.genre && (
              <View style={styles.genreBadge}>
                <Text style={styles.genreText}>장르: {diary.genre}</Text>
              </View>
            )}
          </View>
        )}

        {/* 본문 */}
        <View style={styles.contentContainer}>
          <Text style={styles.contentText}>{diary.content}</Text>
        </View>

        {/* 질문과 답변 섹션 */}
        {diary.answers && diary.answers.length > 0 && (
          <View style={styles.answersSection}>
            <Text style={styles.answersTitle}>질문과 답변</Text>
            {diary.answers.map((qa, index) => (
              <View key={index} style={styles.qaItem}>
                <Text style={styles.questionText}>Q: {qa.question}</Text>
                <Text style={styles.answerText}>A: {qa.answer}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* 하단 액션 버튼들 */}
      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={[globalStyles.button, globalStyles.secondaryButton]}
          onPress={() => router.back()}
        >
          <Text style={globalStyles.secondaryButtonText}>뒤로</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[globalStyles.button, styles.editButton]}
          onPress={handleEdit}
        >
          <Text style={globalStyles.buttonText}>편집</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[globalStyles.button, globalStyles.dangerButton]}
          onPress={handleDelete}
        >
          <Text style={globalStyles.buttonText}>삭제</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = {
  metaContainer: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  typeAndPrivacy: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  typeBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  typeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  privacyBadge: {
    backgroundColor: colors.light,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  privacyText: {
    color: colors.gray,
    fontSize: 12,
    fontWeight: '600',
  },
  emotionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  emotionText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  bookMeta: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  genreBadge: {
    backgroundColor: colors.warning,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  genreText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  contentContainer: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.dark,
  },
  answersSection: {
    backgroundColor: colors.light,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  answersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 15,
  },
  qaItem: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  questionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 8,
  },
  answerText: {
    fontSize: 14,
    color: colors.gray,
    lineHeight: 20,
    paddingLeft: 10,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    backgroundColor: colors.white,
  },
  editButton: {
    backgroundColor: colors.warning,
    minWidth: 60,
  },
};
