import userService from './users.db.services.js';
import bcrypt from 'bcrypt';

class AuthServices {
    async login(email, password) {
        try {
            const user = await userService.getUser(email);

            if (!user) {
                throw new Error('User not found');
            }

            const passwordIsValid = await bcrypt.compare(
                password,
                user.password
            );

            if (!passwordIsValid) {
                throw new Error('Wrong password');
            }

            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

const authServices = new AuthServices();
export default authServices;
