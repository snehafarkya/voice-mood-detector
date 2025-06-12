import { useRef, useState } from 'react';
//@ts-ignore
import Sentiment from 'sentiment';

const sentiment = new Sentiment();

const detectHindiMood = (text: string): 'positive' | 'negative' | 'neutral' | 'shocking' => {
  const lower = text.toLowerCase();

  const positiveWords = ['khush', 'acha', 'pyaar', 'nice', 'shandar', 'masti', 'maja'];
  const negativeWords = ['dukhi','upset', 'bura', 'gussa', 'naraz', 'udaas', 'dard', 'tanha'];
  const shockingWords = [
    'dhoka', 'chori', 'hatya', 'aatank', 'hamla', 'blast','surprise',
    'murder', 'kill', 'explosion', 'terrorist', 'gun', 'dead', 'death','what'
  ];

  if (shockingWords.some(word => lower.includes(word))) return 'shocking';
  if (positiveWords.some(word => lower.includes(word))) return 'positive';
  if (negativeWords.some(word => lower.includes(word))) return 'negative';

  return 'neutral';
};

export default function VoiceMoodDetector() {
  const [transcript, setTranscript] = useState('');
  const [mood, setMood] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const bgColor =
    mood === 'positive' ? 'bg-green-900'
    : mood === 'negative' ? 'bg-[#004040]'
    : mood === 'neutral' ? 'bg-purple-900'
    : mood === 'shocking' ? 'bg-blue-900'
    : 'bg-[#242424]';

  const handleStart = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setListening(true);

    recognition.onresult = (event: any) => {
      const speechText = event.results[0][0].transcript;
      setTranscript(speechText);

      const result = sentiment.analyze(speechText);
      let moodResult: 'positive' | 'negative' | 'neutral' | 'shocking' = 'neutral';

      if (result.score > 1) moodResult = 'positive';
      else if (result.score < -1) moodResult = 'negative';
      else moodResult = detectHindiMood(speechText);

      if (moodResult === 'shocking' && navigator.vibrate) {
        navigator.vibrate([150, 100, 150]);
      }

      setMood(moodResult);
      setListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  return (
    <div className={`w-full h-screen flex flex-col items-center justify-center transition-all duration-500 ${bgColor}`}>
      <h1 className="md:text-5xl text-3xl text-center font-bold mb-4 text-white">🎙️ Voice Mood Detector</h1>

      <div className="flex md:flex-row flex-col gap-4">
        <button
          onClick={handleStart}
          disabled={listening}
          className="rounded-lg border py-4 px-7 bg-[#1a1a1a] text-white font-medium transition hover:border-[#646cff] duration-300"
        >
          {listening ? 'Listening...' : 'Start Speaking'}
        </button>
      </div>

      {transcript && (
        <div className="mt-6 text-center">
          <p className="text-xl text-amber-100">
            🗣️ You said: <span className="italic">{transcript}</span>
          </p>
          <p className="text-2xl mt-2 text-gray-100">
            Mood:
            <span className="font-bold ml-2">
              {mood === 'positive' && '😄 Positive'}
              {mood === 'negative' && '😢 Negative'}
              {mood === 'neutral' && '🙂 Neutral'}
              {mood === 'shocking' && '😲 Shocking'}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
