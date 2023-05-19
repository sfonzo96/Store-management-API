export default class fullUserDTO {
  constructor(user) {
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.age = user.age;
    this.role = user.role;
    this.id = user._id || user.id;
    this.cart = user.cart;
    this.documents = user.documents;
    this.lastConnection = user.lastConnection;
  }
}
