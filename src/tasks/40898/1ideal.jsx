import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash, Download, Mic, StopCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function App() {
    const [isRecording, setIsRecording] = useState(false);
    const [recordings, setRecordings] = useState([]);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [error, setError] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    useEffect(() => {
        requestMicrophonePermission();
    }, []);

    const requestMicrophonePermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setPermissionGranted(true);
            stream.getTracks().forEach(track => track.stop());
            setError(null);
        } catch (err) {
            console.error("Error accessing the microphone", err);
            setPermissionGranted(false);
            setError("Microphone access denied. Please grant permission to use the recorder.");
        }
    };

    const startRecording = async () => {
        if (!permissionGranted) {
            await requestMicrophonePermission();
            if (!permissionGranted) return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                setRecordings(prev => [...prev, {
                    url: audioUrl,
                    name: `Recording ${prev.length + 1}`,
                    timestamp: new Date().toLocaleString()
                }]);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setError(null);
        } catch (err) {
            console.error("Error starting recording", err);
            setError("Failed to start recording. Please try again.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const deleteRecording = (index) => {
        setRecordings(prev => prev.filter((_, i) => i !== index));
    };

    const downloadRecording = (url, name) => {
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${name}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start pt-10 px-4 sm:px-6">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Sound Recorder</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <Button
                        onClick={toggleRecording}
                        className={`w-32 h-32 rounded-full text-white font-bold transition-colors duration-300 ${
                            isRecording ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                        }`}
                    >
                        {isRecording ? (
                            <>
                                <StopCircle className="mr-2" />
                                Recording...
                            </>
                        ) : (
                            <>
                                <Mic className="mr-2" />
                                Press to record
                            </>
                        )}
                    </Button>

                    {recordings.length > 0 && (
                        <div className="mt-8 w-full">
                            <h2 className="text-xl font-semibold mb-4">Recordings</h2>
                            <ul className="space-y-4">
                                {recordings.map((recording, index) => (
                                    <li key={index} className="bg-white p-4 rounded-lg shadow">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium">{recording.name}</span>
                                            <span className="text-sm text-gray-500">{recording.timestamp}</span>
                                        </div>
                                        <audio src={recording.url} controls className="w-full mb-2" />
                                        <div className="flex justify-end space-x-2">
                                            <Button
                                                onClick={() => deleteRecording(index)}
                                                variant="destructive"
                                                size="sm"
                                            >
                                                <Trash className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                onClick={() => downloadRecording(recording.url, recording.name)}
                                                variant="outline"
                                                size="sm"
                                            >
                                                <Download className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}