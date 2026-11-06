import React from 'react';
import { useStore } from '../../context/useStore';
import { Sparkles } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useStore();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div className="bg-[#171614] text-[#F8F6F1] border border-[#B69A70] px-5 py-3 shadow-2xl flex items-center space-x-3 text-xs tracking-wider">
        <Sparkles className="w-4 h-4 text-[#B69A70] shrink-0" />
        <span className="font-light">{toastMessage}</span>
      </div>
    </div>
  );
};
