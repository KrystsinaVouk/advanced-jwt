import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "./index";
import './App.css';
import LoginForm from "./components/LoginForm";
import UserService from "./services/UserService";
import {IUser} from "./models/IUser";

function App() {
    const {store} = useContext(Context);
    const [users, setUsers] = useState<IUser[]>([] as IUser[])

    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }
    }, [])

    async function getUsers() {
        try {
            const response = await UserService.fetchUsers();
            setUsers(response.data as IUser[]);

        } catch (err) {
            console.log(err);
        }
    }

    if (store.isLoading) {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        );
    }

    if (!store.isAuth) {
        return (
            <div className="btn-bg">
                <LoginForm/>
            </div>
        );
    }

    return (
        <div className="btn-bg">
            <h1>{store.isAuth ? `The user has been authorized ${store.user.email}` : `Please authorize`}</h1>
            <h1>{store.user.isActivated ? `The account has been confirmed` : `Please open your gmail and confirm the account`}</h1>
            <button className={"bg-1"} onClick={() => store.logout()}>
                Log out
            </button>
            <button className={"bg-1"} onClick={getUsers}>
                Display all users
            </button>
            {users && users.map(user => <h1 key={user.userId}>{user.email}</h1>)}
        </div>
    );
}

export default observer(App);
