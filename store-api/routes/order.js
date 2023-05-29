const router = require("express").Router();
const Order = require("../models/Order");
const { requireSelfOrAdminAuth, requireAdminAuth } = require("../authCheck");

router.delete("/:id", requireAdminAuth, (req, res) => {
  Order.fDelete(req.params.id)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      let msg = error.haveMsg ? error.message : "Erro.";
      res.status(500).json({ msg: msg, message: error?.message });
    });
});

router.get("/:id", requireSelfOrAdminAuth, (req, res) => {
  Order.fGet(req.params.id)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      let msg = error.haveMsg ? error.message : "Erro.";
      res.status(500).json({ msg: msg, message: error?.message });
    });
});

router.get("/", requireAdminAuth, (req, res) => {
  Order.fGetAll()
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      let msg = error.haveMsg ? error.message : "Erro.";
      res.status(500).json({ msg: msg, message: error?.message });
    });
});

module.exports = router;
