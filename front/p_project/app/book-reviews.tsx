import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { globalStyles, colors } from '../styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BookReviewList() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    // 더미 데이터 삽입
    const dummyData = [
      {
        id: 1,
        title: '행복의 기원',
        content: '이 책은 삶의 행복에 대한 중요한 통찰을 제공합니다. 나는 이 책에서 행복의 본질을 새롭게 깨달았습니다.',
        emotion: '행복',
        type: 'book_review',
        author: '서은국',
        privacy: 'public',
        rating: 5,
      },
      {
        id: 2,
        title: '아몬드',
        content: '이 책은 심리적으로 어려운 상황에 처한 사람들의 내면을 잘 묘사합니다. 읽으면서 울컥하는 감정을 느꼈습니다.',
        emotion: '슬픔',
        type: 'book_review',
        author: '손원평',
        privacy: 'friends',
        rating: 4,
      },
    ];

    setReviews(dummyData);
    setIsLoading(false);
  };

  const analyzeEmotion = (review: any) => {
    const allText = review.content.toLowerCase();

    if (allText.includes('행복') || allText.includes('좋') || allText.includes('기쁘')) return '😊 긍정';
    if (allText.includes('슬프') || allText.includes('우울') || allText.includes('힘들')) return '😢 부정';
    if (allText.includes('화나') || allText.includes('짜증') || allText.includes('분노')) return '😠 분노';
    return '😐 중립';
  };

  const recommendContent = (emotion: '😊 긍정' | '😢 부정' | '😠 분노' | '😐 중립') => {
    const recommendations = {
      '😊 긍정': {
        song: 'Happy - Pharrell Williams',
        book: '행복의 기원 - 서은국',
      },
      '😢 부정': {
        song: 'Fix You - Coldplay',
        book: '아몬드 - 손원평',
      },
      '😠 분노': {
        song: 'Lovely - Billie Eilish',
        book: '분노와 슬픔 - 김누리',
      },
      '😐 중립': {
        song: 'Weightless - Marconi Union',
        book: '달러구트 꿈 백화점 - 이미예',
      },
    };
    return recommendations[emotion] || recommendations['😐 중립'];
  };

  return (
    <View style={globalStyles.screen}>
      <ScrollView style={globalStyles.scrollView}>
        {isLoading ? (
          <Text>로딩 중...</Text>
        ) : reviews.length === 0 ? (
          <Text>독후감이 없습니다.</Text>
        ) : (
          reviews.map((review: any, index: number) => {
            const emotion = analyzeEmotion(review);
            const recommendation = recommendContent(emotion);

            return (
              <View key={index} style={styles.reviewCard}>
                <Text style={styles.reviewTitle}>{review.title}</Text>
                <Text style={styles.reviewText}>{review.content}</Text>

                {/* 감정 분석 배너 */}
                <View style={styles.bannerContainer}>
                  <Text style={styles.bannerText}>
                    나와 같은 감정을 느낀 사람은 <Text style={styles.bannerHighlight}>10명</Text>입니다.
                  </Text>
                </View>

                {/* 추천 배너 */}
                <View style={styles.recommendationContainer}>
                  <Text style={styles.recommendationText}>
                    {review.type === 'book_review' 
                      ? `"${recommendation.book}" 책을 추천합니다`
                      : `"${recommendation.song}" 노래를 추천합니다`}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  reviewCard: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
  },
  reviewText: {
    fontSize: 16,
    color: colors.gray,
    marginVertical: 10,
  },
  bannerContainer: {
    backgroundColor: colors.light,
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  bannerText: {
    fontSize: 14,
    color: colors.dark,
  },
  bannerHighlight: {
    fontWeight: '600',
    color: colors.primary,
  },
  recommendationContainer: {
    backgroundColor: colors.primary + '15',
    padding: 10,
    borderRadius: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: colors.dark,
    fontWeight: '600',
  },
});
