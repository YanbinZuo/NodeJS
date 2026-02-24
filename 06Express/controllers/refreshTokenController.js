const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  console.log("refreshToken: ", refreshToken);

  const foundUser = usersDB.users.find(
    (user) => user.refreshToken === refreshToken,
  );
  if (!foundUser) return res.sendStatus(403); // Forbidden

  // evaluate jwt
  // decoded: If valid, this is the payload inside the refresh token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    console.log("decoded: ", decoded);
    if (err || foundUser.username !== decoded.username)
      return res.sendStatus(403);
    const accessToken = jwt.sign(
      { username: decoded.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" },
    );
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
