//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
//import './App.css'

//function App() {
//  const [count, setCount] = useState(0)

//  return (
//    <>
//      <div>
//        <a href="https://vite.dev" target="_blank">
//          <img src={viteLogo} className="logo" alt="Vite logo" />
//        </a>
//        <a href="https://react.dev" target="_blank">
//          <img src={reactLogo} className="logo react" alt="React logo" />
//        </a>
//      </div>
//      <h1>Vitebb + React</h1>
//      <div className="card">
//        <button onClick={() => setCount((count) => count + 1)}>
//          count is {count}
//        </button>
//        <p>
//          Editsss <code>src/App.tsx</code> and save hello to test HMR
//        </p>
//      </div>
//      <p className="read-the-docs">
//        Click on the Vite and React logos to learn more
//      </p>
//    </>
//  )
//}

//export default App

import "bootstrap/dist/css/bootstrap-reboot.min.css";
import "bootstrap/dist/css/bootstrap-utilities.min.css";
import { Route, Routes } from "react-router";
import { DefaultLayout } from "./layout/DefaultLayout";
import { HomePage } from "./pages/HomePage";
import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { useAppSelector } from "./app/hooks";
import { selectAuth } from "./app/store";
import { UserLayout } from "./layout/UserLayout";
import { Spin } from "antd";
import UsersList from "./pages/UsersList";
import EditProfile from "./pages/EditProfile";
export const App = () => {
    const auth = useAppSelector(selectAuth);
    if (!auth.user) {
        return (
            <Spin spinning={auth.status == "loading"}>
                <Routes>
                    <Route path="/" element={<DefaultLayout />}>
                        <Route index element={<HomePage />} />
                        <Route path="register" element={<RegisterPage />} />
                        <Route path="login" element={<LoginPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Route>
                </Routes>
            </Spin>
        );
    } else {
        return (
            <>
                <Spin spinning={auth.status == "loading"}>
                    <Routes>
                        <Route path="/" element={<UserLayout {...auth.user} />}>
                            <Route index element={<HomePage />} />
                            <Route path="/users" element={<UsersList />} />
                            <Route path="/edit-profile" element={<EditProfile />} />
                            <Route path="*" element={<NotFoundPage />} />
                        </Route>
                    </Routes>
                </Spin>
            </>
        );
    }
};

export default App;
