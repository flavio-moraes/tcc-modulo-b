const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: { type: String },
        productName: { type: String },
        productImage: { type: String },
        variantId: { type: String },
        variantName: { type: String },
        variantPrice: { type: Number },
        quantity: { type: Number, default: 1 },
      },
    ],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "pending" },
    transactionId: { type: Number, required: true, unique: true },
    payment: { type: Object, required: true },
  },
  {
    timestamps: true,
  }
);

const prepare = async function (dbEntry) {
  const outEntry = {};
  outEntry.id = dbEntry._id;
  outEntry.userId = dbEntry.userId;
  let res;
  try {
    res = await mongoose
      .model("User")
      .findById(dbEntry.userId)
      .select("firstname lastname");
    outEntry.userName = res.firstname + " " + res.lastname;
  } catch (err) {
    outEntry.userName = "";
  }
  outEntry.transactionId = dbEntry.transactionId;
  outEntry.amount = dbEntry.amount;
  outEntry.address = dbEntry.address;
  outEntry.status = dbEntry.status;
  outEntry.createdAt = dbEntry.createdAt;
  outEntry.payment = dbEntry.payment;
  outEntry.products = dbEntry.products.map((entry) => {
    if (entry.productImage) {
      entry.productImage = process.env.STORAGE_URL + entry.productImage;
      return entry;
    } else {
      delete entry.productImage;
      return entry;
    }
  });
  return outEntry;
};

const Schema = OrderSchema;

Schema.statics.fDelete = async function (id) {
  try {
    const res = await this.findById(id);

    if (res == null) {
      const err = new Error("Não encontrado.");
      err.haveMsg = true;
      throw err;
    }

    const res2 = await res.remove();

    return await prepare(res2);
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

    return await prepare(res);
  } catch (err) {
    throw err;
  }
};

Schema.statics.fGetAll = async function () {
  try {
    const res = await this.find().exec();

    const asyncRes = await Promise.all(
      res.map(async (el) => {
        return await prepare(el);
      })
    );

    return asyncRes;
  } catch (err) {
    throw err;
  }
};

module.exports = mongoose.model("Order", OrderSchema);
