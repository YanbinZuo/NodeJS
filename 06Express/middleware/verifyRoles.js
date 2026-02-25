const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) return res.sendStatus(401);
    // Check does the user have at least one role that is allowed?
    const hasPermission = req.roles.some((role) => allowedRoles.includes(role));
    if (!hasPermission) return res.sendStatus(401);

    next();
  };
};

module.exports = verifyRoles;
