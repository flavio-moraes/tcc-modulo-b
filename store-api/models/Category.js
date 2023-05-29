const mongoose = require("mongoose");
const Product = require("./Product");

const CategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

CategorySchema.pre("remove", function (next) {
  Product.updateMany(
    { categories: this },
    { $pull: { categories: this._id } },
    { multi: true }
  ).exec(next);
});

CategorySchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

function prepare(dbEntry) {
  const outEntry = {};
  outEntry.id = dbEntry._id;
  outEntry.title = dbEntry.title;
  return outEntry;
}

CategorySchema.statics.fCreate = async function (data) {
  try {
    if (!(typeof data === "object" && !Array.isArray(data) && data !== null)) {
      let err = new Error("Parâmetro em formato errado.");
      err.haveMsg = "true";
      throw err;
    }

    if (!data.title) {
      let err = new Error("Dados faltando no registro.");
      err.haveMsg = "true";
      throw err;
    }

    const entry = new this({
      title: data.title,
    });

    const saved = await entry.save();
    return prepare(saved);
  } catch (err) {
    if (err.code === 11000) {
      const error = new Error("Este item já se encontra no cadastro.");
      error.haveMsg = true;
      throw error;
    } else throw err;
  }
};

CategorySchema.statics.fUpdate = async function (id, data) {
  try {
    if (!(typeof data === "object" && !Array.isArray(data) && data !== null)) {
      let err = new Error("Parâmetro em formato errado.");
      err.haveMsg = "true";
      throw err;
    }

    if (!data.title) {
      const err = new Error("Dados faltando no registro.");
      err.haveMsg = true;
      throw err;
    }

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

    return prepare(res);
  } catch (err) {
    throw err;
  }
};

CategorySchema.statics.fDelete = async function (id) {
  try {
    const res = await this.findById(id);

    if (res == null) {
      const err = new Error("Não encontrado.");
      err.haveMsg = true;
      throw err;
    }

    const res2 = await res.remove();

    return prepare(res2);
  } catch (err) {
    throw err;
  }
};

CategorySchema.statics.fGet = async function (id) {
  try {
    const res = await this.findById(id).exec();

    if (res == null) {
      const err = new Error("Não encontrado.");
      err.haveMsg = true;
      throw err;
    }

    return prepare(res);
  } catch (err) {
    throw err;
  }
};

CategorySchema.statics.fGetAll = async function () {
  try {
    const all = await this.find().exec();
    return all.map((el) => prepare(el));
  } catch (err) {
    throw err;
  }
};

module.exports = mongoose.model("Category", CategorySchema);
