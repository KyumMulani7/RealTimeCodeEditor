import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import EditorRoomPages from "./Pages/EditorRoomPages";
import { Toaster } from "react-hot-toast";
import LivecodeState from "./Context/livecode/LivecodeState";
function App() {
  return (
    <>
      <div>
        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              theme: {
                primary: "#4aed88",
              },
            },
          }}></Toaster>
      </div>
      <LivecodeState>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Editor/:roomId" element={<EditorRoomPages />} />
          </Routes>
        </BrowserRouter>
      </LivecodeState>
    </>
  );
}

export default App;
