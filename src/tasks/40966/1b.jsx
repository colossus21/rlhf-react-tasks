// App.jsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { LucideIcon, Plus, Edit, Trash2, ExternalLink, ArrowsExpand } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const colors = [
    'bg-red-700', 'bg-blue-700', 'bg-green-700', 'bg-purple-700',
    'bg-yellow-700', 'bg-indigo-700', 'bg-pink-700', 'bg-teal-700',
    'bg-cyan-700', 'bg-lime-700', 'bg-orange-700', 'bg-slate-700',
    'bg-amber-700', 'bg-emerald-700', 'bg-brown-700', 'bg-violet-700'
];

const StarBackground = () => (
    <div className="fixed inset-0 bg-black overflow-hidden">
        <div className="star absolute w-1 h-1 bg-white rounded-full opacity-75"></div>
        <style jsx>{`
      .star {
        animation: twinkle 5s infinite;
      }
      @keyframes twinkle {
        0%, 100% { opacity: 0.75; }
        50% { opacity: 0.25; }
      }
    `}</style>
    </div>
);

const Tile = ({ tile, onDelete, onEdit, onResize }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Card className={`m-2 ${tile.size === 2 ? 'w-[calc(66.66%-1rem)]' : tile.size === 3 ? 'w-[calc(100%-1rem)]' : 'w-[calc(33.33%-1rem)]'} ${tile.color}`}>
            <CardHeader onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                {isHovered && (
                    <div className="absolute top-2 right-2 flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(tile)}>
                            <Edit />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(tile.id)}>
                            <Trash2 />
                        </Button>
                    </div>
                )}
                <CardTitle className="text-white">{tile.title}</CardTitle>
            </CardHeader>
            <CardFooter className="justify-end">
                <Button asChild variant="outline" className="mr-2">
                    <a href={tile.link} target="_blank" rel="noopener noreferrer">Visit <ExternalLink className="ml-2" /></a>
                </Button>
                <Button size="icon" onClick={() => onResize(tile)}>
                    <ArrowsExpand />
                </Button>
            </CardFooter>
        </Card>
    );
};

export default function App() {
    const [tiles, setTiles] = useState([
        { id: uuidv4(), title: 'xAI LLM', link: 'https://x.ai', color: 'bg-gray-700', size: 2 },
        { id: uuidv4(), title: 'Turing', link: 'https://turing.com', color: 'bg-black', size: 1 },
    ]);
    const [form, setForm] = useState({ title: '', link: '', color: colors[0] });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (form.title.length < 5 || !/^(ftp|http|https):\/\/[^ "]+$/.test(form.link)) return;
        setTiles([...tiles, { ...form, id: uuidv4(), size: 1 }]);
        setForm({ title: '', link: '', color: colors[0] });
    };

    const handleTileAction = (action) => (tile) => {
        setTiles(currentTiles => {
            if (action === 'delete') return currentTiles.filter(t => t.id !== tile.id);
            if (action === 'edit') {
                // Here you would open an edit form with current tile details
                console.log('Edit:', tile);
            }
            if (action === 'resize') {
                const newSize = tile.size < 3 ? tile.size + 1 : 1;
                return currentTiles.map(t => t.id === tile.id ? { ...t, size: newSize } : t);
            }
            return currentTiles;
        });
    };

    return (
        <div className="min-h-screen relative">
            <StarBackground />
            <div className="p-4 max-w-7xl mx-auto">
                <Button className="mb-4" onClick={() => setForm({ ...form, showForm: true })}>
                    <Plus className="mr-2" /> Add Link
                </Button>
                {form.showForm && (
                    <form onSubmit={handleSubmit} className="mb-4 bg-white p-4 rounded shadow">
                        <Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Title (min 5 chars)" className="mb-2" />
                        <Input value={form.link} onChange={e => setForm({...form, link: e.target.value})} placeholder="Link" className="mb-2" />
                        <Select value={form.color} onValueChange={color => setForm({...form, color})}>
                            {colors.map(color => <SelectItem key={color} value={color}>{color}</SelectItem>)}
                        </Select>
                        <Button type="submit" className="mt-2">Save</Button>
                    </form>
                )}
                <div className="flex flex-wrap">
                    {tiles.map(tile => (
                        <Tile key={tile.id} tile={tile} onDelete={handleTileAction('delete')}
                              onEdit={handleTileAction('edit')} onResize={handleTileAction('resize')} />
                    ))}
                </div>
            </div>
        </div>
    );
}