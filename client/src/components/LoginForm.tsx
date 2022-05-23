import React, {FC, useContext, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const LoginForm: FC = () => {
    const {store} = useContext(Context);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');

    return (
        <div>
            <input
                onChange={(e) => setEmail(e.target.value)}
                placeholder={`Email`}
                value={email}
                type={`text`}
            />
            <input
                onChange={(e) => setPassword(e.target.value)}
                placeholder={`Password`}
                value={password}
                type={`password`}
            />
            <button
                onClick={() => store.login(email, password)}
            >Login
            </button>
            <button
                onClick={() => store.registration(email, password)}
            >Register
            </button>
        </div>
    );
};

export default observer(LoginForm);