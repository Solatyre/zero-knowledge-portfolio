'use client';
import { useState } from 'react';
import CryptoJS from 'crypto-js';

export default function Home() {
  const [secret, setSecret] = useState('');
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEncryptAndSave = async () => {
    setLoading(true);
    const randomKey = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    const encryptedText = CryptoJS.AES.encrypt(secret, randomKey).toString();

    const response = await fetch('/api/secret', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ encryptedText }),
    });
    
    const data = await response.json();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    setLink(`${baseUrl}/secret/${data.id}#${randomKey}`);
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-900 text-white">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-green-400">Zero-Knowledge Secret Sharer</h1>
        <p className="text-sm mb-6 text-gray-400">Your secret is encrypted in your browser. We never see it.</p>
        
        <textarea
          className="w-full p-3 bg-gray-700 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-green-400 text-white"
          rows={4}
          placeholder="Type your sensitive data here..."
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
        />
        
        <button
          onClick={handleEncryptAndSave}
          disabled={!secret || loading}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Encrypting...' : 'Create Secure Link'}
        </button>

        {link && (
          <div className="mt-6 p-4 bg-gray-700 rounded border border-green-500">
            <p className="text-sm mb-2 font-bold text-red-400">Share this link. It works ONCE.</p>
            <input 
              type="text" 
              readOnly 
              value={link} 
              className="w-full bg-gray-900 p-2 rounded text-sm text-gray-300"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
          </div>
        )}
      </div>
    </main>
  );
}
