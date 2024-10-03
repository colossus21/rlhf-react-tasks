import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function App() {
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [chunks, setChunks] = useState([]);
    const [recordings, setRecordings] = useState([]);
    const [error, setError] = useState(null);
    const audioRef = useRef(null);

    useEffect(() => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    const mediaRecorder = new MediaRecorder(stream);
                    mediaRecorder.ondataavailable = (e) => {
                        if (e.data.size > 0) {
                            setChunks(prev => [...prev, e.data]);
                        }
                    };
                    mediaRecorder.onstop = () => {
                        const blob = new Blob(chunks, { 'type' : 'audio/webm' });
                        const url = URL.createObjectURL(blob);
                        setRecordings(prev => [...prev, { url, date: new Date(), title: `Recording ${prev.length + 1}` }]);
                        setChunks([]);
                    };
                    setMediaRecorder(mediaRecorder);
                })
                .catch(err => {
                    setError("Microphone access denied. Please grant permission to record audio.");
                });
        } else {
            setError("Your browser does not support audio recording.");
        }
    }, []);

    const startRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.start();
            setIsRecording(true);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    };

    const handleDownload = (url, title) => {
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${title}.webm`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const handleDelete = (index) => {
        setRecordings(recordings.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 sm:px-6 lg:px-8">
            <div className="max-w-sm w-full space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Recorder</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        {error && <div className="mb-4 p-2 border border-red-500 text-red-500">{error}</div>}
                        <Button
                            onClick={isRecording ? stopRecording : startRecording}
                            className={`w-48 ${isRecording ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                        >
                            {isRecording ? "Recording..." : "Press to record"}
                        </Button>
                    </CardContent>
                </Card>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Recordings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recordings.map((rec, index) => (
                                <div key={index} className="mb-4 border-b pb-4 last:border-b-0">
                                    <h3 className="font-semibold">{rec.title}</h3>
                                    <p>{rec.date.toLocaleString()}</p>
                                    <audio controls src={rec.url} ref={audioRef} className="w-full mt-2" />
                                    <div className="mt-2 flex space-x-2">
                                        <Button variant="outline" onClick={() => handleDownload(rec.url, rec.title)}>Download</Button>
                                        <Button variant="destructive" onClick={() => handleDelete(index)}>Delete</Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default App;