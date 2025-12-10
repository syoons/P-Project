import { useState, useEffect } from 'react';
import { Search, Users, UserCheck, Clock, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { getUsers, type User } from '../api/userApi';

const UserManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [searchType, setSearchType] = useState<'name' | 'email'>('name');
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');
    const [ageFilter, setAgeFilter] = useState('all');

    const [users, setUsers] = useState<User[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);

    // 통계 상태
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        recent: 0
    });

    const itemsPerPage = 10;

    // 검색어 디바운싱
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setCurrentPage(1); // 검색 변경 시 첫 페이지로 리셋
        }, 200);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // 📊 통계 데이터 계산을 위한 전체 데이터 조회
    useEffect(() => {
        const calculateStats = async () => {
            try {
                // API가 통계 기능을 제공하지 않아 임시로 최대 10000명의 데이터를 가져와 client-side에서 계산
                const response = await getUsers({
                    page: 0,
                    size: 10000,
                });

                const allUsers = response.content;
                const now = new Date();
                const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

                const activeCount = allUsers.filter(u => !u.deletedAt).length;
                const recentCount = allUsers.filter(u => {
                    if (!u.lastActive) return false;
                    const lastActiveDate = new Date(u.lastActive);
                    return lastActiveDate >= sevenDaysAgo;
                }).length;

                setStats({
                    total: response.totalElements,
                    active: activeCount,
                    recent: recentCount
                });
            } catch (error) {
                console.error('Failed to calculate stats:', error);
            }
        };

        calculateStats();
    }, []); // 마운트 시 1회 실행

    // 사용자 목록 가져오기
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                // 필터가 하나라도 적용되어 있으면 클라이언트 사이드 필터링 수행
                const isFiltering = statusFilter !== 'all' || ageFilter !== 'all';

                const response = await getUsers({
                    page: isFiltering ? 0 : currentPage - 1,
                    size: isFiltering ? 10000 : itemsPerPage, // 필터링 시 최대 10000명 가져옴
                    searchType: searchType,
                    keyword: debouncedSearchTerm || undefined,
                });

                let processedUsers = response.content;

                // 1. 상태 필터링
                if (statusFilter !== 'all') {
                    processedUsers = processedUsers.filter(user => {
                        if (statusFilter === '활성') return !user.deletedAt;
                        if (statusFilter === '휴면') return !!user.deletedAt;
                        return true;
                    });
                }

                // 2. 연령대 필터링
                if (ageFilter !== 'all') {
                    processedUsers = processedUsers.filter(user => user.birthGroup === ageFilter);
                }

                // 필터링된 결과로 페이지네이션 및 상태 업데이트
                if (isFiltering) {
                    setTotalElements(processedUsers.length);
                    setTotalPages(Math.ceil(processedUsers.length / itemsPerPage));

                    // 현재 페이지에 맞는 데이터 슬라이싱
                    const startIndex = (currentPage - 1) * itemsPerPage;
                    const endIndex = startIndex + itemsPerPage;
                    setUsers(processedUsers.slice(startIndex, endIndex));
                } else {
                    // 서버 사이드 페이지네이션 결과 그대로 사용
                    setUsers(response.content);
                    setTotalPages(response.totalPages);
                    setTotalElements(response.totalElements);
                }

                // 검색어가 없고 필터도 없을 때만 전체 통계 업데이트
                if (!debouncedSearchTerm && !isFiltering) {
                    setStats(prev => ({ ...prev, total: response.totalElements }));
                }

            } catch (error) {
                console.error('Failed to fetch users:', error);
                setUsers([]); // 에러 시 빈 배열
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [currentPage, debouncedSearchTerm, searchType, statusFilter, ageFilter]);

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-primary">회원 관리</h1>
            </div>


            {/* 상단 바: 통계 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary-light text-primary">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-muted">전체 회원 수</p>
                        <h3 className="text-xl font-bold">{stats.total > 0 ? `${stats.total}명` : '0명'}</h3>
                    </div>
                </div>
                <div className="card flex items-center gap-4">
                    <div className="p-3 rounded-full bg-green-100 text-success">
                        <UserCheck size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-muted">활성 회원 수</p>
                        <h3 className="text-xl font-bold">{stats.active > 0 ? `${stats.active}명` : '0명'}</h3>
                    </div>
                </div>
                <div className="card flex items-center gap-4">
                    <div className="p-3 rounded-full bg-orange-100 text-warning">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-muted">최근 7일 활동</p>
                        <h3 className="text-xl font-bold">{stats.recent > 0 ? `${stats.recent}명` : '0명'}</h3>
                    </div>
                </div>
            </div>





            {/* 하단: 테이블 & 필터 */}
            <div className="card flex flex-col gap-4">
                <div
                    style={{ gap: '2.5rem' }}
                    className="flex flex-col xl:flex-row justify-between items-center border-b border-border"
                >

                    <h3 className="font-bold text-lg whitespace-nowrap py-6">회원 목록</h3>



                    <div className="flex items-center w-full xl:w-auto justify-between overflow-x-auto pb-1 xl:pb-0">


                        {/* 검색 영역 */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <select
                                className="select-compact w-[70px]"
                                value={searchType}
                                onChange={(e) => setSearchType(e.target.value as 'name' | 'email')}
                            >
                                <option value="name">이름</option>
                                <option value="email">이메일</option>
                            </select>
                            <div style={{ width: '180px', gap: '4px' }} className="flex items-center border border-border rounded-lg px-2 bg-white focus-within:ring-2 ring-primary-light transition-all">
                                <Search className="text-muted flex-shrink-0" size={24} />
                                <input
                                    type="text"
                                    style={{ fontSize: '16px', padding: '6px 8px' }}
                                    className="w-full outline-none text-main placeholder:text-muted bg-transparent"
                                    placeholder="검색어 입력"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>


                        {/* 필터 영역 */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <select
                                className="select-compact min-w-[100px]"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">상태 전체</option>
                                <option value="활성">활성</option>
                                <option value="휴면">휴면</option>
                            </select>
                            <select
                                className="select-compact min-w-[110px]"
                                value={ageFilter}
                                onChange={(e) => setAgeFilter(e.target.value)}
                            >
                                <option value="all">연령대 전체</option>
                                <option value="10대">10대</option>
                                <option value="20대">20대</option>
                                <option value="30대">30대</option>
                                <option value="40대">40대</option>
                                <option value="50대 이상">50대 이상</option>
                            </select>

                        </div>



                        {/* 초기화 버튼 */}
                        <button
                            className="btn btn-outline py-2 px-4 text-sm whitespace-nowrap flex-shrink-0"
                            onClick={() => {
                                setStatusFilter('all');
                                setAgeFilter('all');
                                setSearchTerm('');
                            }}
                        >
                            <RotateCcw size={16} />
                            초기화
                        </button>
                    </div>
                </div>

                <div className="table-container">
                    {loading ? (
                        <div className="p-8 text-center text-muted">로딩 중...</div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>가입일</th>
                                    <th>닉네임</th>
                                    <th>이메일</th>
                                    <th>연령대</th>
                                    <th>글 수</th>
                                    <th>최근활동</th>
                                    <th>상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.createdAt}</td>
                                            <td className="font-medium">{user.nickname}</td>
                                            <td className="text-muted">{user.email}</td>
                                            <td>{user.birthGroup}</td>
                                            <td>{user.postCount}</td>
                                            <td>{user.lastActive}</td>
                                            <td>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.deletedAt ? 'bg-gray-100 text-muted' : 'bg-green-100 text-success'
                                                    }`}>
                                                    {user.deletedAt ? '탈퇴' : '활성'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8 text-muted">
                                            데이터가 없습니다.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>



                {/* 회원목록 페이지 넘기기 */}
                <div className="flex justify-center items-center gap-4 mt-4">
                    <button
                        className="btn btn-outline p-2"
                        disabled={currentPage === 1 || loading}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="text-sm font-medium">
                        {currentPage} / {totalPages || 1}
                    </span>
                    <button
                        className="btn btn-outline p-2"
                        disabled={currentPage === totalPages || totalPages === 0 || loading}
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
