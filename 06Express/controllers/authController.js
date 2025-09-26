const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const bcrypt = require("bcrypt");

const handleLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required!" });
    }
    const foundUser = usersDB.users.find((user) => user.username === username);
    if (!foundUser) return res.sendStatus(401); //Unauthorized
    // evaluate password
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
      return res.sendStatus(401);
    }
    // TODO: create JWTs
    res.json({ success: `User ${username} is logged in` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { handleLogin };
