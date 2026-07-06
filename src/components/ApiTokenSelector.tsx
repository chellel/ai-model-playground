import React, { useState, useRef, useEffect } from 'react';
import { Key, ChevronDown, Check, Plus, X } from 'lucide-react';

export interface ApiToken {
  id: string;
  name: string;
  token: string;
  masked: string;
}

const DEFAULT_TOKENS: ApiToken[] = [
  {
    id: '1',
    name: 'auto',
    token: 'x3qK981248972149gG8B',
    masked: 'x3qK**********gG8B',
  },
  {
    id: '2',
    name: 'default project',
    token: 'sk-live-982a881920719A',
    masked: 'sk-live**********719A',
  },
  {
    id: '3',
    name: 'test environment',
    token: 'sk-test-441f390219922B',
    masked: 'sk-test**********922B',
  },
];

export const ApiTokenSelector: React.FC = () => {
  const [tokens, setTokens] = useState<ApiToken[]>(DEFAULT_TOKENS);
  const [selectedTokenId, setSelectedTokenId] = useState<string>('1');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newToken, setNewToken] = useState<string>('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedToken = tokens.find((t) => t.id === selectedTokenId) || tokens[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsAdding(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const maskToken = (val: string) => {
    if (val.length <= 8) return '****' + val.slice(-4);
    return val.slice(0, 4) + '**********' + val.slice(-4);
  };

  const handleAddToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newToken.trim()) return;
    const newId = Date.now().toString();
    const item: ApiToken = {
      id: newId,
      name: newName.trim(),
      token: newToken.trim(),
      masked: maskToken(newToken.trim()),
    };
    setTokens([...tokens, item]);
    setSelectedTokenId(newId);
    setNewName('');
    setNewToken('');
    setIsAdding(false);
    setIsOpen(false);
  };

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs relative" ref={dropdownRef}>
      <div className="flex items-center gap-2 mb-3 text-gray-900">
        <Key className="w-4 h-4 text-gray-600 shrink-0 transform -rotate-45" />
        <span className="font-bold text-sm tracking-tight">API Token</span>
      </div>

      <div
        onClick={() => {
          setIsOpen(!isOpen);
          setIsAdding(false);
        }}
        className="border border-gray-200/90 rounded-xl px-3.5 py-2.5 flex items-center justify-between cursor-pointer hover:border-gray-300 bg-white transition select-none shadow-2xs group"
      >
        <div className="flex items-center gap-3 min-w-0 pr-2">
          <span className="text-sm font-medium text-gray-900 truncate shrink-0">
            {selectedToken.name}
          </span>
          <span className="text-sm font-mono text-gray-400 truncate">
            {selectedToken.masked}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-gray-800' : 'group-hover:text-gray-700'
          }`}
        />
      </div>

      {isOpen && (
        <div className="absolute left-5 right-5 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden py-1.5 transition-all">
          {!isAdding ? (
            <>
              <div className="max-h-52 overflow-y-auto divide-y divide-gray-50">
                {tokens.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setSelectedTokenId(t.id);
                      setIsOpen(false);
                    }}
                    className={`px-3.5 py-2.5 flex items-center justify-between cursor-pointer transition ${
                      t.id === selectedTokenId ? 'bg-gray-50/80 text-gray-900 font-medium' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <span className="text-sm text-gray-900 truncate">{t.name}</span>
                      <span className="text-xs font-mono text-gray-400 truncate">{t.masked}</span>
                    </div>
                    {t.id === selectedTokenId && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-1 mt-1 px-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(true)}
                  className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>添加新 Token</span>
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleAddToken} className="p-3 space-y-2.5">
              <div className="flex items-center justify-between pb-1 border-b border-gray-100">
                <span className="text-xs font-semibold text-gray-800">添加 API Token</span>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="名称 (例: jizao auto)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                  autoFocus
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="API Key / Token"
                  value={newToken}
                  onChange={(e) => setNewToken(e.target.value)}
                  className="w-full text-xs font-mono px-2.5 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  disabled={!newName.trim() || !newToken.trim()}
                  className="flex-1 py-1.5 bg-black text-white text-xs font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-40 transition"
                >
                  确定
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
