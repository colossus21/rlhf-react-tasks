// App.jsx
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

const App = () => {
    const [text, setText] = useState(loremIpsum);
    const [excludePunctuation, setExcludePunctuation] = useState(false);
    const [fileContent, setFileContent] = useState('');

    useEffect(() => {
        if (fileContent) setText(fileContent);
    }, [fileContent]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                setFileContent(e.target.result);
            };
            reader.readAsText(file);
        }
    };

    const countWords = (str) => {
        return str.trim().split(/\s+/).filter(word => word.length > 0).length;
    };

    const countCharacters = (str, exclude = false) => {
        return exclude ? str.replace(/[^\w]/g, '').length : str.length;
    };

    const readingTime = (text) => {
        const wordsPerMinute = 200; // average case
        const noOfWords = countWords(text);
        return Math.ceil(noOfWords / wordsPerMinute);
    };

    const topFiveWords = (str) => {
        let words = str.toLowerCase().match(/\b\w+\b/g) || [];
        if (excludePunctuation) {
            words = words.filter(word => /^[a-z]+$/.test(word));
        }
        const frequency = words.reduce((acc, word) => {
            acc[word] = (acc[word] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(frequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([word, count]) => ({ word, count }));
    };

    const handleExport = () => {
        const element = document.createElement("a");
        const file = new Blob([text], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = "essay.txt";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const stats = {
        words: countWords(text),
        characters: countCharacters(text, excludePunctuation),
        time: readingTime(text),
        topWords: topFiveWords(text)
    };

    const characterLimit = 1000;
    const charactersWritten = countCharacters(text, false);

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-400 to-purple-600 flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-lg p-4 bg-white shadow-lg">
                <CardContent>
                    <div className="mb-4">
                        <Input type="file" onChange={handleFileUpload} className="mb-2" />
                        <Textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="h-64"
                        />
                    </div>
                    <Switch
                        checked={excludePunctuation}
                        onCheckedChange={setExcludePunctuation}
                        className="mb-4"
                    >
                        Exclude spaces and punctuation
                    </Switch>
                    <div className="flex justify-between items-center">
                        <Button onClick={handleExport} className="bg-indigo-600 text-white">Export as .txt</Button>
                        <Button onClick={() => navigator.clipboard.writeText(text)} className="bg-indigo-600 text-white">Copy Text</Button>
                    </div>
                    <Progress value={(charactersWritten / characterLimit) * 100} className="mt-4"/>
                    <p className={`mt-1 text-sm ${charactersWritten > characterLimit ? 'text-red-500' : 'text-gray-600'}`}>
                        {charactersWritten}/{characterLimit}
                    </p>
                </CardContent>
                <CardContent>
                    <h2 className="text-lg font-semibold">Summary</h2>
                    <p>Word Count: {stats.words}</p>
                    <p>Character Count: {stats.characters}</p>
                    <p>Reading Time: {stats.time} minute(s)</p>
                    <h3 className="mt-2 text-md font-semibold">Top 5 Words:</h3>
                    <ul>
                        {stats.topWords.map(({word, count}) => <li key={word}>{word}: {count}</li>)}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
};

export default App;

// Placeholder for lorem ipsum text
const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...`; // Truncated for brevity