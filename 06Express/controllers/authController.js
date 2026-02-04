const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
require("dotenv").config();
const fsPromises = require("fs").promises;
const path = require("path");

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
    // create JWTs
    const accessToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" },
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" },
    );
    // Saving refreshToken with current user
    // doing this will allow us to invalidate that refreshToken as the current
    // user logs out before their one day has expired
    const otherUsers = usersDB.users.filter(
      (person) => person.username !== foundUser.username,
    );
    const currentUser = { ...foundUser, refreshToken };
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users, null, 2),
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { handleLogin };
