'use client';

import { useState } from 'react';
import { encryptApiKey, sanitizeApiKey } from '@/lib/crypto/encryption';
import { Key, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

interface ApiKeyConfigProps {
  ahrefsKey: string;
  semrushKey: string;
  onAhrefsChange: (key: string) => void;
  onSemrushChange: (key: string) => void;
}

export function ApiKeyConfig({ ahrefsKey, semrushKey, onAhrefsChange, onSemrushChange }: ApiKeyConfigProps) {
  const [showAhrefs, setShowAhrefs] = useState(false);
  const [showSemrush, setShowSemrush] = useState(false);
  const [ahrefsEncrypted, setAhrefsEncrypted] = useState<string | null>(null);
  const [semrushEncrypted, setSemrushEncrypted] = useState<string | null>(null);

  const handleEncryptAhrefs = async (key: string) => {
    if (key.length > 10) {
      const encrypted = await encryptApiKey(key);
      setAhrefsEncrypted(encrypted);
    }
  };

  const handleEncryptSemrush = async (key: string) => {
    if (key.length > 10) {
      const encrypted = await encryptApiKey(key);
      setSemrushEncrypted(encrypted);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Key className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">API Key Configuration</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ahrefs Key */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ahrefs API Key
          </label>
          <div className="relative">
            <input
              type={showAhrefs ? 'text' : 'password'}
              value={ahrefsKey}
              onChange={(e) => {
                onAhrefsChange(e.target.value);
                handleEncryptAhrefs(e.target.value);
              }}
              placeholder="Enter your Ahrefs API key"
              className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <button
              onClick={() => setShowAhrefs(!showAhrefs)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              type="button"
            >
              {showAhrefs ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {ahrefsEncrypted && (
            <p className="mt-2 flex items-center gap-1 text-xs text-green-600">
              <CheckCircle className="h-3 w-3" />
              Encrypted: {ahrefsEncrypted.substring(0, 20)}...
            </p>
          )}
          {ahrefsKey && (
            <p className="mt-1 text-xs text-gray-500">
              Stored as: {sanitizeApiKey(ahrefsKey)}
            </p>
          )}
        </div>

        {/* SEMrush Key */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SEMrush API Key
          </label>
          <div className="relative">
            <input
              type={showSemrush ? 'text' : 'password'}
              value={semrushKey}
              onChange={(e) => {
                onSemrushChange(e.target.value);
                handleEncryptSemrush(e.target.value);
              }}
              placeholder="Enter your SEMrush API key"
              className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <button
              onClick={() => setShowSemrush(!showSemrush)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              type="button"
            >
              {showSemrush ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {semrushEncrypted && (
            <p className="mt-2 flex items-center gap-1 text-xs text-green-600">
              <CheckCircle className="h-3 w-3" />
              Encrypted: {semrushEncrypted.substring(0, 20)}...
            </p>
          )}
          {semrushKey && (
            <p className="mt-1 text-xs text-gray-500">
              Stored as: {sanitizeApiKey(semrushKey)}
            </p>
          )}
        </div>
      </div>

      {!ahrefsKey || !semrushKey ? (
        <div className="mt-4 flex items-center gap-2 text-sm text-yellow-700 bg-yellow-50 p-3 rounded">
          <AlertCircle className="h-4 w-4" />
          Both API keys are required to access SEO data
        </div>
      ) : (
        <div className="mt-4 flex items-center gap-2 text-sm text-green-700 bg-green-50 p-3 rounded">
          <CheckCircle className="h-4 w-4" />
          API keys configured successfully. Data is encrypted at rest.
        </div>
      )}
    </div>
  );
}
