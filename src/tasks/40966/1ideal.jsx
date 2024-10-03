import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, Edit2, ExternalLink, Maximize2 } from 'lucide-react';

const deepColors = [
    'bg-gray-700', 'bg-black', 'bg-blue-700', 'bg-indigo-700', 'bg-purple-700', 'bg-pink-700', 'bg-red-700',
    'bg-orange-700', 'bg-yellow-700', 'bg-green-700', 'bg-teal-700', 'bg-cyan-700',
    'bg-sky-700', 'bg-violet-700', 'bg-fuchsia-700', 'bg-rose-700', 'bg-amber-700', 'bg-lime-700'
];

const Tile = ({ id, title, link, color, size, onResize, onEdit, onDelete }) => {
    return (
        <div
            className={`p-4 rounded-lg ${color} text-white transition-all duration-300 ease-in-out relative group`}
            style={{ gridColumn: `span ${size}` }}
        >
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            <div className="flex justify-between items-center">
                <button
                    onClick={() => onResize(id)}
                    className="bg-white text-black p-1 rounded hover:bg-gray-200 transition-colors"
                    title="Resize"
                >
                    <Maximize2 className="w-4 h-4" />
                </button>
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center text-white hover:underline"
                >
                    Visit <ExternalLink className="ml-1 w-4 h-4" />
                </a>
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEdit(id)} className="mr-2 text-white hover:text-gray-300">
                    <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(id)} className="text-white hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

const LinkForm = ({ onSubmit, onClose, initialData = {} }) => {
    const [title, setTitle] = useState(initialData.title || '');
    const [link, setLink] = useState(initialData.link || '');
    const [color, setColor] = useState(initialData.color || deepColors[0]);
    const [errors, setErrors] = useState({});

    const validateLink = (url) => {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (title.length < 5) {
            newErrors.title = "Title must be at least 5 characters long";
        }

        if (!validateLink(link)) {
            newErrors.link = "Please enter a valid URL";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit({ id: initialData.id, title, link, color, size: initialData.size || 1 });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && <AlertDescription className="text-red-500 text-sm mt-1">{errors.title}</AlertDescription>}
            </div>
            <div>
                <Input
                    placeholder="Link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className={errors.link ? "border-red-500" : ""}
                />
                {errors.link && <AlertDescription className="text-red-500 text-sm mt-1">{errors.link}</AlertDescription>}
            </div>
            <Select onValueChange={setColor} defaultValue={color}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent>
                    {deepColors.map((c) => (
                        <SelectItem key={c} value={c}>
                            <div className={`w-4 h-4 rounded-full ${c} inline-block mr-2`}></div>
                            {c.split('-')[1]}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button type="submit">{initialData.id ? 'Update' : 'Add'} Link</Button>
        </form>
    );
};

const Star = ({ style }) => (
    <div
        className="star"
        style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            backgroundColor: 'white',
            borderRadius: '50%',
            ...style,
        }}
    />
);

const StarBackground = () => {
    const [stars, setStars] = useState([]);

    useEffect(() => {
        const newStars = Array.from({ length: 100 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 3 + 2}s`,
            animationDelay: `${Math.random() * 2}s`,
        }));
        setStars(newStars);
    }, []);

    return (
        <div>
            {stars.map((star) => (
                <Star key={star.id} style={star} />
            ))}
        </div>
    );
};

const MyHomepage = () => {
    const [links, setLinks] = useState([
        { id: 1, title: "xAI LLM", link: "https://x.ai", color: "bg-gray-700", size: 2 },
        { id: 2, title: "Turing", link: "https://turing.com", color: "bg-black", size: 1 }
    ]);
    const [isAddingLink, setIsAddingLink] = useState(false);
    const [editingLink, setEditingLink] = useState(null);

    const addLink = (newLink) => {
        setLinks([...links, { ...newLink, id: Date.now() }]);
    };

    const updateLink = (updatedLink) => {
        setLinks(links.map(link => link.id === updatedLink.id ? { ...link, ...updatedLink } : link));
        setEditingLink(null);
    };

    const deleteLink = (id) => {
        setLinks(links.filter(link => link.id !== id));
    };

    const handleResize = (id) => {
        setLinks(links.map(link =>
            link.id === id ? { ...link, size: (link.size % 3) + 1 } : link
        ));
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <StarBackground />
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">My Homepage</h1>
                    <Dialog open={isAddingLink} onOpenChange={setIsAddingLink}>
                        <DialogTrigger asChild>
                            <Button>Add Link</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Link</DialogTitle>
                            </DialogHeader>
                            <LinkForm onSubmit={addLink} onClose={() => setIsAddingLink(false)} />
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    {links.map((link) => (
                        <Tile
                            key={link.id}
                            {...link}
                            onResize={handleResize}
                            onEdit={() => setEditingLink(link)}
                            onDelete={deleteLink}
                        />
                    ))}
                </div>
            </div>
            {editingLink && (
                <Dialog open={!!editingLink} onOpenChange={() => setEditingLink(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Link</DialogTitle>
                        </DialogHeader>
                        <LinkForm
                            initialData={editingLink}
                            onSubmit={updateLink}
                            onClose={() => setEditingLink(null)}
                        />
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

const globalStyles = `
  @keyframes twinkle {
    0%, 100% { opacity: 0; }
    50% { opacity: 1; }
  }
  
  .star {
    animation: twinkle linear infinite;
  }
`;

const App = () => (
    <>
        <style>{globalStyles}</style>
        <MyHomepage />
    </>
);

export default App;