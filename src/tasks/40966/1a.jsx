import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PlusIcon, PencilIcon, TrashIcon, ArrowsExpandIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// CSS for star animation
const starAnimation = `
@keyframes move-twink-back {
    from {background-position:0 0;}
    to {background-position:-10000px 5000px;}
}
@-webkit-keyframes move-twink-back {
    from {background-position:0 0;}
    to {background-position:-10000px 5000px;}
}
@-moz-keyframes move-twink-back {
    from {background-position:0 0;}
    to {background-position:-10000px 5000px;}
}
@-ms-keyframes move-twink-back {
    from {background-position:0 0;}
    to {background-position:-10000px 5000px;}
}

.stars, .twinkling {
  position:absolute;
  top:0;
  left:0;
  right:0;
  bottom:0;
  width:100%;
  height:100%;
  display:block;
}

.stars {
  background:#000 url(data:image/png;base64,...) repeat top center; /* Base64 encoded star image for brevity */
  z-index:0;
}

.twinkling{
  background:transparent url(data:image/png;base64,...) repeat top center; /* Base64 encoded twinkling effect */
  z-index:1;
  -moz-animation:move-twink-back 200s linear infinite;
  -ms-animation:move-twink-back 200s linear infinite;
  -o-animation:move-twink-back 200s linear infinite;
  -webkit-animation:move-twink-back 200s linear infinite;
  animation:move-twink-back 200s linear infinite;
}
`;

const colors = [
    'bg-slate-800', 'bg-blue-800', 'bg-green-800', 'bg-red-800',
    'bg-purple-800', 'bg-orange-800', 'bg-teal-800', 'bg-indigo-800',
    'bg-cyan-800', 'bg-pink-800', 'bg-lime-800', 'bg-amber-800',
    'bg-emerald-800', 'bg-brown-800', 'bg-violet-800', 'bg-fuchsia-800'
];

function LinkTile({ link, onEdit, onDelete, onResize }) {
    const [size, setSize] = useState(link.size);

    return (
        <Card className={`flex-[0_0_${size * 33.333}%] ${link.color} m-2 relative`}>
            <CardHeader>
                <CardTitle className="text-white">{link.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="absolute bottom-2 right-2">
                    <Button variant="outline" className="text-white border-white">
                        Visit
                    </Button>
                </a>
                <Button size="icon" onClick={() => onResize(link.id)} className="absolute bottom-2 left-2">
                    <ArrowsExpandIcon />
                </Button>
                <Button size="icon" onClick={() => onEdit(link.id)} className="absolute top-2 right-2">
                    <PencilIcon />
                </Button>
                <Button size="icon" onClick={() => onDelete(link.id)} className="absolute top-2 right-10">
                    <TrashIcon />
                </Button>
            </CardContent>
        </Card>
    );
}

function AddLinkForm({ onSubmit }) {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [color, setColor] = useState(colors[0]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title.length >= 5 && url) {
            onSubmit({ title, url, color: color, size: 1 });
            setTitle('');
            setUrl('');
            setColor(colors[0]);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                minLength={5}
            />
            <Input
                type="url"
                placeholder="URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">Choose Color</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Select a color</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {colors.map(c => (
                        <DropdownMenuItem key={c} onClick={() => setColor(c)} className={`${c} text-white`}>
                            {c}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
            <Button type="submit">Add Link</Button>
        </form>
    );
}

export default function App() {
    const [links, setLinks] = useState([
        { id: 1, title: 'xAI LLM', url: 'https://x.ai', color: 'bg-slate-500', size: 2 },
        { id: 2, title: 'Turing', url: 'https://turing.com', color: 'bg-black', size: 1 },
    ]);

    const addLink = (newLink) => {
        setLinks([...links, { ...newLink, id: Date.now() }]);
    };

    const deleteLink = (id) => {
        setLinks(links.filter(link => link.id !== id));
    };

    const editLink = (id) => {
        // Placeholder for edit functionality
        console.log('Edit link with id:', id);
    };

    const resizeLink = (id) => {
        setLinks(links.map(link =>
            link.id === id ? { ...link, size: link.size >= 3 ? 1 : link.size + 1 } : link
        ));
    };

    return (
        <div className="relative h-screen">
            <style>{starAnimation}</style>
            <div className="stars"></div>
            <div className="twinkling"></div>
            <div className="container mx-auto p-4 relative z-10">
                <div className="flex justify-end mb-4">
                    <AddLinkForm onSubmit={addLink} />
                </div>
                <div className="flex flex-wrap">
                    {links.map(link => (
                        <LinkTile
                            key={link.id}
                            link={link}
                            onEdit={editLink}
                            onDelete={deleteLink}
                            onResize={resizeLink}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}