const mongoose = require("mongoose");

const VariantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

VariantSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.updatedAt;
    delete returnedObject.createdAt;
  },
});

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    variants: [VariantSchema],
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  },
  {
    timestamps: true,
  }
);

function prepare(dbEntry) {
  const outEntry = {};
  outEntry.id = dbEntry._id;
  outEntry.name = dbEntry.name;
  outEntry.description = dbEntry.description;
  outEntry.variants = dbEntry.variants;
  outEntry.categories = dbEntry.categories;
  if (dbEntry.image) outEntry.image = process.env.STORAGE_URL + dbEntry.image;
  outEntry.createdAt = dbEntry.createdAt;
  return outEntry;
}

function deepPrepare(dbEntry) {
  const outEntry = {};
  outEntry.id = dbEntry._id;
  outEntry.name = dbEntry.name;
  outEntry.description = dbEntry.description;
  outEntry.variants = dbEntry.variants
    ? dbEntry.variants.map((el) => {
        return { id: el._id, name: el.name, price: el.price, stock: el.stock };
      })
    : { name: "Padrão", price: 1, stock: 1 };
  outEntry.categories = dbEntry.categories
    ? dbEntry.categories.map((el) => {
        return { id: el._id, title: el.title };
      })
    : [];
  if (dbEntry.image) outEntry.image = process.env.STORAGE_URL + dbEntry.image;
  outEntry.createdAt = dbEntry.createdAt;
  return outEntry;
}

const Schema = ProductSchema;

Schema.statics.fCreate = async function (data) {
  try {
    if (!(typeof data === "object" && !Array.isArray(data) && data !== null)) {
      throw new Error("Parâmetro em formato errado.");
    }

    if (!data.name || !data.variants) {
      let err = new Error("Dados faltando no registro.");
      err.haveMsg = "true";
      throw err;
    }

    if (Array.isArray(data.variants) && data.variants.length > 0) {
      for (const el of data.variants) {
        if (!el.name || !el.price || el.stock == null) {
          let err = new Error("Dados faltando no registro.");
          err.haveMsg = "true";
          throw err;
        }
      }
    } else {
      let err = new Error("Dados faltando no registro.");
      err.haveMsg = "true";
      throw err;
    }

    let categories;
    if (Array.isArray(data.categories) && data.categories.length > 0) {
      categories = data.categories.map((entry, i) => {
        return entry.id;
      });
    } else categories = [];
    data.categories = categories;

    const entry = new this({
      name: data.name,
      description: data.description || "",
      image: data.image || undefined,
      variants: data.variants,
      categories: data.categories,
    });

    const saved = await entry.save();
    await saved.populate("categories", "-updatedAt -createdAt");
    return prepare(saved);
  } catch (err) {
    if (err.code === 11000) {
      const error = new Error("Este item já se encontra no cadastro.");
      error.haveMsg = true;
      throw error;
    } else throw err;
  }
};

Schema.statics.fUpdate = async function (id, data) {
  try {
    if (!(typeof data === "object" && !Array.isArray(data) && data !== null)) {
      throw new Error("Parâmetro em formato errado.");
    }

    if (Array.isArray(data.variants) && data.variants.length > 0) {
    } else data.variants = undefined;

    if (Array.isArray(data.categories)) {
      data.categories = data.categories.map((entry, i) => {
        return entry.id;
      });
    } else data.categories = undefined;

    const res = await this.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    ).exec();

    if (res == null) {
      const err = new Error("Não encontrado.");
      err.haveMsg = true;
      throw err;
    }

    await res.populate("categories", "-updatedAt -createdAt");
    return prepare(res);
  } catch (err) {
    if (err.code === 11000) {
      const error = new Error("Este item já se encontra no cadastro.");
      error.haveMsg = true;
      throw error;
    } else throw err;
  }
};

Schema.statics.fDelete = async function (id) {
  try {
    const res = await this.findById(id);

    if (res == null) {
      const err = new Error("Não encontrado.");
      err.haveMsg = true;
      throw err;
    }

    const res2 = await res.remove();

    await res2.populate("categories", "-updatedAt -createdAt");
    return prepare(res2);
  } catch (err) {
    throw err;
  }
};

Schema.statics.fGet = async function (id) {
  try {
    const res = await this.findById(id).exec();

    if (res == null) {
      const err = new Error("Não encontrado.");
      err.haveMsg = true;
      throw err;
    }

    await res.populate("categories", "-updatedAt -createdAt");
    return prepare(res);
  } catch (err) {
    throw err;
  }
};

Schema.statics.fGetAll = async function () {
  try {
    const all = await this.find().exec();

    const asyncRes = await Promise.all(
      all.map(async (el) => {
        await el.populate("categories", "-updatedAt -createdAt");
        return prepare(el);
      })
    );

    return asyncRes;
  } catch (err) {
    throw err;
  }
};

Schema.statics.fSearch = async function (keywords) {
  try {
    const res = await this.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "categories",
          foreignField: "_id",
          as: "categories",
        },
      },
      {
        $match: {
          $or: [
            { name: { $regex: keywords, $options: "i" } },
            { description: { $regex: keywords, $options: "i" } },
            { "categories.title": { $regex: keywords, $options: "i" } },
          ],
        },
      },
    ]);

    return res.map((el) => deepPrepare(el));
  } catch (err) {
    throw err;
  }
};

Schema.statics.fGetByCategory = async function (categoriesTitles) {
  try {
    const titlesRegexArr = categoriesTitles.map((title) => {
      return new RegExp("^" + title + "$", "i");
    });

    const res = await this.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "categories",
          foreignField: "_id",
          as: "categories",
        },
      },
      {
        $match: {
          "categories.title": { $all: titlesRegexArr },
        },
      },
    ]);

    return res.map((el) => deepPrepare(el));
  } catch (err) {
    throw err;
  }
};

Schema.statics.fGetRandom = async function (n) {
  try {
    const res = await this.aggregate([
      {
        $sample: { size: n },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categories",
          foreignField: "_id",
          as: "categories",
        },
      },
    ]);

    return res.map((el) => deepPrepare(el));
  } catch (err) {
    throw err;
  }
};

module.exports = mongoose.model("Product", ProductSchema);
