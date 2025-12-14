import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Lock, User } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // 비밀번호 변경 모드 상태
    const [isResetMode, setIsResetMode] = useState(false);
    // 비밀번호 변경 폼 상태
    const [resetEmail, setResetEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    // 로딩 상태
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 실제 API 호출
            const { loginAdmin } = await import('../api/userApi');
            const { setToken } = await import('../utils/auth');

            const token = await loginAdmin({
                email: id,
                password: password
            });

            // 토큰 저장 및 이동
            setToken(token);
            navigate('/');
        } catch (err: any) {
            console.error('Login failed:', err);
            // 에러 메시지 처리
            if (err.response && err.response.status === 401) {
                setError('아이디 또는 비밀번호가 올바르지 않습니다.');
            } else if (err.message) {
                setError(err.message);
            } else {
                setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!resetEmail || !newPassword) {
            setError('모든 필드를 입력해주세요.');
            return;
        }
        setLoading(true);

        try {
            const { changePassword } = await import('../api/userApi');
            await changePassword({
                email: resetEmail,
                currentPassword: currentPassword, // 기존 비밀번호 전달
                newPassword: newPassword
            });

            alert('비밀번호가 성공적으로 변경되었습니다. 새 비밀번호로 로그인해주세요.');
            setIsResetMode(false);
            setResetEmail('');
            setNewPassword('');
        } catch (err: any) {
            console.error('Password change failed:', err);
            // ... (error handling) ...
            if (err.response && err.response.status === 404) {
                setError('해당 이메일의 계정을 찾을 수 없습니다.');
            } else {
                setError('비밀번호 변경 중 오류가 발생했습니다.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-main">
            <div className="card w-96 p-8 shadow-lg animate-fade-in glass-panel">
                {/* ... (header) ... */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white mb-4 shadow-md">
                        {isResetMode ? <Lock size={24} /> : <BookOpen size={24} />}
                    </div>
                    <h1 className="text-2xl font-bold text-primary">AdminPage</h1>
                    <p className="text-muted">{isResetMode ? '비밀번호 변경' : '관리자 계정으로 로그인'}</p>
                </div>

                {isResetMode ? (
                    <form onSubmit={handleChangePassword} className="flex flex-col gap-4" style={{ marginTop: '1.5rem' }}>
                        <div>
                            <label className="block text-sm font-medium text-muted mb-1">이메일</label>
                            <div className="flex items-center gap-2">
                                <User className="text-muted" size={20} />
                                <input
                                    type="email"
                                    autoComplete="username"
                                    className="input-field flex-1"
                                    placeholder="admin@test.com"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted mb-1">기존 비밀번호</label>
                            <div className="flex items-center gap-2">
                                <Lock className="text-muted" size={20} />
                                <input
                                    type="password"
                                    autoComplete="current-password"
                                    className="input-field flex-1"
                                    placeholder="기존 비밀번호 입력"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted mb-1">새 비밀번호</label>
                            <div className="flex items-center gap-2">
                                <Lock className="text-muted" size={20} />
                                <input
                                    type="password"
                                    autoComplete="new-password"
                                    className="input-field flex-1"
                                    placeholder="새 비밀번호 입력"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && <p className="text-danger text-sm text-center">{error}</p>}

                        <button
                            type="submit"
                            className="btn btn-primary w-full justify-center mt-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? '변경 중...' : '비밀번호 변경'}
                        </button>

                        <div className="flex justify-center mt-2">
                            <button
                                type="button"
                                className="text-sm font-medium underline transition-colors"
                                style={{
                                    background: 'transparent',
                                    color: '#60a5fa',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#60a5fa'}
                                onClick={() => {
                                    setIsResetMode(false);
                                    setError('');
                                }}
                            >
                                로그인으로 돌아가기
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleLogin} className="flex flex-col gap-4" style={{ marginTop: '1.5rem' }}>
                        <div>
                            <label className="block text-sm font-medium text-muted mb-1">아이디 (이메일)</label>
                            <div className="flex items-center gap-2">
                                <User className="text-muted" size={20} />
                                <input
                                    type="text"
                                    className="input-field flex-1"
                                    placeholder="admin@test.com"
                                    value={id}
                                    onChange={(e) => setId(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted mb-1">비밀번호</label>
                            <div className="flex items-center gap-2">
                                <Lock className="text-muted" size={20} />
                                <input
                                    type="password"
                                    className="input-field flex-1"
                                    placeholder="pwd1234!"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && <p className="text-danger text-sm text-center">{error}</p>}

                        <button
                            type="submit"
                            className="btn btn-primary w-full justify-center mt-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? '로그인 중...' : '로그인'}
                        </button>

                        <div className="flex justify-center mt-2">
                            <button
                                type="button"
                                className="text-sm font-medium underline transition-colors"
                                style={{
                                    background: 'transparent',
                                    color: '#60a5fa',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#60a5fa'}
                                onClick={() => {
                                    setIsResetMode(true);
                                    setError('');
                                }}
                            >
                                비밀번호 변경
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;
