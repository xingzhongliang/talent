/*
 * login page.
 */
 function login (req, res) {
    res.render('login', { title: 'login' });
};
module.exports = login;