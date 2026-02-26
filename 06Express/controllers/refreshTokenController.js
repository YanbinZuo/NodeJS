// const usersDB = {
//   users: require("../model/users.json"),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };
const User = require("../model/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  console.log("refreshToken: ", refreshToken);

  // const foundUser = usersDB.users.find(
  //   (user) => user.refreshToken === refreshToken,
  // );
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403); // Forbidden

  // evaluate jwt
  // decoded: If valid, this is the payload inside the refresh token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    console.log("decoded: ", decoded);
    if (err || foundUser.username !== decoded.username)
      return res.sendStatus(403);
    const rolesKeys = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      {
        userInfo: {
          username: decoded.username,
          roles: rolesKeys,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" },
    );
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
