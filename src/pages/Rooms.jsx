import React, { useState } from 'react';
import { useLocalStorage, generateId } from '../hooks/useLocalStorage';

const Rooms = () => {
    const [rooms, setRooms] = useLocalStorage('rooms', []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newRoom, setNewRoom] = useState({ number: '', type: 'Standard', price: '', status: 'Clean' });

    const handleAddRoom = (e) => {
        e.preventDefault();
        const room = {
            id: generateId(),
            ...newRoom,
            price: parseFloat(newRoom.price) || 0
        };
        setRooms([...rooms, room]);
        setIsModalOpen(false);
        setNewRoom({ number: '', type: 'Standard', price: '', status: 'Clean' });
    };

    const handleDeleteRoom = (id) => {
        if (window.confirm('Are you sure you want to delete this room?')) {
            setRooms(rooms.filter(r => r.id !== id));
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Clean': return 'var(--color-success)';
            case 'Dirty': return 'var(--color-warning)';
            case 'Occupied': return 'var(--color-danger)';
            case 'Maintenance': return 'var(--color-text-muted)';
            default: return 'var(--color-text-main)';
        }
    };

    return (
        <div>
            <header className="flex justify-between items-center mb-8" style={{ marginBottom: '2rem' }}>
                <div>
                    <h2 className="text-2xl">Room Management</h2>
                    <p className="text-muted">Manage your hotel rooms and status.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ Add Room</button>
            </header>

            {rooms.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p className="text-muted mb-4">No rooms added yet.</p>
                    <button className="btn btn-outline" onClick={() => setIsModalOpen(true)}>Add your first room</button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {rooms.map(room => (
                        <div key={room.id} className="card animate-fade-in" style={{ position: 'relative' }}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl">Room {room.number}</h3>
                                    <p className="text-muted text-sm">{room.type}</p>
                                </div>
                                <span style={{
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '999px',
                                    fontSize: '0.75rem',
                                    backgroundColor: `${getStatusColor(room.status)}20`,
                                    color: getStatusColor(room.status),
                                    border: `1px solid ${getStatusColor(room.status)}40`
                                }}>
                                    {room.status}
                                </span>
                            </div>

                            <div className="flex justify-between items-center mt-4">
                                <p className="text-xl">${room.price}<span className="text-sm text-muted">/night</span></p>
                                <button
                                    className="text-sm text-muted hover:text-danger"
                                    onClick={() => handleDeleteRoom(room.id)}
                                    style={{ color: 'var(--color-danger)', opacity: 0.7 }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
                        <h3 className="text-xl mb-4">Add New Room</h3>
                        <form onSubmit={handleAddRoom} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm text-muted mb-1">Room Number</label>
                                <input
                                    type="text"
                                    required
                                    value={newRoom.number}
                                    onChange={e => setNewRoom({ ...newRoom, number: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-surface-hover)', background: 'var(--color-bg)', color: 'white' }}
                                />
                            </div>

                            <div className="flex gap-4">
                                <div style={{ flex: 1 }}>
                                    <label className="block text-sm text-muted mb-1">Type</label>
                                    <select
                                        value={newRoom.type}
                                        onChange={e => setNewRoom({ ...newRoom, type: e.target.value })}
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-surface-hover)', background: 'var(--color-bg)', color: 'white' }}
                                    >
                                        <option>Standard</option>
                                        <option>Deluxe</option>
                                        <option>Suite</option>
                                        <option>Penthouse</option>
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="block text-sm text-muted mb-1">Price ($)</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={newRoom.price}
                                        onChange={e => setNewRoom({ ...newRoom, price: e.target.value })}
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-surface-hover)', background: 'var(--color-bg)', color: 'white' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-muted mb-1">Status</label>
                                <select
                                    value={newRoom.status}
                                    onChange={e => setNewRoom({ ...newRoom, status: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-surface-hover)', background: 'var(--color-bg)', color: 'white' }}
                                >
                                    <option>Clean</option>
                                    <option>Dirty</option>
                                    <option>Maintenance</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Room</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Rooms;
