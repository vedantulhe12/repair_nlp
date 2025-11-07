import React, { useState } from 'react';
import axios from 'axios';
import { SearchCheck, Loader2 } from 'lucide-react';
import AudioPlayer from '../components/AudioPlayer'; // <-- AUDIO IS HERE

export default function DetectPage({ apiUrl }) {
  const [stepsText, setStepsText] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const detectAudioText = {
    'en': 'Paste your repair step into the text box. The AI will analyze it and tell you if it seems normal or anomalous. Then, press the "Analyze Step" button.',
    'hi': 'टेक्स्ट बॉक्स में अपना मरम्मत चरण पेस्ट करें। एआई इसका विश्लेषण करेगा और आपको बताएगा कि यह सामान्य है या विषम। फिर, "चरण का विश्लेषण करें" बटन दबाएं।',
    'fr': 'Collez votre étape de réparation dans la zone de texte. L\'IA l\'analysera et vous dira si elle semble normale ou anormale. Appuyez ensuite sur le bouton "Analyser l\'étape".',
    'de': 'Fügen Sie Ihren Reparaturschritt in das Textfeld ein. Die KI analysiert ihn und teilt Ihnen mit, ob er normal oder anomal erscheint. Drücken Sie dann auf die Schaltfläche "Schritt analysieren".',
    'es': 'Pegue su paso de reparación en el cuadro de texto. La IA lo analizará y le dirá si parece normal o anómalo. Luego, presione el botón "Analizar paso".',
    'ur': 'اپنا مرمتی مرحلہ ٹیکسٹ باکس میں چسپاں کریں۔ اے آئی اس کا تجزیہ کرے گی اور آپ کو بتائے گی کہ آیا یہ عام ہے یا غیر معمولی۔ پھر، "مرحلے کا تجزیہ کریں" بٹن دبائیں۔',
    'ko': '수리 단계를 텍스트 상자에 붙여넣으십시오. AI가 이를 분석하여 정상이거나 비정상적인지 알려줄 것입니다. 그런 다음 "단계 분석" 버튼을 누르십시오.',
    'zh': '将您的维修步骤粘贴到文本框中。人工智能将对其进行分析，并告诉您它看起来是正常的还是异常的。然后，按“分析步骤”按钮。',
    'ja': '修理の手順をテキストボックスに貼り付けてください。AIがそれを分析し、正常か異常かを判断します。その後、「ステップを分析」ボタンを押してください。'
  };

  const handleDetect = async () => {
    if (stepsText.trim().length === 0) return;
    setIsLoading(true);
    setResult(null);
    try {
      const response = await axios.post(`${apiUrl}/detect`, {
        step_text: stepsText,
      });
      setResult(response.data);
    } catch (error) {
      console.error(error);
      setResult({ error: `Error: ${error.message}. Is the Python server (main.py) running?` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Detect Anomaly in Steps</h1>
      {/* YOUR AUDIO PLAYER */}
      <AudioPlayer textMap={detectAudioText} />

      <textarea
        className="main-textarea"
        placeholder="e.g., Preheat the oven to 350 degrees to loosen the adhesive."
        value={stepsText}
        onChange={(e) => setStepsText(e.target.value)}
      />
      <button
        className="main-button"
        onClick={handleDetect}
        disabled={isLoading || !stepsText}
      >
        {isLoading ? ( <Loader2 className="animate-spin" /> ) : ( <SearchCheck size={20} /> )}
        {isLoading ? 'Analyzing...' : 'Analyze Step'}
      </button>
      {result && (
        <div className="results-box">
          {result.error ? (
            <p className="result-anomaly-danger">{result.error}</p>
          ) : (
            <>
              <h3>Analysis Result:</h3>
              <p className={result.is_anomaly ? 'result-anomaly-danger' : 'result-anomaly-normal'}>
                {result.is_anomaly ? 'ANOMALY DETECTED' : 'This step looks NORMAL'}
              </p>
              <p>Input: "{result.step_text}"</p>
              <p>Anomaly Score: {result.score.toFixed(4)} (Higher is more normal)</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}