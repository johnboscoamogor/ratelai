import React from 'react';
import { useTranslation } from 'react-i18next';
import { RatelLogo } from '../constants';
import { playSound } from '../services/audioService';
import LanguageSwitcher from './LanguageSwitcher';
import { AppSettings } from '../types';

interface LandingPageProps {
  onStartChatting: () => void;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  connectionError?: string | null;
  onRetryConnection: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartChatting, settings, setSettings, connectionError, onRetryConnection }) => {
  const { t } = useTranslation();

  const handleClick = () => {
    playSound('click');
    onStartChatting();
  };

  const renderConnectionError = () => {
    if (!connectionError) return null;

    const renderErrorContent = (title: string, content: string, showRetry: boolean) => {
        return (
            <div className="absolute top-0 left-0 right-0 bg-red-800/90 border-b border-red-600 p-3 text-center text-white text-sm shadow-lg z-10">
                <p className="font-bold text-base">{title}</p>
                <div className="max-w-3xl mx-auto text-left px-2 py-2">
                     <p 
                        className="whitespace-pre-wrap" 
                        dangerouslySetInnerHTML={{ 
                            __html: content
                                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-yellow-300">$1</strong>')
                                .replace(/`([^`]+)`/g, '<code class="bg-gray-700 p-1 rounded-sm text-red-300">$1</code>')
                                .replace(/\*(.*?)\*/g, '<em class="text-gray-300 not-italic">$1</em>')
                        }} 
                     />
                </div>
                {showRetry && (
                  <div className="mt-2">
                    <button
                      onClick={onRetryConnection}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-lg transition-colors"
                    >
                      Retry Connection
                    </button>
                  </div>
                )}
            </div>
        );
    }
    
    if (connectionError.includes('---SERVER CONNECTION FAILED---')) {
        return renderErrorContent('Server Connection Failed', connectionError.replace('---SERVER CONNECTION FAILED---', ''), false);
    }
    
    if (connectionError.includes('---CLIENT CONNECTION FAILED---')) {
        return renderErrorContent('Browser Connection Failed', connectionError.replace('---CLIENT CONNECTION FAILED---', ''), true);
    }

    if (connectionError.includes('---API ROUTE FAILED---')) {
        return renderErrorContent('Deployment Error', connectionError.replace('---API ROUTE FAILED---', ''), false);
    }

    // Fallback for any other generic errors
    return (
        <div className="absolute top-0 left-0 right-0 bg-red-800/90 border-b border-red-600 p-3 text-center text-white text-sm shadow-lg z-10">
            <p className="font-bold">Connection Error</p>
            <p className="max-w-xl mx-auto whitespace-pre-wrap text-left px-2">{connectionError}</p>
        </div>
    );
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-4" style={{ backgroundColor: '#0d1117' }}>
      {renderConnectionError()}
      <div className="absolute top-6 right-6">
        <LanguageSwitcher
          currentLang={settings.language}
          onChangeLang={(lang) => setSettings(prev => ({ ...prev, language: lang }))}
        />
      </div>
      <div className="text-center">
        <RatelLogo className="w-32 h-auto mx-auto mb-4 text-green-600" />

        <h1 className="text-6xl md:text-7xl font-bold mb-4">{t('landing.title')}</h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          {t('landing.subtitle')}
        </p>
        <button
          onClick={handleClick}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105"
        >
          {t('landing.startChatting')}
        </button>
      </div>
      <footer className="absolute bottom-6 text-gray-400 text-sm">
        {t('landing.footer')}
      </footer>
    </div>
  );
};

export default LandingPage;