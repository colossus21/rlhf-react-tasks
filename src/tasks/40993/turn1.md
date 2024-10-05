### Code Plan:

1. Main component structure:
   - WordCounter function component
   - useState hooks for text, wordCount, charCount, readingTime, excludeSpacesPunctuation, wordFrequency
   - useEffect hook for text analysis and state updates
2. File upload functionality: `handleFileUpload` function using `FileReader` API
3. Text area for input:
   - Shadcn Textarea component
   - Default "lorem ipsum" text
4. Progress bar for character count:
   - Custom Progress component
   - Color-changing based on character count (green, yellow, red)
5.  Summary section:
     - Word count, character count, reading time
     - Top 5 words frequency list
6.  Toggle for excluding spaces and punctuation: Shadcn Switch component

7. Export and copy functionality:
   - `handleExport` function to create and download `.txt` file
   - `handleCopy` function to copy text to clipboard

### Code:

```jsx
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

const WordCounter = () => {
   const [text, setText] = useState(
           "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc id aliquam tincidunt, nisl nunc tincidunt nunc, vitae aliquam nunc nunc vitae nunc."
   );
   const [wordCount, setWordCount] = useState(0);
   const [charCount, setCharCount] = useState(0);
   const [readingTime, setReadingTime] = useState(0);
   const [excludeSpacesPunctuation, setExcludeSpacesPunctuation] = useState(false);
   const [wordFrequency, setWordFrequency] = useState({});
   const fileInputRef = useRef(null);

   const CHAR_LIMIT = 1000;

   useEffect(() => {
      const words = text.trim().split(/\s+/).filter(word => word !== '');
      setWordCount(words.length);

      const chars = excludeSpacesPunctuation
              ? text.replace(/[^\w]/g, '').length
              : text.length;
      setCharCount(chars);

      setReadingTime(Math.ceil(words.length / 200)); // Assuming 200 words per minute

      // Word frequency analysis
      const frequency = {};
      words.forEach(word => {
         word = word.toLowerCase().replace(/[^\w]/g, '');
         if (word) frequency[word] = (frequency[word] || 0) + 1;
      });
      setWordFrequency(frequency);
   }, [text, excludeSpacesPunctuation]);

   const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
         if (file.type !== 'text/plain') {
            return;
         }
         const reader = new FileReader();
         reader.onload = (e) => {
            setText(e.target.result);
         };
         reader.onerror = () => {};
         reader.readAsText(file);
      }
   };

   const triggerFileInput = () => {
      fileInputRef.current.click();
   };

   const handleExport = () => {
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'essay.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
   };

   const handleCopy = () => {
      navigator.clipboard.writeText(text);
   };

   const getProgressColor = () => {
      if (charCount > CHAR_LIMIT) return "bg-red-500";
      if (charCount >= CHAR_LIMIT * 0.9) return "bg-yellow-500";
      return "bg-green-500";
   };

   return (
           <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 to-purple-600 p-4">
              <Card className="w-full max-w-2xl">
                 <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Word and Character Counter</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                       <input
                               type="file"
                               accept=".txt"
                               onChange={handleFileUpload}
                               className="hidden"
                               ref={fileInputRef}
                       />
                       <Button
                               onClick={triggerFileInput}
                               variant="outline"
                               className="bg-indigo-600 text-white hover:bg-indigo-700"
                       >
                          Upload .txt
                       </Button>
                       <div className="space-x-2">
                          <Button onClick={handleCopy} variant="outline" className="bg-indigo-600 text-white hover:bg-indigo-700">
                             Copy
                          </Button>
                          <Button onClick={handleExport} variant="outline" className="bg-indigo-600 text-white hover:bg-indigo-700">
                             Export
                          </Button>
                       </div>
                    </div>
                    <Textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full h-64 p-2 border rounded"
                            placeholder="Enter your text here..."
                    />
                    <Progress
                            value={Math.min((charCount / CHAR_LIMIT) * 100, 100)}
                            className="w-full h-2"
                            style={{ backgroundColor: '#e5e7eb' }}
                    >
                       <div
                               className={`h-full ${getProgressColor()}`}
                               style={{ width: `${Math.min((charCount / CHAR_LIMIT) * 100, 100)}%` }}
                       ></div>
                    </Progress>
                    <p className={`text-sm text-right ${charCount > CHAR_LIMIT ? "text-red-500" : ""}`}>
                       {charCount}/{CHAR_LIMIT} characters
                    </p>
                    <div className="flex items-center space-x-2">
                       <Switch
                               id="exclude-spaces"
                               checked={excludeSpacesPunctuation}
                               onCheckedChange={setExcludeSpacesPunctuation}
                       />
                       <Label htmlFor="exclude-spaces">Exclude spaces and punctuation</Label>
                    </div>
                    <Card>
                       <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                             <p className="text-lg">Word Count: <span className="font-bold">{wordCount}</span></p>
                             <p className="text-lg">Character Count: <span className="font-bold">{charCount}</span></p>
                             <p className="text-lg">Reading Time: <span className="font-bold">{readingTime} min</span></p>
                          </div>
                          <div>
                             <p className="text-lg font-bold mb-2">Top 5 Words:</p>
                             <ul className="list-disc pl-5">
                                {Object.entries(wordFrequency)
                                        .sort((a, b) => b[1] - a[1])
                                        .slice(0, 5)
                                        .map(([word, count]) => (
                                                <li key={word}>
                                                   {word}: {count}
                                                </li>
                                        ))}
                             </ul>
                          </div>
                       </CardContent>
                    </Card>
                 </CardContent>
              </Card>
           </div>
   );
};

export default WordCounter;
```

### Explanation:

- This widget is a single React functional component using hooks for efficient state management and side effects.
- Real-time text analysis updates word count, character count, and reading time as the user types or uploads a file.
- A custom progress bar provides visual feedback on character count, changing colors to indicate proximity to the limit.
- File upload and export features enhance the widget's utility for inputting and saving work.
- Word frequency analysis adds depth to the text evaluation, making it a comprehensive tool for teachers assessing essays.
- Tailwind CSS ensures responsive design, while Shadcn components maintain a consistent UI across the widget.

This plan implements a comprehensive word and character counter widget tailored for assessing student essays, featuring real-time analysis and import/export capabilities.