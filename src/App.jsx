import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import PanelInput from "./components/PanelInput/PanelInput";
import Admin from "./pages/Admin/Admin";
import Trainer from "./pages/Trainer/Trainer";
import User from "./pages/User/User";




function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <PanelInput />} />
          <Route path="/user" element={<User />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/trainer" element={ <Trainer />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
