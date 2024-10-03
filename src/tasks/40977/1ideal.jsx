import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TeamShuffler = () => {
    const [players, setPlayers] = useState('Alice, Bob, Charlie, David, Eve, Frank');
    const [playerList, setPlayerList] = useState([]);
    const [rules, setRules] = useState([]);
    const [teams, setTeams] = useState({ red: [], blue: [] });
    const [isTeamGenerated, setIsTeamGenerated] = useState(false);

    const handleGenerateTeam = () => {
        const newPlayerList = players.split(',').map(name => name.trim()).filter(name => name);
        if (newPlayerList.length % 2 !== 0) {
            alert("The number of players must be even.");
            return;
        }
        setPlayerList(newPlayerList);
        setTeams({ red: [], blue: [] });
        setRules([]);
        setIsTeamGenerated(true);
    };

    const addRule = (type) => {
        setRules([...rules, { type, players: ['', ''] }]);
    };

    const updateRule = (index, playerIndex, value) => {
        const newRules = [...rules];
        newRules[index].players[playerIndex] = value;
        setRules(newRules);
    };

    const shuffleTeams = () => {
        let shuffled = [...playerList];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        // Apply rules
        rules.forEach(rule => {
            const [player1, player2] = rule.players;
            if (player1 && player2) {
                const index1 = shuffled.indexOf(player1);
                const index2 = shuffled.indexOf(player2);
                if (index1 !== -1 && index2 !== -1) {
                    if (rule.type === 'not-same' && Math.floor(index1 / (shuffled.length / 2)) === Math.floor(index2 / (shuffled.length / 2))) {
                        [shuffled[index1], shuffled[index2]] = [shuffled[index2], shuffled[index1]];
                    } else if (rule.type === 'same' && Math.floor(index1 / (shuffled.length / 2)) !== Math.floor(index2 / (shuffled.length / 2))) {
                        [shuffled[index1], shuffled[shuffled.length / 2 + index2 % (shuffled.length / 2)]] = [shuffled[shuffled.length / 2 + index2 % (shuffled.length / 2)], shuffled[index1]];
                    }
                }
            }
        });

        setTeams({
            red: shuffled.slice(0, shuffled.length / 2),
            blue: shuffled.slice(shuffled.length / 2)
        });
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Age of Empires Team Shuffler</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div>
                            <Label htmlFor="players" className="text-lg font-semibold">Enter player names (comma-separated)</Label>
                            <Input
                                id="players"
                                value={players}
                                onChange={(e) => setPlayers(e.target.value)}
                                placeholder="Enter player names"
                                className="mt-2"
                            />
                        </div>
                        <div className="flex justify-center">
                            <Button onClick={handleGenerateTeam} className="w-full sm:w-auto">
                                Generate Team
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {isTeamGenerated && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Players</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 space-y-1">
                                {playerList.map((player, index) => (
                                    <li key={index}>{player}</li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Team Rules</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex space-x-2">
                                    <Button onClick={() => addRule('not-same')} size="sm" variant="outline">
                                        Add "Not Same Team" Rule
                                    </Button>
                                    <Button onClick={() => addRule('same')} size="sm" variant="outline">
                                        Add "Same Team" Rule
                                    </Button>
                                </div>
                                {rules.map((rule, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <Select onValueChange={(value) => updateRule(index, 0, value)}>
                                            <SelectTrigger className="w-[130px]">
                                                <SelectValue placeholder="Player A" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {playerList.map((player) => (
                                                    <SelectItem key={player} value={player}>{player}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <span>{rule.type === 'not-same' ? 'not with' : 'with'}</span>
                                        <Select onValueChange={(value) => updateRule(index, 1, value)}>
                                            <SelectTrigger className="w-[130px]">
                                                <SelectValue placeholder="Player B" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {playerList.map((player) => (
                                                    <SelectItem key={player} value={player}>{player}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {isTeamGenerated && (
                <div className="mt-6 flex justify-center">
                    <Button onClick={shuffleTeams} className="w-full sm:w-auto">Shuffle Teams</Button>
                </div>
            )}

            {(teams.red.length > 0 || teams.blue.length > 0) && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-red-50">
                        <CardHeader>
                            <CardTitle className="text-red-600">Team Red</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 space-y-1">
                                {teams.red.map((player, index) => (
                                    <li key={index} className="text-red-800">{player}</li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="bg-blue-50">
                        <CardHeader>
                            <CardTitle className="text-blue-600">Team Blue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 space-y-1">
                                {teams.blue.map((player, index) => (
                                    <li key={index} className="text-blue-800">{player}</li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default TeamShuffler;