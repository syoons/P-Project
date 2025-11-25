import React from 'react';
import { Users, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
    <div className="card animate-fade-in">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-muted text-sm font-medium mb-1">{title}</p>
                <h3 className="text-2xl font-bold">{value}</h3>
            </div>
            <div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-400`}>
                <Icon size={20} color={color === 'primary' ? '#6366f1' : color === 'success' ? '#10b981' : '#f59e0b'} />
            </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
            <span className="text-success font-medium flex items-center gap-1">
                <TrendingUp size={14} />
                {change}
            </span>
            <span className="text-muted">vs last month</span>
        </div>
    </div>
);

const Dashboard = () => {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-2xl font-bold mb-2">Dashboard Overview</h1>
                <p className="text-muted">Welcome back, here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value="12,345"
                    change="+12%"
                    icon={Users}
                    color="primary"
                />
                <StatCard
                    title="Total Revenue"
                    value="$45,231"
                    change="+8.2%"
                    icon={DollarSign}
                    color="success"
                />
                <StatCard
                    title="Active Orders"
                    value="573"
                    change="+2.4%"
                    icon={ShoppingCart}
                    color="warning"
                />
                <StatCard
                    title="Growth"
                    value="+18.2%"
                    change="+4.1%"
                    icon={TrendingUp}
                    color="primary"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="card lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg">Recent Users</h3>
                        <button className="text-primary text-sm font-medium hover:underline">View All</button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-muted text-sm">
                                    <th className="py-3 px-4 font-medium">User</th>
                                    <th className="py-3 px-4 font-medium">Status</th>
                                    <th className="py-3 px-4 font-medium">Date</th>
                                    <th className="py-3 px-4 font-medium">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-3 px-4 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white/10"></div>
                                            <span className="font-medium">User {i}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                                                Active
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-muted text-sm">Oct 24, 2023</td>
                                        <td className="py-3 px-4 font-medium">$120.00</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card">
                    <h3 className="font-bold text-lg mb-6">Quick Actions</h3>
                    <div className="flex flex-col gap-3">
                        <button className="btn btn-primary w-full">Add New User</button>
                        <button className="btn w-full border border-white/10 hover:bg-white/5">Generate Report</button>
                        <button className="btn w-full border border-white/10 hover:bg-white/5">System Settings</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
