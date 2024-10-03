import React, { useState, useEffect } from 'react';
import { Button, Input, Card, CardContent, Select, SelectItem } from "@/components/ui";
import { shuffle } from 'lodash'; // Note: Assuming lodash is available or replace with custom shuffle function

const defaultPlayers = "Alice,Bob,Charlie,David,Eve,Frank";

function App() {
    const [players, setPlayers] = useState(defaultPlayers.split(','));
    const [rules, setRules] = useState([]);
    const [teamRed, setTeamRed] = useState([]);
    const [teamBlue, setTeamBlue] = useState([]);

    useEffect(() => {
        if (players.length % 2 !== 0) {
            document.getElementById('generateButton').disabled = true;
        } else {
            document.getElementById('generateButton').disabled = false;
        }
    }, [players]);

    const handlePlayerInput = (e) => {
        setPlayers(e.target.value.split(',').map(name => name.trim()));
    };

    const addRule = (playerA, playerB, type) => {
        setRules([...rules, { playerA, playerB, type }]);
    };

    const shuffleTeams = () => {
        let shuffled = shuffle(players);
        let valid = false;

        while (!valid) {
            let tempRed = shuffled.slice(0, players.length / 2);
            let tempBlue = shuffled.slice(players.length / 2);
            valid = rules.every(rule => {
                if (rule.type === 'together') {
                    return tempRed.includes(rule.playerA) === tempRed.includes(rule.playerB);
                } else {
                    return !(tempRed.includes(rule.playerA) && tempRed.includes(rule.playerB));
                }
            });
            if (!valid) shuffled = shuffle(shuffled);
        }

        setTeamRed(shuffled.slice(0, players.length / 2));
        setTeamBlue(shuffled.slice(players.length / 2));
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Team Shuffler</h1>
            <PlayerInput onInputChange={handlePlayerInput} initialPlayers={defaultPlayers} />
            <RuleInput players={players} onAddRule={addRule} />
            <Button id="generateButton" onClick={shuffleTeams} className="my-4">Shuffle Teams</Button>
            <TeamDisplay teamRed={teamRed} teamBlue={teamBlue} />
        </div>
    );
}

function PlayerInput({ onInputChange, initialPlayers }) {
    return (
        <Card>
            <CardContent>
                <Input
                    placeholder="Enter player names separated by commas"
                    defaultValue={initialPlayers}
                    onChange={onInputChange}
                />
            </CardContent>
        </Card>
    );
}

function RuleInput({ players, onAddRule }) {
    const [playerA, setPlayerA] = useState('');
    const [playerB, setPlayerB] = useState('');
    const [type, setType] = useState('together');

    return (
        <Card className="my-4">
            <CardContent>
                <Select value={playerA} onChange={(e) => setPlayerA(e.target.value)}>
                    {players.map(player => <SelectItem key={player} value={player}>{player}</SelectItem>)}
                </Select>
                <Select value={type} onChange={(e) => setType(e.target.value)}>
                    <SelectItem value="together">Must be together</SelectItem>
                    <SelectItem value="apart">Must be apart</SelectItem>
                </Select>
                <Select value={playerB} onChange={(e) => setPlayerB(e.target.value)}>
                    {players.map(player => <SelectItem key={player} value={player}>{player}</SelectItem>)}
                </Select>
                <Button onClick={() => {onAddRule(playerA, playerB, type); setPlayerA(''); setPlayerB(''); setType('together');}}>
                    Add Rule
                </Button>
            </CardContent>
        </Card>
    );
}

function TeamDisplay({ teamRed, teamBlue }) {
    return (
        <div className="flex flex-col sm:flex-row justify-between">
            <Card className="mb-4 sm:mb-0 sm:mr-2 w-full sm:w-1/2">
                <CardContent className="bg-red-100">
                    <h2 className="text-red-600">Team Red</h2>
                    {teamRed.map(player => <p key={player} className="text-red-600">{player}</p>)}
                </CardContent>
            </Card>
            <Card className="w-full sm:w-1/2">
                <CardContent className="bg-blue-100">
                    <h2 className="text-blue-600">Team Blue</h2>
                    {teamBlue.map(player => <p key={player} className="text-blue-600">{player}</p>)}
                </CardContent>
            </Card>
        </div>
    );
}

export default App;