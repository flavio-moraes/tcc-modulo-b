const mongoose = require("mongoose");
const CryptoJS = require("crypto-js");

const UserSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "client" },
    image: { type: String },
    favorites: [{ type: String }],
    cart: { type: Object },
    address: { type: Object },
  },
  {
    timestamps: true,
  }
);

function prepare(dbUser) {
  const user = {};
  user.id = dbUser._id;
  user.firstname = dbUser.firstname;
  user.lastname = dbUser.lastname;
  user.email = dbUser.email;
  user.role = dbUser.role;
  user.favorites = dbUser.favorites;
  user.address = dbUser.address;
  if (dbUser.image) user.image = process.env.STORAGE_URL + dbUser.image;
  return user;
}

UserSchema.statics.fCreate = async function (userData) {
  try {
    if (
      !(
        typeof userData === "object" &&
        !Array.isArray(userData) &&
        userData !== null
      )
    ) {
      let err = new Error("Parâmetro em formato errado.");
      err.haveMsg = "true";
      throw err;
    }

    const { firstname, lastname, email, password } = userData;
    if (!firstname || !lastname || !email || !password) {
      let err = new Error("Dados faltando no registro.");
      err.haveMsg = "true";
      throw err;
    }

    userData.role = userData.role ? userData.role : "client";

    const newUser = new this({
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: CryptoJS.AES.encrypt(password, process.env.PASS_SEC).toString(),
      role: userData.role,
      favorites: [],
      address: userData.address || {},
    });
    if (userData.image) newUser.image = userData.image;

    const savedUser = await newUser.save();
    return prepare(savedUser);
  } catch (err) {
    if (err.code === 11000) {
      const error = new Error("Este item já se encontra no cadastro.");
      error.haveMsg = true;
      throw error;
    } else throw err;
  }
};

UserSchema.statics.fUpdate = async function (id, data, lite) {
  try {
    if (!(typeof data === "object" && !Array.isArray(data) && data !== null)) {
      let err = new Error("Parâmetro em formato errado.");
      err.haveMsg = "true";
      throw err;
    }

    if (data.password)
      data.password = CryptoJS.AES.encrypt(
        data.password,
        process.env.PASS_SEC
      ).toString();
    let fieldsToRemove = data.removeimg && !data.image ? { image: 1 } : {};

    if (lite) {
      delete data.role;
      delete data.favorites;
    }

    const res = await this.findByIdAndUpdate(
      id,
      { $set: data, $unset: fieldsToRemove },
      { new: true }
    ).exec();

    if (res == null) {
      const err = new Error("Não encontrado.");
      err.haveMsg = true;
      throw err;
    }

    return prepare(res);
  } catch (err) {
    if (err.code === 11000) {
      const error = new Error("Este item já se encontra no cadastro.");
      error.haveMsg = true;
      throw error;
    } else throw err;
  }
};

UserSchema.statics.fCartUpdate = async function (id, data) {
  try {
    if (!(typeof data === "object" && !Array.isArray(data) && data !== null)) {
      let err = new Error("Parâmetro em formato errado.");
      err.haveMsg = "true";
      throw err;
    }

    const user = await this.findById(id).exec();

    if (user == null) {
      const err = new Error("Não encontrado.");
      err.haveMsg = true;
      throw err;
    }

    user.cart = data;
    await user.save();

    return;
  } catch (err) {
    throw err;
  }
};

UserSchema.statics.fDelete = async function (id) {
  try {
    const res = await this.findByIdAndDelete(id).exec();

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

UserSchema.statics.fGet = async function (id) {
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

UserSchema.statics.fGetSession = async function (id) {
  try {
    const res = await this.findById(id).exec();

    if (res == null) {
      const err = new Error("Não encontrado.");
      err.haveMsg = true;
      throw err;
    }

    return { user: prepare(res), cart: res.cart || {} };
  } catch (err) {
    throw err;
  }
};

UserSchema.statics.fGetAll = async function () {
  try {
    const all = await this.find().exec();
    return all.map((el) => prepare(el));
  } catch (err) {
    throw err;
  }
};

UserSchema.statics.fLoginPassword = async function (email, password) {
  try {
    const res = await this.findOne({ email: email }).exec();

    if (res == null) {
      const err = new Error("E-mail ou senha incorretos.");
      err.haveMsg = true;
      throw err;
    }

    const storedPass = CryptoJS.AES.decrypt(
      res.password,
      process.env.PASS_SEC
    ).toString(CryptoJS.enc.Utf8);

    if (password !== storedPass) {
      const err = new Error("E-mail ou senha incorretos.");
      err.haveMsg = true;
      throw err;
    }

    return { ...prepare(res), cart: res.cart };
  } catch (err) {
    throw err;
  }
};

UserSchema.statics.fLoginOauth = async function (oauthData) {
  try {
    const res = await this.findOne({ email: oauthData.email }).exec();

    if (res != null) {
      return { ...prepare(res), cart: res.cart };
    }

    const newUser = new this({
      firstname: oauthData.firstname,
      lastname: oauthData.lastname,
      email: oauthData.email,
      password: " ",
      role: "client",
    });
    if (oauthData.image) newUser.image = oauthData.image;

    const savedUser = await newUser.save();

    return { ...prepare(savedUser), cart: {} };
  } catch (err) {
    throw err;
  }
};

UserSchema.statics.fAddFavorite = async function (id, data) {
  try {
    if (typeof data !== "string") {
      const err = new Error("Dado em formato inválido.");
      err.haveMsg = true;
      throw err;
    }

    const res = await this.findByIdAndUpdate(
      id,
      { $addToSet: { favorites: data } },
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

UserSchema.statics.fRemoveFavorite = async function (id, data) {
  try {
    if (typeof data !== "string") {
      const err = new Error("Dado em formato inválido.");
      err.haveMsg = true;
      throw err;
    }

    const res = await this.findByIdAndUpdate(
      id,
      { $pull: { favorites: data } },
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

module.exports = mongoose.model("User", UserSchema);
