const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).json({ msg: "Você não está autenticado!" });
  }
};

const requireClientAuth = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "client") {
    return next();
  } else {
    return res
      .status(403)
      .json({ msg: "Você não possui permissão para isto!" });
  }
};

const requireSelfOrAdminAuth = (req, res, next) => {
  if (
    req.isAuthenticated() &&
    (req.user.id === req.params.id || req.user.role === "admin")
  ) {
    return next();
  } else {
    return res
      .status(403)
      .json({ msg: "Você não possui permissão para isto!" });
  }
};

const requireAdminOrManagerAuth = (req, res, next) => {
  if (
    req.isAuthenticated() &&
    (req.user.role === "admin" || req.user.role === "manager")
  ) {
    return next();
  } else {
    return res
      .status(403)
      .json({ msg: "Você não possui permissão para isto!" });
  }
};

const requireAdminAuth = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  } else {
    return res
      .status(403)
      .json({ msg: "Você não possui permissão para isto!" });
  }
};

module.exports = {
  requireAuth,
  requireClientAuth,
  requireSelfOrAdminAuth,
  requireAdminAuth,
  requireAdminOrManagerAuth,
};
