import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import User from "./User";
import Item from "./Item";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />}>
        {/* Child routes render inside Home.jsx's <Outlet /> */}
        <Route path="user" element={<User />} />

        {/* Update this line to use the imported Item component */}
        <Route path="item" element={<Item />} />
      </Route>
    </Routes>
  );
}
