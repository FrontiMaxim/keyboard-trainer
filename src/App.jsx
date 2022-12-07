import React, {useState} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import FormConstructorExercise from "./components/FormConstructorExercise/FormConstructorExercise";
import FormLogin from "./components/FormLogin/FormLogin";
import Admin from "./pages/Admin/Admin";
import Trainer from "./pages/Trainer/Trainer";
import User from "./pages/User/User";


function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <FormLogin />} />
          <Route path="/user" element={<User />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/trainer" element={ <Trainer />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
