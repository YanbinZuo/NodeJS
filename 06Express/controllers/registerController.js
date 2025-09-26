const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: `Username and password are required.` });
  }

  // check for duplicate username in the db
  const duplicate = usersDB.users.find((user) => user.username === username);
  if (duplicate) {
    return res.sendStatus(409); // Conflict
  }

  try {
    // encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);
    // store the new user
    const newUser = {
      username: username,
      password: hashedPwd,
    };
    usersDB.setUsers([...usersDB.users, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users, null, 2)
    );
    console.log(usersDB.users);
    res.status(201).json({ success: `New user ${username} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
