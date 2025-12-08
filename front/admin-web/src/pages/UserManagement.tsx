import { useState, useEffect } from 'react';
import { Search, Users, UserCheck, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
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

    const itemsPerPage = 10;

    // 검색어 디바운싱
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setCurrentPage(1); // 검색 변경 시 첫 페이지로 리셋
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // 사용자 목록 가져오기
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await getUsers({
                    page: currentPage - 1, // API는 0부터 시작
                    size: itemsPerPage,
                    searchType: searchType,
                    keyword: debouncedSearchTerm || undefined,
                    // 참고: statusFilter와 ageFilter는 현재 API에서 지원하지 않음
                });
                setUsers(response.content);
                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);
            } catch (error) {
                console.error('Failed to fetch users:', error);
                // 에러 처리 (예: 토스트 메시지 표시)
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [currentPage, debouncedSearchTerm, searchType]); // statusFilter와 ageFilter는 사용되지 않아 의존성에서 제거

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-primary">회원 관리</h1>
            </div>

            {/* 상단 바: 통계 - 참고: 문서에 이러한 요약 통계를 위한 특정 API가 없으므로 현재는 하드코딩됨. 
                문서의 /admin/dashboard/userStats는 분포를 반환하며 총 개수는 아님.
                하드코딩된 채로 두거나 "전체 회원 수"에 totalElements를 사용할 수 있음.
            */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary-light text-primary">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-muted">전체 회원 수</p>
                        <h3 className="text-xl font-bold">{totalElements > 0 ? `${totalElements}명` : '-'}</h3>
                    </div>
                </div>
                <div className="card flex items-center gap-4">
                    <div className="p-3 rounded-full bg-green-100 text-success">
                        <UserCheck size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-muted">활성 회원 수</p>
                        <h3 className="text-xl font-bold">-</h3>
                    </div>
                </div>
                <div className="card flex items-center gap-4">
                    <div className="p-3 rounded-full bg-orange-100 text-warning">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-muted">최근 7일 활동</p>
                        <h3 className="text-xl font-bold">-</h3>
                    </div>
                </div>
            </div>

            {/* 중간 바: 검색 */}
            <div className="card flex items-center gap-4 p-4">
                <select
                    className="input-field w-1/4 min-w-[150px]"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value as 'name' | 'email')}
                >
                    <option value="name">이름</option>
                    <option value="email">이메일</option>
                </select>
                <div className="flex items-center border border-border rounded-lg px-3 bg-white w-full focus-within:ring-2 ring-primary-light transition-all">
                    <Search className="text-muted mr-2 flex-shrink-0" size={20} />
                    <input
                        type="text"
                        className="py-3 w-full outline-none text-main placeholder:text-muted bg-transparent"
                        placeholder="검색어를 입력하세요..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* 하단: 테이블 & 필터 */}
            <div className="card flex flex-col gap-4">
                <div className="flex flex-col md:flex-row justify-between items-center pb-4 border-b border-border gap-4">
                    <h3 className="font-bold text-lg whitespace-nowrap">회원 목록</h3>
                    <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                        <select
                            className="input-field py-1.5 px-3 text-sm w-auto min-w-[100px]"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">상태 전체</option>
                            <option value="활성">활성</option>
                            <option value="휴면">휴면</option>
                        </select>
                        <select
                            className="input-field py-1.5 px-3 text-sm w-auto min-w-[100px]"
                            value={ageFilter}
                            onChange={(e) => setAgeFilter(e.target.value)}
                        >
                            <option value="all">연령대 전체</option>
                            <option value="10대">10대</option>
                            <option value="20대">20대</option>
                            <option value="30대">30대</option>
                            <option value="40대">40대</option>
                            <option value="50대">50대</option>
                        </select>
                        <button
                            className="btn btn-outline py-1.5 px-3 text-sm whitespace-nowrap flex-shrink-0"
                            onClick={() => {
                                setStatusFilter('all');
                                setAgeFilter('all');
                                setSearchTerm('');
                            }}
                        >
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

                {/* 페이지네이션 */}
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
