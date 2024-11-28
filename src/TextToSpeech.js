import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const voices = [ // you can grab voice id from ElevenLabs Dashboard, you need to add it to your library first
  { id: 'oaGwHLz3csUaSnc2NBD4', name: 'British Voice - Benedict' },
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Alternate Voice' }
];

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [voiceId, setVoiceId] = useState(voices[0].id);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  const generateSpeech = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, // POST address to get the TTS
        {
          text: text,
        voice_settings: { // Settings for the Voice
          stability: 0.7,        // Lower for more natural variation
          similarity_boost: 0.97, // Higher for more expressive voice
          style: 1,               // Optional: Add emotional style
          use_speaker_boost: true // Enhanced voice clarity
          }
        },
        {
          headers: {
            'xi-api-key': 'YOUR_API_KEY', // API Key here
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg'
          },
          responseType: 'blob'
        }
      );

      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
    } catch (error) {
      setError('Failed to generate speech');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { // useEffect to play the voice upon button press
    if (audioUrl && audioRef.current) {
      audioRef.current.play();
    }
  }, [audioUrl]);

  return (
    <div>
      <textarea 
        value={text} 
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to convert to speech"
      />
      <select 
        value={voiceId} 
        onChange={(e) => setVoiceId(e.target.value)}
      >
        {voices.map(voice => (
          <option key={voice.id} value={voice.id}>
            {voice.name}
          </option>
        ))}
      </select>
      <button onClick={generateSpeech} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate Speech'}
      </button>
      {error && <div style={{color: 'red'}}>{error}</div>}
      {audioUrl && (
        <audio ref={audioRef} src={audioUrl} style={{display: 'none'}}>
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default TextToSpeech;
