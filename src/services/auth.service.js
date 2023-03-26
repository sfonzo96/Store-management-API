import bcrypt from 'bcrypt';
import UserDTO from '../dto/userDTO.js';
import CustomError from '../utils/CustomError.js';

export default class AuthService {
    constructor({ UserService }) {
        this.userService = UserService;
    }

    login = async (email, password) => {
        try {
            const user = await this.userService.getUser(email);

            if (!user) {
                throw new CustomError('NOT_FOUND', 'User not found');
            }

            const passwordIsValid = await bcrypt.compare(
                password,
                user.password
            );

            if (!passwordIsValid) {
                throw new CustomError('INVALID_CREDENTIALS', 'Wrong password');
            }

            return new UserDTO(user);
        } catch (error) {
            next(error);
        }
    };
}
