import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { getBookGenreStats } from '../api/statsApi';

const COLORS = ['#8b5cf6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#6366F1', '#14B8A6'];


const BookStatistics = () => {
    const [genreData, setGenreData] = useState<{ name: string; value: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getBookGenreStats();
                //console.log('Book Genre Stats Raw Data:', data); // 디버깅용 로그
                const formattedData = data.map(item => ({
                    name: item.genre || '기타', // null 장르 처리
                    value: item.count,
                }));
                //console.log('Formatted Data:', formattedData); // 디버깅용 로그

                // 더 나은 시각화를 위해 값 기준 내림차순 정렬
                formattedData.sort((a, b) => b.value - a.value);
                setGenreData(formattedData);
            } catch (error) {
                console.error('Failed to fetch book genre stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-muted">통계 데이터를 불러오는 중...</div>;
    }

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <h1 className="text-2xl font-bold text-primary">독후감 통계</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {genreData.length > 0 ? (
                    <>
                        {/* 차트 1: 장르별 분포 (막대) */}
                        <div className="card">
                            <h3 className="font-bold text-lg mb-6 text-center">장르별 독후감 작성 수</h3>
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <BarChart data={genreData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                            cursor={{ fill: '#f8fafc' }}
                                        />
                                        <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40}>
                                            {genreData.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* 차트 2: 장르별 분포 (원형) */}
                        <div className="card">
                            <h3 className="font-bold text-lg mb-6 text-center">장르별 비율</h3>
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            data={genreData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {genreData.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="col-span-1 lg:col-span-2 card p-12 text-center text-muted">
                        <p className="text-lg">표시할 독후감 통계 데이터가 없습니다.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookStatistics;
