<<<<<<< HEAD
﻿import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.enhanced.css';
import App from './App.enhanced';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

=======
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(<App />);
>>>>>>> 44d83632939adeeb968f4198fc99fe9673e938f7
