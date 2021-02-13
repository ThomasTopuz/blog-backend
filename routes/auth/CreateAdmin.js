const {User} = require('../../models/User');
async function createUser(email) {
    const user = await User.findOne({email:email});
    user.isAdmin = true;
    await user.save();
    console.log(user);
}
createUser("thomatop@gmail.com");
