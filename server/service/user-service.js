import bcrypt from "bcrypt";
import {v4 as uuidv4} from 'uuid';
import UserModel from '../models/user-model.js'
import mailService from './mail-service.js'
import tokenService from './token-service.js'
import UserDto from "../dtos/user-dto.js";
import ApiError from "../exceptions/api-error.js";

class UserService {
    async registration(email, password) {
        console.log(email, password)
        const candidate = await UserModel.findOne({email});
        if (candidate) {
            throw ApiError.BadRequest('The user with this email has already been registered')
        }

        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuidv4();
        const user = await UserModel.create({email, password: hashPassword, activationLink})

        console.log(`sending mail... ${user}${activationLink}`)

        //await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)
        const userDto = new UserDto(user);
        const tokens = tokenService.generateToken({...userDto});
        await tokenService.saveToken(userDto.userId, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        }
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink})
        if (!user) {
            throw ApiError.BadRequest('Wrong activation link')
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        const user = await UserModel.findOne({email})
        if (!user) {
            throw ApiError.BadRequest('The user with this username has not been found');
        }

        const arePasswordsEqual = await bcrypt.compare(password, user.password);
        if (!arePasswordsEqual) {
            throw ApiError.BadRequest('Wrong password');
        }

        const userDto = new UserDto(user);
        const tokens = tokenService.generateToken({...userDto});
        await tokenService.saveToken(userDto.userId, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);

        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }

        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateToken({...userDto});

        await tokenService.saveToken(userDto.userId, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async getAllUsers() {
        const users = await UserModel.find();
        console.log('users:', users);
        return users;
    }
}

export default new UserService();