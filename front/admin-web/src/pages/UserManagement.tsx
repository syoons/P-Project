import React, { useState } from 'react';
import { Search, Users, UserCheck, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

// Mock Data
const MOCK_USERS = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    joinDate: `2023-10-${String(Math.floor(Math.random() * 30) + 1).padStart(2, '0')}`,
    nickname: `User${i + 1}`,
    email: `user${i + 1}@example.com`,
    ageGroup: ['10대', '20대', '30대', '40대', '50대'][Math.floor(Math.random() * 5)],
    postCount: Math.floor(Math.random() * 50),
    lastActive: `2023-11-${String(Math.floor(Math.random() * 24) + 1).padStart(2, '0')}`,
    status: Math.random() > 0.2 ? '활성' : '휴면',
}));

const UserManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('name'); // name, email
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');
    const [ageFilter, setAgeFilter] = useState('all');

    const itemsPerPage = 10;

    // Filter Logic
    const filteredUsers = MOCK_USERS.filter(user => {
        const matchesSearch = searchType === 'name'
            ? user.nickname.toLowerCase().includes(searchTerm.toLowerCase())
            : user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        const matchesAge = ageFilter === 'all' || user.ageGroup === ageFilter;

        return matchesSearch && matchesStatus && matchesAge;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const currentUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-primary">회원 관리</h1>
            </div>

            {/* Top Bar: Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary-light text-primary">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-muted">전체 회원 수</p>
                        <h3 className="text-xl font-bold">1,234명</h3>
                    </div>
                </div>
                <div className="card flex items-center gap-4">
                    <div className="p-3 rounded-full bg-green-100 text-success">
                        <UserCheck size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-muted">활성 회원 수</p>
                        <h3 className="text-xl font-bold">982명</h3>
                    </div>
                </div>
                <div className="card flex items-center gap-4">
                    <div className="p-3 rounded-full bg-orange-100 text-warning">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-muted">최근 7일 활동</p>
                        <h3 className="text-xl font-bold">456명</h3>
                    </div>
                </div>
            </div>

            {/* Middle Bar: Search */}
            <div className="card flex items-center gap-4 p-4">
                <select
                    className="input-field w-1/4 min-w-[150px]"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
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

            {/* Bottom: Table & Filters */}
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
                            {currentUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.joinDate}</td>
                                    <td className="font-medium">{user.nickname}</td>
                                    <td className="text-muted">{user.email}</td>
                                    <td>{user.ageGroup}</td>
                                    <td>{user.postCount}</td>
                                    <td>{user.lastActive}</td>
                                    <td>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === '활성' ? 'bg-green-100 text-success' : 'bg-gray-100 text-muted'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center gap-4 mt-4">
                    <button
                        className="btn btn-outline p-2"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="text-sm font-medium">
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        className="btn btn-outline p-2"
                        disabled={currentPage === totalPages}
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
