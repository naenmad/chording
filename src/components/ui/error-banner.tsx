'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const ErrorBanner = () => {
    const searchParams = useSearchParams();
    const [error, setError] = useState('');

    useEffect(() => {
        const errorParam = searchParams.get('error');
        if (errorParam === 'admin_required') {
            setError('Anda memerlukan akses admin untuk menggunakan fitur tersebut.');
        }
    }, [searchParams]);

    if (!error) return null;

    return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Akses Ditolak:</span>
                <span className="ml-1">{error}</span>
                <button
                    className="absolute top-0 bottom-0 right-0 px-4 py-3"
                    onClick={() => setError('')}
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ErrorBanner;
