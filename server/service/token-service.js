import jwt from 'jsonwebtoken'
import tokenModel from '../models/token-model'

class TokenService {
    generateToken(payload) {
        const accessToken = jwt.sign(payload, `very-access-secret`, {
            expiresIn: `30m`
        });
        const refreshToken = jwt.sign(payload, `very-refresh-secret`, {
            expiresIn: `30d`
        });

        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken){
        const tokenData = await tokenModel.findOne({user: userId});
        if(tokenData){
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
    }
}

export default new TokenService()