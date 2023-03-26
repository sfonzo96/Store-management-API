import CustomError from '../utils/CustomError.js';

export default class UserController {
    constructor({ UserService }) {
        this.service = UserService;
    }

    createUser = async (req, res, next) => {
        try {
            const user = await this.service.createUser(req.body);
            if (!user) {
                throw new CustomError('SERVER_ERROR', 'Error creating user');
            }
            delete user.password;
            res.status(201).redirect('/');
        } catch (error) {
            next(error);
        }
    };

    getUser = async (req, res, next) => {
        try {
            const { email } = req.params;

            const user = await this.service.getUser(email);

            if (!user) {
                throw new CustomError('NOT_FOUND', 'User not found');
            }

            res.status(200).json({
                success: true,
                user,
            });
        } catch (error) {
            next(error);
        }
    };
}
