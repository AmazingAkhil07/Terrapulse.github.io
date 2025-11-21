import React, { useState } from 'react';
import { useLocalStorage, generateId } from '../hooks/useLocalStorage';

const Bookings = () => {
    const [bookings, setBookings] = useLocalStorage('bookings', []);
    const [rooms] = useLocalStorage('rooms', []);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [newBooking, setNewBooking] = useState({
        guestName: '',
        roomId: '',
        checkIn: '',
        checkOut: '',
        status: 'Confirmed'
    });

    const handleCreateBooking = (e) => {
        e.preventDefault();

        const room = rooms.find(r => r.id === newBooking.roomId);
        if (!room) return;

        const start = new Date(newBooking.checkIn);
        const end = new Date(newBooking.checkOut);
        const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

        if (nights <= 0) {
            alert('Check-out date must be after check-in date');
            return;
        }

        const booking = {
            id: generateId(),
            ...newBooking,
            roomNumber: room.number,
            totalPrice: nights * room.price,
            createdAt: new Date().toISOString()
        };

        setBookings([...bookings, booking]);
        setIsModalOpen(false);
        setNewBooking({ guestName: '', roomId: '', checkIn: '', checkOut: '', status: 'Confirmed' });
    };

    const handleDeleteBooking = (id) => {
        if (window.confirm('Cancel this booking?')) {
            setBookings(bookings.filter(b => b.id !== id));
        }
    };

    return (
        <div>
            <header className="flex justify-between items-center mb-8" style={{ marginBottom: '2rem' }}>
                <div>
                    <h2 className="text-2xl">Bookings</h2>
                    <p className="text-muted">View and manage guest reservations.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ New Booking</button>
            </header>

            {bookings.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p className="text-muted mb-4">No bookings yet.</p>
                    <button className="btn btn-outline" onClick={() => setIsModalOpen(true)}>Create a reservation</button>
                </div>
            ) : (
                <div className="card" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <th style={{ padding: '1rem' }}>Guest</th>
                                <th style={{ padding: '1rem' }}>Room</th>
                                <th style={{ padding: '1rem' }}>Check-In</th>
                                <th style={{ padding: '1rem' }}>Check-Out</th>
                                <th style={{ padding: '1rem' }}>Total</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(booking => (
                                <tr key={booking.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem' }}>{booking.guestName}</td>
                                    <td style={{ padding: '1rem' }}>Room {booking.roomNumber}</td>
                                    <td style={{ padding: '1rem' }}>{booking.checkIn}</td>
                                    <td style={{ padding: '1rem' }}>{booking.checkOut}</td>
                                    <td style={{ padding: '1rem' }}>${booking.totalPrice}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            backgroundColor: 'var(--color-success)',
                                            color: 'white',
                                            fontSize: '0.75rem'
                                        }}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <button
                                            className="text-sm text-muted hover:text-danger"
                                            onClick={() => handleDeleteBooking(booking.id)}
                                            style={{ color: 'var(--color-danger)' }}
                                        >
                                            Cancel
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
                        <h3 className="text-xl mb-4">New Booking</h3>
                        <form onSubmit={handleCreateBooking} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm text-muted mb-1">Guest Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newBooking.guestName}
                                    onChange={e => setNewBooking({ ...newBooking, guestName: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-surface-hover)', background: 'var(--color-bg)', color: 'white' }}
                                />
                            </div>

                            <div className="flex gap-4">
                                <div style={{ flex: 1 }}>
                                    <label className="block text-sm text-muted mb-1">Check-In</label>
                                    <input
                                        type="date"
                                        required
                                        value={newBooking.checkIn}
                                        onChange={e => setNewBooking({ ...newBooking, checkIn: e.target.value })}
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-surface-hover)', background: 'var(--color-bg)', color: 'white' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="block text-sm text-muted mb-1">Check-Out</label>
                                    <input
                                        type="date"
                                        required
                                        value={newBooking.checkOut}
                                        onChange={e => setNewBooking({ ...newBooking, checkOut: e.target.value })}
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-surface-hover)', background: 'var(--color-bg)', color: 'white' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-muted mb-1">Room</label>
                                <select
                                    required
                                    value={newBooking.roomId}
                                    onChange={e => setNewBooking({ ...newBooking, roomId: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-surface-hover)', background: 'var(--color-bg)', color: 'white' }}
                                >
                                    <option value="">Select a room...</option>
                                    {rooms.map(room => (
                                        <option key={room.id} value={room.id}>
                                            Room {room.number} ({room.type}) - ${room.price}/night
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Confirm Booking</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Bookings;
