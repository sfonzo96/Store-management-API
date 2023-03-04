import UserModel from '../models/users.model.js'
import cartService from './carts.db.services.js'
import bcrypt from 'bcrypt'

class UserServices {
  async createUser(user) {
    try {
      const userExists = await UserModel.findOne({ email: user.email }).lean();

      if (userExists) {
        throw new Error('User already exists')
      }

      const newCart = await cartService.createCart();

      user.password = await bcrypt.hash(user.password, 10)

      const createdUser = await UserModel.create({ ...user, cart: newCart._id });

      return createdUser
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async getUser(email) {
    try {
      const user = await UserModel.findOne({ email }).populate({
        path: 'cart',
        populate: {
          path: 'products.product'
        }
      }).lean()
      if (!user) {
        return null
      }
      return user
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async getUserById(id) {
    try {
      const user = await UserModel.findById(id).populate({
        path: 'cart',
        populate: {
          path: 'products.product'
        }
      }).lean()
      if (!user) {
        throw new Error('User not found')
      }
      return user
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

const userService = new UserServices();
export default userService;
