import bcrypt from 'bcrypt';
import UserDTO from '../dto/userDTO.js';

export default class UserService {
    constructor({ UserRepository, CartRepository }) {
        this.userDao = UserRepository;
        this.cartDao = CartRepository;
    }

    createUser = async (user) => {
        try {
            const userExists = await this.userDao.getOne({
                email: user.email,
            });

            if (userExists) {
                throw new Error('User already exists');
            }

            const newCart = await this.cartDao.create();

            user.password = await bcrypt.hash(user.password, 10);

            const createdUser = await this.userDao.create({
                ...user,
                cart: newCart._id,
            });

            return new UserDTO(createdUser);
        } catch (error) {
            throw new Error(error.message);
        }
    };

    // TODO: combine with getUserById. Inconvenient with destructuring in the criteria (email is ok, id is not since it's _id in db) (needs aditional logic to make it propper)
    getUser = async (email) => {
        try {
            const user = await this.userDao.getOne({ email });

            if (!user) {
                console.log('User not found');
                //TODO: error handling
            }

            return user; // sends plain user in order to compare password in AuthService
        } catch (error) {
            throw new Error(error.message);
        }
    };

    getUserById = async (id) => {
        try {
            const user = await this.userDao.getById(id);

            if (!user) {
                throw new Error('User not found');
            }

            return new UserDTO(user);
        } catch (error) {
            throw new Error(error.message);
        }
    };
}
