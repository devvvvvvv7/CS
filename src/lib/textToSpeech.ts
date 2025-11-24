// Text-to-Speech using Web Speech API (built-in, no API key needed)
export const SUPPORTED_LANGUAGES = [
  { code: 'en-US', name: 'English', flag: '🇺🇸' },
  { code: 'hi-IN', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
  { code: 'pa-IN', name: 'ਪੰਜਾਬੀ (Punjabi)', flag: '🇮🇳' },
  { code: 'mr-IN', name: 'मराठी (Marathi)', flag: '🇮🇳' },
  { code: 'ta-IN', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
  { code: 'te-IN', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
  { code: 'bn-IN', name: 'বাংলা (Bengali)', flag: '🇮🇳' },
  { code: 'gu-IN', name: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
];

export const speak = (text: string, language: string = 'en-US'): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(event);

    window.speechSynthesis.speak(utterance);
  });
};

export const stopSpeaking = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
