import UserModel from '../models/user-model'
import bcrypt from "bcrypt";
import mailService from './mail-service'
import tokenService from './token-service'
import UserDto from "../dtos/user-dto";


class UserService {
    async registration(email, password){
        const candidate = await UserModel.findOne({email});
        if(candidate){
            throw new Error(`The user with this email has already been registered`)
        }

        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();
        const user = await UserModel.create({email, hashPassword, activationLink});

        await mailService.sendActivationMail(email, activationLink)
        const userDto = new UserDto(user);
        const tokens = tokenService.generateToken({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        }
    }
}

export default new UserService();