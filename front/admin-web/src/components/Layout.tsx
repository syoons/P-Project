
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Users, BarChart2, BookOpen, LogOut, Bell } from 'lucide-react';

import { removeToken } from '../utils/auth';

const SidebarItem = ({ icon: Icon, label, to, active }: { icon: any, label: string, to: string, active: boolean }) => (
    <Link to={to} className={`sidebar-link ${active ? 'active' : ''}`}>
        <Icon size={20} />
        <span>{label}</span>
    </Link>
);

const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm('정말 로그아웃 하시겠습니까?')) {
            removeToken();
            navigate('/login');
        }
    };

    return (
        <div className="flex h-screen bg-main text-main overflow-hidden">
            {/* 사이드바 */}
            <aside className="w-64 glass-panel flex flex-col h-full border-r border-border z-20">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-white shadow-md">
                        <BookOpen size={14} className="mr-1" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-primary">AdminPage</span>
                </div>

                <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
                    <SidebarItem
                        icon={Users}
                        label="회원 관리"
                        to="/"
                        active={location.pathname === '/'}
                    />
                    <SidebarItem
                        icon={BarChart2}
                        label="회원 통계"
                        to="/stats/users"
                        active={location.pathname === '/stats/users'}
                    />
                    <SidebarItem
                        icon={BookOpen}
                        label="독후감 통계"
                        to="/stats/books"
                        active={location.pathname === '/stats/books'}
                    />
                </nav>

                <div className="p-4 border-t border-border">
                    <button
                        onClick={handleLogout}
                        className="sidebar-link w-full text-danger hover:bg-red-50 hover:text-red-600"
                    >
                        <LogOut size={20} />
                        <span>로그아웃</span>
                    </button>
                </div>
            </aside>

            {/* 메인 콘텐츠 */}
            <main className="flex-1 flex flex-col overflow-hidden relative bg-main w-full">
                {/* 헤더 */}
                <header className="h-16 glass-panel border-b border-border flex items-center justify-between px-8 z-10 sticky top-0 w-full">
                    <div className="flex items-center gap-4 text-muted">
                        {/* 필요시 헤더 콘텐츠를 여기에 추가할 수 있습니다 */}
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative text-muted hover:text-primary transition-colors">
                            <Bell size={20} />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-danger rounded-full"></span>
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-sm">
                                A
                            </div>
                            <span className="font-medium text-sm">관리자</span>
                        </div>
                    </div>
                </header>

                {/* 페이지 콘텐츠 */}
                <div className="flex-1 overflow-auto p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
