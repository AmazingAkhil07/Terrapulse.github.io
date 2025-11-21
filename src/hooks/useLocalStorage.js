import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
    const [data, setData] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error(error);
        }
    }, [key, data]);

    return [data, setData];
};

export const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
};
