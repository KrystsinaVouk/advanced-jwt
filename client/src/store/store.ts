import {IUser} from "../models/IUser";
import {makeAutoObservable} from "mobx";
import AuthService from "../services/AuthService";
import axios from 'axios';
import {AuthResponse} from "../models/response/AuthResponse";
import {API_URL} from "../http";

export default class Store {
    user = {} as IUser;
    isAuth = false;
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    setUser(user: IUser): void {
        this.user = user;
    }

    setIsAuth(isAuth: boolean): void {
        this.isAuth = isAuth
    }

    setIsLoading(isLoading: boolean): void {
        this.isLoading = isLoading
    }

    async login(email: string, password: string) {
        try {
            const response = await AuthService.login(email, password);
            console.log(response)
            localStorage.setItem('token', response.data.accessToken);
            this.setIsAuth(true);
            this.setUser(response.data.user);
        } catch (err) {
            console.log(err);
        }
    }

    async registration(email: string, password: string) {
        try {
            const response = await AuthService.registration(email, password);
            console.log(response)
            localStorage.setItem('token', response.data.accessToken)
            this.setIsAuth(true);
            this.setUser(response.data.user);
        } catch ({message}) {
            console.log(message)
        }
    }

    async logout() {
        try {
            const response = await AuthService.logout();
            console.log(response)
            localStorage.removeItem('token')
            this.setIsAuth(false);
            this.setUser({} as IUser);
        } catch ({message}) {
            console.log(message)
        }
    }

    async checkAuth() {
        try {
            this.setIsLoading(true);
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true})
            console.log(response);
            localStorage.setItem('token', response.data.accessToken);
            this.setIsAuth(true);
            this.setUser(response.data.user);
        } catch ({message}) {
            console.log(message)
        } finally {
            this.setIsLoading(false);
        }
    }
}