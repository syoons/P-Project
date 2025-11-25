import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Lock, User } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (id === 'admin' && password === '1234') {
            localStorage.setItem('isAuthenticated', 'true');
            navigate('/');
        } else {
            setError('아이디 또는 비밀번호가 올바르지 않습니다.');
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-main relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-light rounded-full opacity-50 blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-warning rounded-full opacity-20 blur-3xl"></div>
            </div>

            <div className="card w-full max-w-md relative z-10 p-8 shadow-lg animate-fade-in glass-panel">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white mb-4 shadow-md">
                        <BookOpen size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-primary">ReadAdmin</h1>
                    <p className="text-muted">관리자 계정으로 로그인하세요</p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">아이디</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                            <input
                                type="text"
                                className="input-field pl-10"
                                placeholder="admin"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">비밀번호</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                            <input
                                type="password"
                                className="input-field pl-10"
                                placeholder="1234"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && <p className="text-danger text-sm text-center">{error}</p>}

                    <button type="submit" className="btn btn-primary w-full justify-center mt-2 py-3">
                        로그인
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
