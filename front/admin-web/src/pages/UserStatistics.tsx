import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getUserStats } from '../api/statsApi';

const COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe', '#f5f3ff'];

const UserStatistics = () => {
    const [timeData, setTimeData] = useState<{ name: string; users: number }[]>([]);
    const [ageData, setAgeData] = useState<{ name: string; value: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getUserStats();

                // 시간대별 분포 변환
                // 개수가 0인 경우도 24시간 모두 표시
                const timeMap = new Map(data.timeDistribution.map(item => [item.hour, item.count]));
                const formattedTimeData = Array.from({ length: 24 }, (_, i) => ({
                    name: `${i}시`,
                    users: timeMap.get(i) || 0,
                }));
                setTimeData(formattedTimeData);

                // 연령대별 분포 변환
                const formattedAgeData = data.ageGroupDistribution.map(item => ({
                    name: item.ageGroup,
                    value: item.count,
                }));
                // 필요시 연령대별로 정렬 가능, 하지만 API가 적절한 순서로 반환한다고 가정하고 그대로 표시
                setAgeData(formattedAgeData);

            } catch (error) {
                console.error('Failed to fetch user stats:', error);
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
            <h1 className="text-2xl font-bold text-primary">회원 통계</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 차트 1: 일일 활동 */}
                <div className="card">
                    <h3 className="font-bold text-lg mb-6">시간대별 활동 분포</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={timeData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={2} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    cursor={{ fill: '#f8fafc' }}
                                />
                                <Bar dataKey="users" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 차트 2: 연령대별 분포 */}
                <div className="card">
                    <h3 className="font-bold text-lg mb-6">연령대별 회원 분포</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={ageData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                <XAxis type="number" tick={{ fontSize: 12 }} />
                                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={40} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    cursor={{ fill: '#f8fafc' }}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                    {ageData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserStatistics;
