import React from 'react';
import { X, Download } from 'lucide-react';
import { Language } from '../../lib/types';

interface ArticleModalProps {
  isOpen: boolean;
  language: Language;
  cardText: string;
  article: string;
  isLoading: boolean;
  onClose: () => void;
  onDownload: () => void;
}

const ArticleModal: React.FC<ArticleModalProps> = ({
  isOpen,
  language,
  cardText,
  article,
  isLoading,
  onClose,
  onDownload,
}) => {
  if (!isOpen) return null;

  const t = {
    zh: {
      title: 'AI 深度解读',
      loading: '正在生成文章...',
      download: '下载文章',
      close: '关闭',
    },
    en: {
      title: 'AI Deep Analysis',
      loading: 'Generating article...',
      download: 'Download',
      close: 'Close',
    },
  }[language];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[80vh] m-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">{cardText}</p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">{t.loading}</p>
              </div>
            </div>
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">
                {article}
              </div>
            </div>
          )}
        </div>

        {!isLoading && article && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onDownload}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <Download size={16} />
              {t.download}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
            >
              {t.close}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleModal;
