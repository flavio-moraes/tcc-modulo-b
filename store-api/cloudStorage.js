const fs = require("fs");
const CryptoJS = require("crypto-js");
const { Storage } = require("@google-cloud/storage");
const crypto = require("crypto");
const { format } = require("util");
const path = require("path");

const saveCredentialsToFile = (data) => {
  let jsonData;
  if (data.json) jsonData = data.json;
  else if (data.inputFilePath)
    jsonData = fs.readFileSync(data.inputFilePath, "utf8");
  else return undefined;
  const encryptedData = CryptoJS.AES.encrypt(
    jsonData,
    process.env.PASS_SEC
  ).toString();
  fs.writeFileSync(
    data.outputFilePath || "encrypted.json",
    encryptedData,
    "utf8"
  );
};

const getCredentialsFromFile = (fileName) => {
  const filePath = path.join(__dirname, fileName);
  console.log("filePath: ", filePath);
  const encryptedContent = fs.readFileSync(filePath, "utf8");
  const decryptedData = CryptoJS.AES.decrypt(
    encryptedContent,
    process.env.PASS_SEC
  ).toString(CryptoJS.enc.Utf8);
  const decryptedJson = JSON.parse(decryptedData);
  return decryptedJson;
};

const storage = new Storage({
  credentials: getCredentialsFromFile("gcs.cred"),
});

const bucket = storage.bucket(process.env.BUCKET);

function generateRandomFilename() {
  const randomBytes = crypto.randomBytes(16).toString("hex");
  return `${randomBytes}`;
}

const uploadImage = (file) =>
  new Promise((resolve, reject) => {
    const fileType = file.mimetype.split("/")[1];
    const fileName = generateRandomFilename() + "." + fileType;
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({ resumable: false });

    blobStream.on("error", (err) => {
      reject("Erro ao durante o upload da imagem. " + err);
    });

    blobStream.on("finish", () => {
      resolve(blob.name);
    });

    blobStream.end(file.buffer);
  });

const deleteImage = (fileName) =>
  new Promise((resolve, reject) => {
    const file = bucket.file(fileName);
    file
      .delete()
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

module.exports = {
  saveCredentialsToFile,
  uploadImage,
  deleteImage,
};
