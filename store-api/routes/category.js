const router = require("express").Router();
const Category = require("../models/Category");
const { requireAdminOrManagerAuth } = require("../authCheck");

router.post("/", requireAdminOrManagerAuth, (req, res, err) => {
  Category.fCreate(req.body)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      let msg = error.haveMsg ? error.message : "Erro.";
      res.status(500).json({ msg: msg, message: error?.message });
    });
});

router.put("/:id", requireAdminOrManagerAuth, (req, res) => {
  Category.fUpdate(req.params.id, req.body)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      let msg = error.haveMsg ? error.message : "Erro.";
      res.status(500).json({ msg: msg, message: error?.message });
    });
});

router.delete("/:id", requireAdminOrManagerAuth, (req, res) => {
  Category.fDelete(req.params.id)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      let msg = error.haveMsg ? error.message : "Erro.";
      res.status(500).json({ msg: msg, message: error?.message });
    });
});

router.get("/:id", (req, res) => {
  Category.fGet(req.params.id)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      let msg = error.haveMsg ? error.message : "Erro.";
      res.status(500).json({ msg: msg, message: error?.message });
    });
});

router.get("/", (req, res) => {
  Category.fGetAll()
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      let msg = error.haveMsg ? error.message : "Erro.";
      res.status(500).json({ msg: msg, message: error?.message });
    });
});

module.exports = router;
