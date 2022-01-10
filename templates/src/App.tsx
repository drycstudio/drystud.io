import React from 'react';
import { Titlebar } from '@euclidesdry/electron-pretty-titlebar';

import logo from './logo.svg';

import '@euclidesdry/electron-pretty-titlebar/dist/cjs/index.css';
import './App.css';

function App() {
    return (
        <div className="App">
            <Titlebar title="Teste" />
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
