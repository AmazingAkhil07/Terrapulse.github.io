import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const Dashboard = () => {
    const [rooms] = useLocalStorage('rooms', []);
    const [bookings] = useLocalStorage('bookings', []);

    // Calculate stats
    const totalRooms = rooms.length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeBookings = bookings.filter(b => {
        const start = new Date(b.checkIn);
        const end = new Date(b.checkOut);
        return today >= start && today < end;
    });

    const occupiedCount = activeBookings.length;
    const availableCount = totalRooms - occupiedCount;

    // Calculate revenue for today (sum of price of all occupied rooms)
    const revenueToday = activeBookings.reduce((sum, booking) => {
        const room = rooms.find(r => r.id === booking.roomId);
        return sum + (room ? room.price : 0);
    }, 0);

    const recentBookings = [...bookings]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    return (
        <div>
            <header className="flex justify-between items-center mb-8" style={{ marginBottom: '2rem' }}>
                <div>
                    <h2 className="text-2xl">Dashboard</h2>
                    <p className="text-muted">Welcome back, here's what's happening today.</p>
                </div>
                <button className="btn btn-primary">Download Report</button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card">
                    <p className="text-muted text-sm">Total Rooms</p>
                    <p className="text-2xl">{totalRooms}</p>
                </div>
                <div className="card">
                    <p className="text-muted text-sm">Available</p>
                    <p className="text-2xl" style={{ color: 'var(--color-success)' }}>{availableCount}</p>
                </div>
                <div className="card">
                    <p className="text-muted text-sm">Occupied</p>
                    <p className="text-2xl" style={{ color: 'var(--color-warning)' }}>{occupiedCount}</p>
                </div>
                <div className="card">
                    <p className="text-muted text-sm">Revenue (Today)</p>
                    <p className="text-2xl">${revenueToday.toLocaleString()}</p>
                </div>
            </div>

            <div className="card">
                <h3 className="text-xl mb-4" style={{ marginBottom: '1rem' }}>Recent Activity</h3>
                {recentBookings.length === 0 ? (
                    <p className="text-muted">No recent activity.</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {recentBookings.map(booking => (
                            <div key={booking.id} className="flex justify-between items-center" style={{ paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <div>
                                    <p>New Booking: Room {booking.roomNumber}</p>
                                    <p className="text-sm text-muted">Guest: {booking.guestName}</p>
                                </div>
                                <span className="text-sm text-muted">
                                    {new Date(booking.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
