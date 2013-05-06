/**
 * 用户model
 * @param user
 * @constructor
 */
function User(user) {
    this.name = user.name;
    this.erpId = user.erpId;
    this.role = user.role; //  [] user, candidate, admin
};

module.exports = User;