import React, { useState, useEffect } from 'react';
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export default function App() {
    const [players, setPlayers] = useState('Alice,Bob,Charlie,Dave,Eve,Frank');
    const [teams, setTeams] = useState({ red: [], blue: [] });
    const [rules, setRules] = useState([]);
    const [selectedRule, setSelectedRule] = useState({ type: 'together', playerA: '', playerB: '' });

    const handleInputChange = (e) => {
        setPlayers(e.target.value);
    };

    const canGenerateTeams = () => {
        const playerList = players.split(',').map(p => p.trim()).filter(p => p);
        return playerList.length % 2 === 0;
    };

    const generateTeams = () => {
        if (!canGenerateTeams()) return;
        let shuffledPlayers = [...players.split(',').map(p => p.trim())].sort(() => 0.5 - Math.random());
        let newTeams = { red: [], blue: [] };

        // Apply rules
        rules.forEach(rule => {
            const { playerA, playerB } = rule;
            if (rule.type === 'together') {
                if (!newTeams.red.includes(playerA) && !newTeams.blue.includes(playerA)) {
                    newTeams.red.push(playerA, playerB);
                    shuffledPlayers = shuffledPlayers.filter(p => p !== playerA && p !== playerB);
                }
            } else {
                if (!newTeams.red.includes(playerA) && !newTeams.blue.includes(playerA)) {
                    newTeams.red.push(playerA);
                    newTeams.blue.push(playerB);
                    shuffledPlayers = shuffledPlayers.filter(p => p !== playerA && p !== playerB);
                }
            }
        });

        // Distribute remaining players
        while (shuffledPlayers.length) {
            newTeams.red.push(shuffledPlayers.pop());
            if (shuffledPlayers.length) newTeams.blue.push(shuffledPlayers.pop());
        }

        setTeams(newTeams);
    };

    const addRule = () => {
        if (selectedRule.playerA && selectedRule.playerB && selectedRule.playerA !== selectedRule.playerB) {
            setRules([...rules, selectedRule]);
            setSelectedRule({ type: 'together', playerA: '', playerB: '' });
        }
    };

    const playerOptions = players.split(',').map(p => p.trim()).filter(p => p);

    return (
        <div className="p-4 sm:p-8 space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Team Shuffler</CardTitle>
                </CardHeader>
                <CardContent>
                    <Input
                        label="Enter player names (comma separated)"
                        value={players}
                        onChange={handleInputChange}
                        placeholder="Alice,Bob,Charlie,Dave,Eve,Frank"
                    />
                    <Button disabled={!canGenerateTeams()} onClick={generateTeams} className="mt-4">
                        Generate Teams
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Set Rules</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-2">
                    <select
                        value={selectedRule.type}
                        onChange={(e) => setSelectedRule({...selectedRule, type: e.target.value})}
                        className="border p-2 rounded"
                    >
                        <option value="together">Must be together</option>
                        <option value="apart">Must not be together</option>
                    </select>
                    <select
                        value={selectedRule.playerA}
                        onChange={(e) => setSelectedRule({...selectedRule, playerA: e.target.value})}
                        className="border p-2 rounded"
                    >
                        <option value="">Select Player A</option>
                        {playerOptions.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <select
                        value={selectedRule.playerB}
                        onChange={(e) => setSelectedRule({...selectedRule, playerB: e.target.value})}
                        className="border p-2 rounded"
                    >
                        <option value="">Select Player B</option>
                        {playerOptions.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <Button onClick={addRule}>Add Rule</Button>
                </CardContent>
            </Card>

            {rules.length > 0 &&
                <Card>
                    <CardContent>
                        <ul>
                            {rules.map((rule, idx) => (
                                <li key={idx}>{`${rule.playerA} and ${rule.playerB} ${rule.type === 'together' ? 'must be' : 'must not be'} together`}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            }

            {teams.red.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Teams</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row justify-between">
                        <div className="text-red-600 bg-red-100 p-2 rounded">
                            <h3 className="font-bold">Red Team</h3>
                            <ul>{teams.red.map(p => <li key={p}>{p}</li>)}</ul>
                        </div>
                        <div className="text-blue-600 bg-blue-100 p-2 rounded mt-4 sm:mt-0">
                            <h3 className="font-bold">Blue Team</h3>
                            <ul>{teams.blue.map(p => <li key={p}>{p}</li>)}</ul>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}