const router = require("express").Router();
const User = require("../models/User");
const { requireAdminAuth, requireSelfOrAdminAuth } = require("../authCheck");
const { uploadImage, deleteImage } = require("../cloudStorage");
const multer = require("multer");
const uploader = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
});

router.post("/", requireAdminAuth, uploader.single("img"), (req, res, err) => {
  if (req.file && req.file.fieldname === "img") {
    uploadImage(req.file)
      .then((res2) => {
        req.body.image = res2;
        User.fCreate(req.body)
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((error) => {
            deleteImage(req.body.image)
              .then((res3) => {})
              .catch((err3) => {});
            let msg = error.haveMsg ? error.message : "Erro.";
            res.status(500).json({ msg: msg, message: error?.message });
          });
      })
      .catch((err2) => {
        let msg = err2.haveMsg ? err2.message : "Erro.";
        res.status(500).json({ msg: msg, message: err2?.message });
      });
  } else {
    User.fCreate(req.body)
      .then((user) => {
        res.status(201).json(user);
      })
      .catch((error) => {
        let msg = error.haveMsg ? error.message : "Erro.";
        res.status(500).json({ msg: msg, message: error?.message });
      });
  }
});

router.put("/cart/:id?", (req, res) => {
  let id;
  if (req.params.id && req.isAuthenticated() && req.user.role === "admin") {
    id = req.params.id;
  } else if (req.isAuthenticated()) {
    id = req.user.id;
  } else {
    return res
      .status(401)
      .json({ msg: "Carrinho não salvo, requer autenticação." });
  }
  User.fCartUpdate(id, req.body)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      let msg = error.haveMsg ? error.message : "Erro.";
      res.status(500).json({ msg: msg, message: error?.message });
    });
});

router.put(
  "/:id",
  requireSelfOrAdminAuth,
  uploader.single("img"),
  (req, res, err) => {
    const lite = req.user.id === req.params.id;
    if (req.body.address) req.body.address = JSON.parse(req.body.address);
    if (req.file && req.file.fieldname === "img") {
      uploadImage(req.file)
        .then((res2) => {
          req.body.image = res2;
          User.fUpdate(req.params.id, req.body, lite)
            .then((response) => {
              if (req.body?.removeimg)
                deleteImage(req.body.removeimg)
                  .then((res3) => {})
                  .catch((err3) => {});
              res.status(201).json(response);
            })
            .catch((error) => {
              deleteImage(res2)
                .then((res3) => {})
                .catch((err3) => {});
              let msg = error.haveMsg ? error.message : "Erro.";
              res.status(500).json({ msg: msg, message: error?.message });
            });
        })
        .catch((err2) => {
          let msg = err2.haveMsg ? err2.message : "Erro.";
          res.status(500).json({ msg: msg, message: err2?.message });
        });
    } else {
      User.fUpdate(req.params.id, req.body, lite)
        .then((response) => {
          if (req.body?.removeimg)
            deleteImage(req.body.removeimg)
              .then((res3) => {})
              .catch((err3) => {});
          res.status(201).json(response);
        })
        .catch((error) => {
          let msg = error.haveMsg ? error.message : "Erro.";
          res.status(500).json({ msg: msg, message: error?.message });
        });
    }
  }
);

router.delete("/:id", requireAdminAuth, (req, res) => {
  User.fDelete(req.params.id)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      let msg = error.haveMsg ? error.message : "Erro.";
      res.status(500).json({ msg: msg, message: error?.message });
    });
});

router.get("/:id", requireSelfOrAdminAuth, (req, res) => {
  User.fGet(req.params.id)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      let msg = error.haveMsg ? error.message : "Erro.";
      res.status(500).json({ msg: msg, message: error?.message });
    });
});

router.get("/", requireAdminAuth, (req, res) => {
  User.fGetAll()
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      let msg = error.haveMsg ? error.message : "Erro.";
      res.status(500).json({ msg: msg, message: error?.message });
    });
});

router.post("/:id/favorites/:pid", requireSelfOrAdminAuth, (req, res) => {
  User.fAddFavorite(req.params.id, req.params.pid)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      let msg = error.haveMsg ? error.message : "Erro.";
      res.status(500).json({ msg: msg, message: error?.message });
    });
});

router.delete("/:id/favorites/:pid", requireSelfOrAdminAuth, (req, res) => {
  User.fRemoveFavorite(req.params.id, req.params.pid)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      let msg = error.haveMsg ? error.message : "Erro.";
      res.status(500).json({ msg: msg, message: error?.message });
    });
});

module.exports = router;
