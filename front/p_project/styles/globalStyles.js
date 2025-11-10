// app/styles/globalStyles.js
import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export const colors = {
  primary: '#0984e3',
  secondary: '#74b9ff', 
  success: '#00b894',
  danger: '#e74c3c',
  warning: '#f39c12',
  info: '#0984e3',
  light: '#f8f9fa',
  dark: '#2d3436',
  gray: '#636e72',
  lightGray: '#ddd',
  white: '#ffffff',
   kakaoYellow: '#FEE500',
  googleBlue: '#34b7f1',
  naverGreen: '#00C300',
  
};

export const globalStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: colors.white,  // 기본 흰색 배경
  },
  screen: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.white,  // 흰색 배경
  },
  scrollView: {
    flex: 1,
  },

  // Header styles
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 5,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray,
  },

  // Button styles
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  dangerButton: {
    backgroundColor: colors.danger,
  },
  successButton: {
    backgroundColor: colors.success,
  },
  warningButton: {
    backgroundColor: colors.warning,
  },
  disabledButton: {
    backgroundColor: colors.gray,
    opacity: 0.6,
  },
  smallButton: {
    minWidth: 60,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },

  // Input styles
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  searchInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    flex: 1,
  },

  // Login styles
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: 20,
  },
  linkText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  linkSeparator: {
    color: colors.gray,
    marginHorizontal: 15,
  },
  successMessage: {
    backgroundColor: colors.light,
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  successText: {
    color: colors.success,
    fontSize: 14,
    textAlign: 'center',
  },

  // Card styles
  card: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // List styles
  listItem: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  listItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    flex: 1,
  },
  listItemSubtitle: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 5,
  },

    socialButton: {
    paddingVertical: 15,      // 세로 방향 padding을 균일하게 설정
    borderRadius: 8,
    marginTop: 10,
    width: '100%',            // 버튼 너비를 100%로 설정
    alignItems: 'center',
    justifyContent: 'center', // 버튼 내 텍스트를 중앙에 정렬
  },
  socialButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },

    socialLoginContainer: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%', // 버튼들이 일정한 너비를 가지도록 설정
  },

  // 로그인 스타일
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  // Section styles
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  // Icon styles
  iconButton: {
    padding: 8,
    backgroundColor: colors.white,
    borderRadius: 20,
    position: 'relative',
  },
  iconText: {
    fontSize: 18,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },

  // Modal styles  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 12,
    width: screenWidth * 0.8,
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    textAlign: 'center',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    minWidth: 80,
  },

  // Text styles
  emptyText: {
    textAlign: 'center',
    color: colors.gray,
    fontSize: 16,
    marginTop: 20,
  },
});
