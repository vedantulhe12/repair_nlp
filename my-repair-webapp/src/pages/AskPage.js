import React, { useState } from 'react';
import axios from 'axios';
import { Send, Loader2 } from 'lucide-react';
import AudioPlayer from '../components/AudioPlayer'; // <-- AUDIO IS HERE

export default function AskPage({ apiUrl }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const askAudioText = {
    'en': 'Type your repair question in the box, for example, "How to replace iPhone 12 battery". Then, press the "Get Answer" button.',
    'hi': 'बॉक्स में अपना मरम्मत प्रश्न टाइप करें, उदाहरण के लिए, "आईफोन 12 की बैटरी कैसे बदलें"। फिर, "उत्तर प्राप्त करें" बटन दबाएं।',
    'fr': 'Tapez votre question de réparation dans la case, par exemple, "Comment remplacer la batterie de l\'iPhone 12". Appuyez ensuite sur le bouton "Obtenir une réponse".',
    'de': 'Geben Sie Ihre Reparaturfrage in das Feld ein, zum Beispiel "Wie man den Akku des iPhone 12 austauscht". Drücken Sie dann auf die Schaltfläche "Antwort erhalten".',
    'es': 'Escriba su pregunta de reparación en el cuadro, por ejemplo, "Cómo reemplazar la batería del iPhone 12". Luego, presione el botón "Obtener respuesta".',
    'ur': 'باکس میں اپنی مرمت کا سوال ٹائپ کریں، مثال کے طور پر، "آئی فون 12 کی بیٹری کیسے تبدیل کی جائے"۔ پھر، "جواب حاصل کریں" بٹن دبائیں۔',
    'ko': '"iPhone 12 배터리 교체 방법"과 같은 수리 질문을 상자에 입력하십시오. 그런 다음 "답변 받기" 버튼을 누르십시오.',
    'zh': '在框中输入您的维修问题，例如“如何更换iPhone 12电池”。然后，按“获取答案”按钮。',
    'ja': '「iPhone 12のバッテリーを交換する方法」など、修理に関する質問をボックスに入力してください。その後、「回答を得る」ボタンを押してください。'
  };

  const handleAsk = async () => {
    if (question.trim().length === 0) return;
    setIsLoading(true);
    setAnswer(null);
    try {
      const response = await axios.post(`${apiUrl}/ask`, { question });
      setAnswer(response.data.answer);
    } catch (error) {
      console.error(error);
      setAnswer(`Error: ${error.message}. Is the Python server (main.py) running?`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Ask a Question</h1>
      {/* YOUR AUDIO PLAYER */}
      <AudioPlayer textMap={askAudioText} />

      <textarea
        className="main-textarea"
        placeholder="e.g., How do I repair 'iPad Wi-Fi Battery Replacement'?"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button
        className="main-button"
        onClick={handleAsk}
        disabled={isLoading || !question}
      >
        {isLoading ? ( <Loader2 className="animate-spin" /> ) : ( <Send size={20} /> )}
        {isLoading ? 'Thinking...' : 'Get Answer'}
      </button>
      {answer && (
        <div className="results-box">
          <pre>{answer}</pre>
        </div>
      )}
    </div>
  );
}