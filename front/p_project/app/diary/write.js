// app/diary/write.js - 일기 작성 화면
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles, colors } from '../../styles/globalStyles';


export default function WriteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [generatedDiary, setGeneratedDiary] = useState('');
  const [diaryType, setDiaryType] = useState('diary');
  const [bookGenre, setBookGenre] = useState('');
  const [user, setUser] = useState(null);

  const selectedDate = params.date ? {
    dateString: params.date,
    displayDate: decodeURIComponent(params.displayDate || '')
  } : null;

  const questions = {
    diary: [
      selectedDate ? 
        `${selectedDate.displayDate}은 어떤 하루였나요?` : 
        "오늘 하루는 어떠셨나요?",
      "가장 기억에 남는 일이 있다면 무엇인가요?",
      "그때 느낀 감정을 자유롭게 표현해주세요.",
      "앞으로 어떤 하루가 되길 바라시나요?"
    ],
    book_review: [
      "읽은 책의 제목과 저자를 알려주세요.",
      "이 책의 장르는 무엇인가요?",
      "이 책을 선택한 이유가 있나요?",
      "가장 인상 깊었던 부분이나 문장이 있다면?",
      "이 책을 통해 얻은 교훈이나 느낀 점은?"
    ]
  };

  const bookGenres = ['소설', '에세이', '자기계발', '역사', '과학', '철학', '예술', '기타'];
  const currentQuestions = questions[diaryType];

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('사용자 정보 로드 실패:', error);
    }
  };

  const handleNextQuestion = () => {
    if (currentAnswer.trim() === '') {
      Alert.alert('알림', '답변을 입력해주세요.');
      return;
    }

    let answer = currentAnswer.trim();
    if (diaryType === 'book_review' && currentQuestionIndex === 1) {
      answer = bookGenre || answer;
    }

    const newAnswers = [...answers, {
      question: currentQuestions[currentQuestionIndex],
      answer: answer
    }];
    setAnswers(newAnswers);
    setCurrentAnswer('');

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      generateDiary(newAnswers);
    }
  };

   const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setCurrentAnswer(answers[currentQuestionIndex - 1]?.answer || '');
    }
  };

  const generateDiary = async (finalAnswers) => {
    const diary = diaryType === 'diary' ? generateDiaryTemplate(finalAnswers) : generateBookReviewTemplate(finalAnswers);
    setGeneratedDiary(diary);
    setIsCompleted(true);
    
    const newDiary = {
      id: Date.now(),
      title: diaryType === 'diary' ? "오늘의 일기" : finalAnswers[0]?.answer || '독후감',
      content: diary,
      answers: finalAnswers,
      date: new Date().toLocaleDateString(),
      type: diaryType,
      author: user?.username || '익명',
      privacy: 'friends'
    };

    try {
      const existingDiaries = await AsyncStorage.getItem('diaries');
      const diaries = existingDiaries ? JSON.parse(existingDiaries) : [];
      const updatedDiaries = [newDiary, ...diaries];
      await AsyncStorage.setItem('diaries', JSON.stringify(updatedDiaries));
    } catch (error) {
      console.error('일기 저장 실패:', error);
    }
  };


  const generateDiaryTemplate = (answers) => {
    const dateText = selectedDate ? selectedDate.displayDate : '오늘';
    return `${dateText}을 돌아보며

${answers[0]?.answer}

가장 기억에 남는 순간은 ${answers[1]?.answer}였다.

내 마음 속 감정을 표현해보면, ${answers[2]?.answer}

앞으로는 ${answers[3]?.answer}하는 하루가 되기를 바란다.

- ${user?.username} (${selectedDate?.displayDate || new Date().toLocaleDateString()}) -`;
  };

  const generateBookReviewTemplate = (answers) => {
    return `📚 독서 기록

📖 책 정보: ${answers[0]?.answer}
🏷️ 장르: ${answers[1]?.answer}

🎯 선택 이유: ${answers[2]?.answer}

✨ 인상 깊었던 부분: ${answers[3]?.answer}

💡 나의 생각: ${answers[4]?.answer}

이 책을 통해 새로운 시각을 얻을 수 있었고, 앞으로도 의미 있는 독서를 이어가고 싶다.

- ${user?.username} (${selectedDate?.displayDate || new Date().toLocaleDateString()}) -`;
  };

  const analyzeEmotion = (answers) => {
    const allText = answers.map(a => a.answer).join(' ').toLowerCase();
    
    if (allText.includes('행복') || allText.includes('좋') || allText.includes('기쁘')) return '😊 긍정';
    if (allText.includes('슬프') || allText.includes('우울') || allText.includes('힘들')) return '😢 부정';
    if (allText.includes('화나') || allText.includes('짜증') || allText.includes('분노')) return '😠 분노';
    return '😐 중립';
  };

  if (isCompleted) {
    // 추천 노래/책 (감정 기반)
    const recommendations = {
      '😊 긍정': {
        song: 'Happy - Pharrell Williams',
        book: '행복의 기원 - 서은국'
      },
      '😢 부정': {
        song: 'Fix You - Coldplay',
        book: '아몬드 - 손원평'
      },
      '😠 분노': {
        song: 'Lovely - Billie Eilish',
        book: '분노와 슬픔 - 김누리'
      },
      '😐 중립': {
        song: 'Weightless - Marconi Union',
        book: '달러구트 꿈 백화점 - 이미예'
      }
    };

    const currentEmotion = analyzeEmotion(answers);
    const recommendation = recommendations[currentEmotion] || recommendations['😐 중립'];
    
    // 같은 감정을 느낀 사람 수 (랜덤 생성 - 실제로는 서버에서 가져와야 함)
    const sameEmotionCount = Math.floor(Math.random() * 50) + 10;

    return (
      <View style={globalStyles.container}>
        <View style={globalStyles.header}>
          <Text style={globalStyles.title}>✅ 완성!</Text>
          {selectedDate && (
            <Text style={globalStyles.subtitle}>{selectedDate.displayDate}</Text>
          )}
        </View>
        
        <ScrollView style={styles.generatedDiary} showsVerticalScrollIndicator={false}>
          <Text style={styles.diaryContent}>{generatedDiary}</Text>
          
          {/* 배너들 */}
          <View style={styles.bannerContainer}>
            {/* 같은 감정 배너 */}
            <View style={styles.banner}>
              <Text style={styles.bannerIcon}>💭</Text>
              <Text style={styles.bannerText}>
                나와 같은 감정을 느낀 사람은 <Text style={styles.bannerHighlight}>{sameEmotionCount}명</Text>입니다
              </Text>
            </View>

            {/* AI 추천 배너 */}
            <View style={[styles.banner, styles.recommendBanner]}>
              <Text style={styles.bannerIcon}>🤖</Text>
              <View style={styles.recommendContent}>
                <Text style={styles.recommendTitle}>AI 추천</Text>
                <Text style={styles.recommendText}>
                  {diaryType === 'diary' 
                    ? `"${recommendation.song}" 노래를 추천합니다` 
                    : `"${recommendation.book}" 책을 추천합니다`}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={globalStyles.buttonContainer}>
          <TouchableOpacity 
            style={[globalStyles.button, globalStyles.primaryButton]}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={globalStyles.buttonText}>홈으로</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={globalStyles.screen}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.title}>AI 질문 {currentQuestionIndex + 1}/{currentQuestions.length}</Text>
        {selectedDate && (
          <Text style={globalStyles.subtitle}>{selectedDate.displayDate}</Text>
        )}
        
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeButton, diaryType === 'diary' && styles.activeTypeButton]}
            onPress={() => setDiaryType('diary')}
          >
            <Text style={[styles.typeButtonText, diaryType === 'diary' && styles.activeTypeButtonText]}>일기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, diaryType === 'book_review' && styles.activeTypeButton]}
            onPress={() => setDiaryType('book_review')}
          >
            <Text style={[styles.typeButtonText, diaryType === 'book_review' && styles.activeTypeButtonText]}>독후감</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestions[currentQuestionIndex]}</Text>
      </View>

      <View style={styles.answerContainer}>
        {diaryType === 'book_review' && currentQuestionIndex === 1 ? (
          <View style={styles.genreContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.genreScroll}>
              {bookGenres.map(genre => (
                <TouchableOpacity
                  key={genre}
                  style={[styles.genreButton, bookGenre === genre && styles.selectedGenre]}
                  onPress={() => setBookGenre(genre)}
                >
                  <Text style={[styles.genreText, bookGenre === genre && styles.selectedGenreText]}>
                    {genre}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TextInput
              style={styles.answerInput}
              multiline
              placeholder="또는 직접 입력..."
              value={currentAnswer}
              onChangeText={setCurrentAnswer}
            />
          </View>
        ) : (
          <TextInput
            style={styles.answerInput}
            multiline
            placeholder="자유롭게 답변해주세요..."
            value={currentAnswer}
            onChangeText={setCurrentAnswer}
          />
        )}
      </View>

      <View style={globalStyles.buttonContainer}>
        <TouchableOpacity 
          style={[globalStyles.button, globalStyles.secondaryButton]}
          onPress={() => router.back()}
        >
          <Text style={globalStyles.secondaryButtonText}>취소</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[globalStyles.button, globalStyles.primaryButton]}
          onPress={handleNextQuestion}
        >
          <Text style={globalStyles.buttonText}>
            {currentQuestionIndex < currentQuestions.length - 1 ? '다음' : '완성'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = {
  typeSelector: {
    flexDirection: 'row',
    marginTop: 15,
    backgroundColor: colors.light,
    borderRadius: 8,
    padding: 2,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTypeButton: {
    backgroundColor: colors.primary,
  },
  typeButtonText: {
    fontSize: 14,
    color: colors.gray,
  },
  activeTypeButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  questionContainer: {
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
  questionText: {
    fontSize: 18,
    color: colors.dark,
    lineHeight: 24,
    textAlign: 'center',
  },
  answerContainer: {
    flex: 1,
    marginBottom: 20,
  },
  answerInput: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    textAlignVertical: 'top',
    flex: 1,
    borderWidth: 1,
    borderColor: colors.lightGray,
    minHeight: 150,
  },
  genreContainer: {
    flex: 1,
  },
  genreScroll: {
    marginBottom: 15,
  },
  genreButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedGenre: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genreText: {
    fontSize: 14,
    color: colors.gray,
  },
  selectedGenreText: {
    color: colors.white,
    fontWeight: '600',
  },
  generatedDiary: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 20,
    margin: 20,
    marginBottom: 0,
  },
  diaryContent: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.dark,
    marginBottom: 20,
  },
  // 배너 스타일
  bannerContainer: {
    marginTop: 20,
    gap: 15,
  },
  banner: {
    backgroundColor: colors.light,
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  bannerIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  bannerText: {
    fontSize: 14,
    color: colors.dark,
    flex: 1,
    lineHeight: 20,
  },
  bannerHighlight: {
    fontWeight: 'bold',
    color: colors.primary,
    fontSize: 16,
  },
  recommendBanner: {
    backgroundColor: colors.primary + '15',
    borderLeftColor: colors.secondary,
  },
  recommendContent: {
    flex: 1,
  },
  recommendTitle: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 4,
  },
  recommendText: {
    fontSize: 14,
    color: colors.dark,
    fontWeight: '600',
    lineHeight: 20,
  },
};