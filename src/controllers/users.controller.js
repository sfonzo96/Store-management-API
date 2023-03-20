export default class UserController {
    constructor({ UserService }) {
        this.service = UserService;
    }

    createUser = async (req, res) => {
        try {
            const user = await this.service.createUser(req.body);
            if (!user) {
                throw new Error('User not created');
            }
            delete user.password;
            res.status(201).redirect('/');
        } catch (error) {
            res.status(500).json({ Error: error.message });
        }
    };

    getUser = async (req, res) => {
        try {
            const { email } = req.params;

            const user = await this.service.getUser(email);

            if (!user) {
                throw new Error('User not found');
            }

            res.status(200).json({
                success: true,
                user,
            });
        } catch (error) {
            res.status(500).json({ Error: error.message });
        }
    };
}
