import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

function App() {
    const [text, setText] = useState(`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`);
    const [excludeSpaces, setExcludeSpaces] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setText(e.target.result);
            };
            reader.readAsText(file);
        }
    };

    const countWords = (str) => {
        const arr = str.match(/\w+/g) || [];
        return arr.length;
    };

    const countChars = (str, exclude = false) => {
        if (exclude) {
            return str.replace(/[^\w]/g, '').length;
        }
        return str.length;
    };

    const readingTime = (text) => {
        const wordsPerMinute = 200; // average reading speed
        const words = countWords(text);
        return Math.ceil(words / wordsPerMinute);
    };

    const topWords = (str) => {
        const words = str.toLowerCase().match(/\b\w+\b/g) || [];
        const freq = words.reduce((acc, word) => {
            acc[word] = (acc[word] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(freq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([word, count]) => ({ word, count }));
    };

    const exportText = () => {
        const element = document.createElement('a');
        const file = new Blob([text], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = "essay.txt";
        document.body.appendChild(element);
        element.click();
    };

    const copyText = () => {
        navigator.clipboard.writeText(text);
    };

    const charCount = countChars(text, excludeSpaces);
    const wordCount = countWords(text);
    const readTime = readingTime(text);
    const top5Words = topWords(text);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 to-purple-600 p-4 sm:p-8">
            <Card className="w-full max-w-3xl">
                <CardHeader>
                    <CardTitle>Essay Analyzer</CardTitle>
                </CardHeader>
                <CardContent>
                    <input
                        type="file"
                        accept=".txt"
                        onChange={handleFileUpload}
                        ref={fileInputRef}
                        className="hidden"
                    />
                    <Button
                        onClick={() => fileInputRef.current.click()}
                        className="mb-4 bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                        Upload File
                    </Button>
                    <Textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="mb-4 h-48"
                    />
                    <div className="flex justify-between items-center mb-4">
                        <Checkbox
                            checked={excludeSpaces}
                            onCheckedChange={setExcludeSpaces}
                        >
                            Exclude spaces and punctuation
                        </Checkbox>
                        <div>
                            <Button onClick={exportText}>Export as .txt</Button>
                            <Button onClick={copyText} className="ml-2">Copy Text</Button>
                        </div>
                    </div>
                    <Progress
                        value={charCount}
                        max={1000}
                        className="mb-2"
                    />
                    <p className={`text-sm text-right ${charCount > 1000 ? 'text-red-500' : ''}`}>
                        {charCount}/{1000}
                    </p>
                    <div className="mt-4">
                        <h3 className="font-bold">Summary:</h3>
                        <p>Words: {wordCount}</p>
                        <p>Characters: {charCount}</p>
                        <p>Reading Time: {readTime} min</p>
                        <h4 className="mt-4 font-bold">Top 5 Words:</h4>
                        <ul>
                            {top5Words.map(({word, count}) => (
                                <li key={word}>{word}: {count}</li>
                            ))}
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default App;