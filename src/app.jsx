import React from "react";
import { Routes, Route } from "react-router-dom";
import SilentExit from "./components/SilentExit";
import Settings from "./components/Settings";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<SilentExit />} />
    </Routes>
  );
};

export default App;