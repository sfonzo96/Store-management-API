export default class simpleUserDTO {
  constructor(user) {
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.role = user.role;
  }
}
