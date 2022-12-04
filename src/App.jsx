import React, {useState} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import FormConstructorExercise from "./components/FormConstructorExercise/FormConstructorExercise";
import PanelInput from "./components/PanelInput/PanelInput";
import Admin from "./pages/Admin/Admin";
import Trainer from "./pages/Trainer/Trainer";
import User from "./pages/User/User";


function App() {

  const [isOpenModalWindow, setIsOpenModalWindow] = useState(false);

  function closeModalWindow(event) {
    setIsOpenModalWindow(false);
}

  return (
    <div className="App">
      <FormConstructorExercise closeModalWindow={closeModalWindow} nameForm='Создать' nameBtn='Сохранить'/>
      {/* <BrowserRouter>
        <Routes>
          <Route path="/" element={ <PanelInput />} />
          <Route path="/user" element={<User />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/trainer" element={ <Trainer />} />
        </Routes>
      </BrowserRouter> */}
    </div>
  );
}

export default App;
