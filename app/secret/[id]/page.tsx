'use client';
import { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { use } from 'react';

export default function SecretPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [decryptedSecret, setDecryptedSecret] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndDecrypt = async () => {
      try {
        const key = window.location.hash.substring(1);
        if (!key) throw new Error("No decryption key found in the URL.");

        const response = await fetch(`/api/secret?id=${resolvedParams.id}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Failed to retrieve secret.");

        const bytes = CryptoJS.AES.decrypt(data.encryptedText, key);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);

        if (!originalText) throw new Error("Decryption failed. Corrupted data.");

        setDecryptedSecret(originalText);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAndDecrypt();
  }, [resolvedParams.id]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-900 text-white">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-green-400">Secret Message</h1>

        {loading && <p className="animate-pulse">Fetching and decrypting...</p>}

        {error && (
          <div className="p-4 bg-red-900/50 border border-red-500 rounded text-red-200">
            {error} (It may have already been burned).
          </div>
        )}

        {decryptedSecret && (
          <div>
            <p className="text-sm mb-4 text-red-400 font-bold">This message is permanently deleted from the database. Save it now.</p>
            <textarea
              className="w-full p-3 bg-gray-700 rounded focus:outline-none text-white"
              rows={6}
              readOnly
              value={decryptedSecret}
            />
          </div>
        )}
      </div>
    </main>
  );
}

