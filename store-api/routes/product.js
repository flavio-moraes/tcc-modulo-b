const router = require("express").Router();
const Product = require("../models/Product");
const { requireAdminOrManagerAuth } = require("../authCheck");
const { uploadImage, deleteImage } = require("../cloudStorage");
const multer = require("multer");
const uploader = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
});

router.post(
  "/",
  requireAdminOrManagerAuth,
  uploader.single("img"),
  (req, res, err) => {
    if (req.file && req.file.fieldname === "img") {
      uploadImage(req.file)
        .then((res2) => {
          req.body.image = res2;
          req.body.variants = JSON.parse(req.body.variants);
          req.body.categories = JSON.parse(req.body.categories);

          Product.fCreate(req.body)
            .then((response) => {
              res.status(201).json(response);
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
      req.body.variants = JSON.parse(req.body.variants);
      req.body.categories = JSON.parse(req.body.categories);

      Product.fCreate(req.body)
        .then((response) => {
          res.status(201).json(response);
        })
        .catch((error) => {
          let msg = error.haveMsg ? error.message : "Erro.";
          res.status(500).json({ msg: msg, message: error?.message });
        });
    }
  }
);

router.put(
  "/:id",
  requireAdminOrManagerAuth,
  uploader.single("img"),
  (req, res, err) => {
    if (req.file && req.file.fieldname === "img") {
      uploadImage(req.file)
        .then((res2) => {
          req.body.image = res2;
          if (req.body.variants)
            req.body.variants = JSON.parse(req.body.variants);
          if (req.body.categories)
            req.body.categories = JSON.parse(req.body.categories);

          Product.fUpdate(req.params.id, req.body)
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
      if (req.body.variants) req.body.variants = JSON.parse(req.body.variants);
      if (req.body.categories)
        req.body.categories = JSON.parse(req.body.categories);

      Product.fUpdate(req.params.id, req.body)
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

router.delete("/:id", requireAdminOrManagerAuth, (req, res) => {
  Product.fDelete(req.params.id)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      let msg = error.haveMsg ? error.message : "Erro.";
      res.status(500).json({ msg: msg, message: error?.message });
    });
});

router.get("/:id", (req, res) => {
  Product.fGet(req.params.id)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      let msg = error.haveMsg ? error.message : "Erro.";
      res.status(500).json({ msg: msg, message: error?.message });
    });
});

router.get("/", (req, res) => {
  if (req.query.search) {
    const keywords = req.query.search.toLowerCase().replace(/ /g, "|");

    Product.fSearch(keywords)
      .then((response) => {
        res.status(201).json(response);
      })
      .catch((error) => {
        let msg = error.haveMsg ? error.message : "Erro.";
        res.status(500).json({ msg: msg, message: error?.message });
      });
    return;
  }

  if (req.query.category) {
    const keywords = req.query.category.split(",");

    Product.fGetByCategory(keywords)
      .then((response) => {
        res.status(201).json(response);
      })
      .catch((error) => {
        let msg = error.haveMsg ? error.message : "Erro.";
        res.status(500).json({ msg: msg, message: error?.message });
      });
    return;
  }

  if (req.query.random) {
    const n = parseInt(req.query.random);

    Product.fGetRandom(n)
      .then((response) => {
        res.status(201).json(response);
      })
      .catch((error) => {
        let msg = error.haveMsg ? error.message : "Erro.";
        res.status(500).json({ msg: msg, message: error?.message });
      });
    return;
  }

  Product.fGetAll()
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      let msg = error.haveMsg ? error.message : "Erro.";
      res.status(500).json({ msg: msg, message: error?.message });
    });
});

module.exports = router;
