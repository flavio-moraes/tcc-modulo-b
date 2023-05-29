const User = require("./User");
const CryptoJS = require("crypto-js");

jest.mock("crypto-js", () => ({
  AES: {
    encrypt: jest.fn().mockImplementation(function () {
      return "password";
    }),
    decrypt: jest.fn().mockImplementation(function () {
      return "password";
    }),
  },
  enc: {
    Utf8: "",
  },
}));

const mockConstructor = jest.fn();
const mockSave = jest.fn().mockImplementation(function () {
  return this;
});
const mockRemove = jest.fn().mockImplementation(function () {
  return this;
});
const mockExec = jest.fn();
const mockFindByIdAndUpdate = jest.fn().mockImplementation(() => {
  return Model;
});
const mockFindByIdAndDelete = jest.fn().mockImplementation(() => {
  return Model;
});
const mockFindById = jest.fn().mockImplementation(() => {
  return Model;
});
const mockFind = jest.fn().mockImplementation(() => {
  return Model;
});
const mockFindOne = jest.fn().mockImplementation(() => {
  return Model;
});
const mockAggregate = jest.fn();
const mockCountDocuments = jest.fn();

function Model(data) {
  mockConstructor(data);
  this._id = data._id || "user_id";
  this.firstname = data.firstname;
  this.lastname = data.lastname;
  this.email = data.email;
  this.password = data.password;
  this.role = data.role || "client";
  this.save = mockSave;
  this.remove = mockRemove;
}

Model.fCreate = User.fCreate;
Model.fUpdate = User.fUpdate;
Model.fDelete = User.fDelete;
Model.fGet = User.fGet;
Model.fGetAll = User.fGetAll;
Model.fCartUpdate = User.fCartUpdate;
Model.fGetSession = User.fGetSession;
Model.fLoginPassword = User.fLoginPassword;
Model.fLoginOauth = User.fLoginOauth;
Model.fAddFavorite = User.fAddFavorite;
Model.fRemoveFavorite = User.fRemoveFavorite;
Model.exec = mockExec;
Model.findByIdAndUpdate = mockFindByIdAndUpdate;
Model.findByIdAndDelete = mockFindByIdAndDelete;
Model.findById = mockFindById;
Model.find = mockFind;
Model.findOne = mockFindOne;
Model.aggregate = mockAggregate;
Model.countDocuments = mockCountDocuments;

describe("User Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fCreate", () => {
    it("should create a new User entry", async () => {
      const data = {
        firstname: "John",
        lastname: "Doe",
        email: "johndoe@email.com",
        password: "12345",
      };
      const expectedOutput = {
        id: "user_id",
        firstname: "John",
        lastname: "Doe",
        email: "johndoe@email.com",
        role: "client",
        address: undefined,
        favorites: undefined,
      };

      const result = await Model.fCreate(data);

      expect(mockConstructor).toHaveBeenCalled();
      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual(expectedOutput);
    });

    it("should throw an error when parameter format is incorrect", async () => {
      const data = "Invalid data";

      await expect(Model.fCreate(data)).rejects.toThrow(
        "Parâmetro em formato errado."
      );
    });

    it("should throw an error when data is missing", async () => {
      const data = { firstname: "John" };

      await expect(Model.fCreate(data)).rejects.toThrow(
        "Dados faltando no registro."
      );
    });

    it("should throw an error when the item already exists", async () => {
      const data = {
        firstname: "John",
        lastname: "Doe",
        email: "johndoe@email.com",
        password: "12345",
      };

      mockSave.mockRejectedValueOnce({ code: 11000 });

      await expect(Model.fCreate(data)).rejects.toThrow(
        "Este item já se encontra no cadastro."
      );
    });
  });

  describe("fUpdate", () => {
    it("should update an existing User entry", async () => {
      const id = "user_id";
      const data = {
        firstname: "John",
        lastname: "Doe",
        email: "updatedjohndoe@email.com",
        password: "54321",
      };
      const updatedData = {
        _id: "user_id",
        firstname: "John",
        lastname: "Doe",
        email: "updatedjohndoe@email.com",
        password: "54321",
        role: "client",
      };
      const expectedOutput = {
        id: "user_id",
        firstname: "John",
        lastname: "Doe",
        email: "updatedjohndoe@email.com",
        role: "client",
        address: undefined,
        favorites: undefined,
      };

      mockExec.mockResolvedValueOnce(updatedData);

      const result = await Model.fUpdate(id, data);

      expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
        id,
        { $set: data, $unset: {} },
        { new: true }
      );
      expect(result).toEqual(expectedOutput);
    });

    it("should throw an error when parameter format is incorrect", async () => {
      const id = "user_id";
      const data = "Invalid data";

      await expect(Model.fUpdate(id, data)).rejects.toThrow(
        "Parâmetro em formato errado."
      );
    });

    it("should throw an error when the User is not found", async () => {
      const id = "nonexistent_id";
      const data = {
        firstname: "UpdatedJohn",
        email: "updatedjohndoe@email.com",
      };

      mockExec.mockResolvedValueOnce(null);

      await expect(Model.fUpdate(id, data)).rejects.toThrow("Não encontrado.");
    });
  });

  describe("fDelete", () => {
    it("should delete an existing User entry", async () => {
      const id = "user_id";
      const user = new Model({
        _id: id,
        firstname: "John",
        lastname: "Doe",
        email: "johndoe@email.com",
        password: "12345",
      });
      const expectedOutput = {
        id: id,
        firstname: "John",
        lastname: "Doe",
        email: "johndoe@email.com",
        role: "client",
        address: undefined,
        favorites: undefined,
      };

      mockExec.mockResolvedValueOnce(user);

      const result = await Model.fDelete(id);

      expect(mockFindByIdAndDelete).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedOutput);
    });

    it("should throw an error when the User is not found", async () => {
      const id = "nonexistent_id";

      mockExec.mockResolvedValueOnce(null);

      await expect(Model.fDelete(id)).rejects.toThrow("Não encontrado.");
    });

    it("should throw an error when an error occurs during deletion", async () => {
      const id = "user_id";

      const originalError = new Error("Deletion Error");

      mockExec.mockRejectedValueOnce(originalError);

      await expect(Model.fDelete(id)).rejects.toThrow(originalError);
    });
  });

  describe("fGet", () => {
    it("should retrieve an existing User entry", async () => {
      const id = "user_id";
      const user = new Model({
        _id: id,
        firstname: "John",
        lastname: "Doe",
        email: "johndoe@email.com",
        password: "12345",
      });
      const expectedOutput = {
        id: id,
        firstname: "John",
        lastname: "Doe",
        email: "johndoe@email.com",
        role: "client",
        address: undefined,
        favorites: undefined,
      };

      mockExec.mockResolvedValueOnce(user);

      const result = await Model.fGet(id);

      expect(mockFindById).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedOutput);
    });

    it("should throw an error when the User is not found", async () => {
      const id = "nonexistent_id";

      mockExec.mockResolvedValueOnce(null);

      await expect(Model.fGet(id)).rejects.toThrow("Não encontrado.");
    });
  });

  describe("fGetAll", () => {
    it("should retrieve all User entries", async () => {
      const users = [
        new Model({
          _id: "user_id1",
          firstname: "John1",
          lastname: "Doe1",
          email: "johndoe1@email.com",
          password: "12345",
        }),
        new Model({
          _id: "user_id2",
          firstname: "John2",
          lastname: "Doe2",
          email: "johndoe2@email.com",
          password: "12345",
        }),
      ];
      const expectedOutput = [
        {
          id: "user_id1",
          firstname: "John1",
          lastname: "Doe1",
          email: "johndoe1@email.com",
          role: "client",
          address: undefined,
          favorites: undefined,
        },
        {
          id: "user_id2",
          firstname: "John2",
          lastname: "Doe2",
          email: "johndoe2@email.com",
          role: "client",
          address: undefined,
          favorites: undefined,
        },
      ];

      mockExec.mockResolvedValueOnce(users);

      const result = await Model.fGetAll();

      expect(mockFind).toHaveBeenCalled();
      expect(result).toEqual(expectedOutput);
    });

    it("should throw an error when an error occurs during retrieval", async () => {
      const originalError = new Error("Retrieval Error");

      mockExec.mockRejectedValueOnce(originalError);

      await expect(Model.fGetAll()).rejects.toThrow(originalError);
    });
  });

  describe("fCartUpdate", () => {
    it("should update the cart for a user", async () => {
      const id = "user_id";
      const cartData = { items: [{ id: "item_id", quantity: 2 }] };
      const user = new Model({
        _id: id,
        firstname: "John",
        lastname: "Doe",
        email: "johndoe@email.com",
        password: "12345",
      });
      const expectedOutput = {
        _id: id,
        firstname: "John",
        lastname: "Doe",
        email: "johndoe@email.com",
        password: "12345",
        role: "client",
        cart: cartData,
      };

      mockExec.mockResolvedValueOnce(user);

      await Model.fCartUpdate(id, cartData);

      expect(mockFindById).toHaveBeenCalledWith(id);
      expect(mockSave).toHaveBeenCalled();
      expect({ ...user, save: undefined, remove: undefined }).toEqual(
        expectedOutput
      );
    });

    it("should throw an error when the user is not found", async () => {
      const id = "nonexistent_id";
      const cartData = { items: [{ id: "item_id", quantity: 2 }] };

      mockExec.mockResolvedValueOnce(null);

      await expect(Model.fCartUpdate(id, cartData)).rejects.toThrow(
        "Não encontrado."
      );
    });
  });

  describe("fGetSession", () => {
    it("should retrieve the session for a user", async () => {
      const id = "user_id";
      const user = new Model({
        _id: id,
        firstname: "John",
        lastname: "Doe",
        email: "johndoe@email.com",
        password: "12345",
      });
      const userOutput = {
        id: id,
        firstname: "John",
        lastname: "Doe",
        email: "johndoe@email.com",
        role: "client",
        address: undefined,
        favorites: undefined,
      };
      const expectedOutput = { user: userOutput, cart: {} };

      mockExec.mockResolvedValueOnce(user);

      const result = await Model.fGetSession(id);

      expect(mockFindById).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedOutput);
    });

    it("should throw an error when the user is not found", async () => {
      const id = "nonexistent_id";

      mockExec.mockResolvedValueOnce(null);

      await expect(Model.fGetSession(id)).rejects.toThrow("Não encontrado.");
    });
  });

  describe("fLoginPassword", () => {
    it("should login a user with a password", async () => {
      const email = "user@example.com";
      const password = "password";
      const user = new Model({
        _id: "user_id",
        firstname: "John",
        lastname: "Doe",
        email: "johndoe@email.com",
        password: "12345",
      });
      const expectedOutput = {
        id: "user_id",
        firstname: "John",
        lastname: "Doe",
        email: "johndoe@email.com",
        role: "client",
        address: undefined,
        favorites: undefined,
        cart: undefined,
      };

      mockExec.mockResolvedValueOnce(user);
      const result = await Model.fLoginPassword(email, password);
      expect(mockFindOne).toHaveBeenCalledWith({ email: email });
      expect(result).toEqual(expectedOutput);
    });

    it("should throw an error when the user is not found", async () => {
      const email = "nonexistentuser@example.com";
      const password = "password";

      mockExec.mockResolvedValueOnce(null);

      await expect(Model.fLoginPassword(email, password)).rejects.toThrow(
        "E-mail ou senha incorretos."
      );
    });

    it("should throw an error when the password is incorrect", async () => {
      const email = "user@example.com";
      const password = "incorrect_password";
      const user = { _id: "user_id", email };

      mockExec.mockResolvedValueOnce(user);

      await expect(Model.fLoginPassword(email, password)).rejects.toThrow(
        "E-mail ou senha incorretos."
      );
    });
  });

  describe("fLoginOauth", () => {
    it("should login a user with OAuth", async () => {
      const oauthData = {
        firstname: "John",
        lastname: "Doe",
        email: "johndoe@email.com",
      };
      const user = new Model({
        _id: "user_id",
        firstname: "John",
        lastname: "Doe",
        email: "johndoe@email.com",
        password: "12345",
      });
      const expectedOutput = {
        id: "user_id",
        firstname: "John",
        lastname: "Doe",
        email: "johndoe@email.com",
        role: "client",
        address: undefined,
        favorites: undefined,
        cart: undefined,
      };

      mockExec.mockResolvedValueOnce(user);
      const result = await Model.fLoginOauth(oauthData);
      expect(mockFindOne).toHaveBeenCalledWith({ email: oauthData.email });
      expect(result).toEqual(expectedOutput);
    });

    it("should create the user when the user is not found", async () => {
      const oauthData = {
        firstname: "Jane",
        lastname: "Doe",
        email: "janedoe@email.com",
      };
      const expectedOutput = {
        id: "user_id",
        firstname: "Jane",
        lastname: "Doe",
        email: "janedoe@email.com",
        role: "client",
        address: undefined,
        favorites: undefined,
        cart: {},
      };

      mockFind.mockResolvedValueOnce(null);
      const result = await Model.fLoginOauth(oauthData);
      expect(mockFindOne).toHaveBeenCalledWith({ email: oauthData.email });
      expect(mockConstructor).toHaveBeenCalled();
      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual(expectedOutput);
    });
  });

  describe("fAddFavorite", () => {
    it("should add a favorite item for a user", async () => {
      const userId = "user_id";
      const itemId = "item_id";
      const user = {
        _id: userId,
        firstname: "John",
        lastname: "Doe",
        email: "johndoe@email.com",
        password: "12345",
        role: "client",
        favorites: [itemId],
      };
      const expectedOutput = {
        id: userId,
        firstname: "John",
        lastname: "Doe",
        email: "johndoe@email.com",
        role: "client",
        address: undefined,
        favorites: [itemId],
      };

      mockExec.mockResolvedValueOnce(user);

      const result = await Model.fAddFavorite(userId, itemId);

      expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        { $addToSet: { favorites: itemId } },
        { new: true }
      );
      expect(result).toEqual(expectedOutput);
    });

    it("should throw an error when parameter format is incorrect", async () => {
      const userId = "user_id";
      const itemId = { id: "wrong format" };

      await expect(Model.fAddFavorite(userId, itemId)).rejects.toThrow(
        "Dado em formato inválido."
      );
    });

    it("should throw an error when the user is not found", async () => {
      const userId = "nonexistent_id";
      const itemId = "item_id";

      mockExec.mockResolvedValueOnce(null);

      await expect(Model.fAddFavorite(userId, itemId)).rejects.toThrow(
        "Não encontrado."
      );
    });
  });

  describe("fRemoveFavorite", () => {
    it("should remove a favorite item for a user", async () => {
      const userId = "user_id";
      const itemId = "item_id";
      const user = {
        _id: userId,
        firstname: "John",
        lastname: "Doe",
        email: "johndoe@email.com",
        password: "12345",
        role: "client",
        favorites: [],
      };
      const expectedOutput = {
        id: userId,
        firstname: "John",
        lastname: "Doe",
        email: "johndoe@email.com",
        role: "client",
        address: undefined,
        favorites: [],
      };

      mockExec.mockResolvedValueOnce(user);

      const result = await Model.fRemoveFavorite(userId, itemId);

      expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        { $pull: { favorites: itemId } },
        { new: true }
      );
      expect(result).toEqual(expectedOutput);
    });

    it("should throw an error when parameter format is incorrect", async () => {
      const userId = "user_id";
      const itemId = { id: "wrong format" };

      await expect(Model.fRemoveFavorite(userId, itemId)).rejects.toThrow(
        "Dado em formato inválido."
      );
    });

    it("should throw an error when the user is not found", async () => {
      const userId = "nonexistent_id";
      const itemId = "item_id";

      mockExec.mockResolvedValueOnce(null);

      await expect(Model.fRemoveFavorite(userId, itemId)).rejects.toThrow(
        "Não encontrado."
      );
    });
  });
});
