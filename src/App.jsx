import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [error, setError] = useState(null);
  const mediaRecorder = useRef(null);

  // Request permission and initialize recorder
  const initializeRecorder = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.onstart = () => setIsRecording(true);
      mediaRecorder.current.ondataavailable = handleDataAvailable;
      mediaRecorder.current.onstop = handleStop;
      setHasPermission(true);
    } catch (err) {
      setHasPermission(false);
      setError("Microphone permission denied.");
    }
  };

  const startRecording = () => {
    if (!hasPermission) {
      initializeRecorder();
    } else if (mediaRecorder.current.state === "inactive") {
      mediaRecorder.current.start();
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
    }
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      const blob = new Blob([event.data], { type: 'audio/webm' });
      setRecordings(prev => [...prev, { blob, date: new Date() }]);
    }
  };

  const handleStop = () => {
    setIsRecording(false);
  };

  const downloadRecording = (blob, index) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `recording_${index}.webm`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const deleteRecording = (index) => {
    setRecordings(recordings.filter((_, i) => i !== index));
  };

  return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sound Recorder</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {error && <div className="mb-4 p-2 border border-red-500 text-red-500">{error}</div>}
            <Button
                onClick={isRecording ? stopRecording : startRecording}
                className={`${isRecording ? 'bg-green-500' : 'bg-red-500'} text-white`}>
              {isRecording ? "Recording..." : "Press to Record"}
            </Button>
          </CardContent>
        </Card>

        <div className="mt-4 w-full max-w-md">
          <h2 className="mb-2 text-lg font-semibold">Recordings</h2>
          {recordings.map((recording, index) => (
              <Card key={index} className="mb-2">
                <CardContent>
                  <div>Recording {index + 1}</div>
                  <div>{recording.date.toLocaleString()}</div>
                  <audio controls src={URL.createObjectURL(recording.blob)} className="mt-2 w-full"/>
                  <Button variant="destructive" size="sm" onClick={() => deleteRecording(index)} className="mt-2 mr-2">Delete</Button>
                  <Button size="sm" onClick={() => downloadRecording(recording.blob, index)}>Download</Button>
                </CardContent>
              </Card>
          ))}
        </div>
      </div>
  );
};

export default App;