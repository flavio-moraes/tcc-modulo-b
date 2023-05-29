const Category = require("./Category");

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
const mockFindById = jest.fn();
const mockFind = jest.fn().mockImplementation(() => {
  return Model;
});

function Model(data) {
  mockConstructor(data);
  this._id = data._id || "category_id";
  this.title = data.title;
  this.save = mockSave;
  this.remove = mockRemove;
}

Model.fCreate = Category.fCreate;
Model.fUpdate = Category.fUpdate;
Model.fDelete = Category.fDelete;
Model.fGet = Category.fGet;
Model.fGetAll = Category.fGetAll;
Model.exec = mockExec;
Model.findByIdAndUpdate = mockFindByIdAndUpdate;
Model.findById = mockFindById;
Model.find = mockFind;

describe("Category Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fCreate", () => {
    it("should create a new Category entry", async () => {
      const data = { title: "Category Title" };
      const expectedOutput = { id: "category_id", title: "Category Title" };

      const result = await Model.fCreate(data);

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
      const data = {};

      await expect(Model.fCreate(data)).rejects.toThrow(
        "Dados faltando no registro."
      );
    });

    it("should throw an error when the item already exists", async () => {
      const data = { title: "Existing Category" };

      mockSave.mockRejectedValueOnce({ code: 11000 });

      await expect(Model.fCreate(data)).rejects.toThrow(
        "Este item já se encontra no cadastro."
      );
    });
  });

  describe("fUpdate", () => {
    it("should update an existing Category entry", async () => {
      const id = "category_id";
      const data = { title: "Updated Category Title" };
      const updatedData = {
        _id: "category_id",
        title: "Updated Category Title",
      };
      const expectedOutput = {
        id: "category_id",
        title: "Updated Category Title",
      };

      mockExec.mockResolvedValueOnce(updatedData);

      const result = await Model.fUpdate(id, data);

      expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
        id,
        { $set: data },
        { new: true }
      );
      expect(result).toEqual(expectedOutput);
    });

    it("should throw an error when parameter format is incorrect", async () => {
      const id = "category_id";
      const data = "Invalid data";

      await expect(Model.fUpdate(id, data)).rejects.toThrow(
        "Parâmetro em formato errado."
      );
    });

    it("should throw an error when data is missing", async () => {
      const id = "category_id";
      const data = {};

      await expect(Model.fUpdate(id, data)).rejects.toThrow(
        "Dados faltando no registro."
      );
    });

    it("should throw an error when the Category is not found", async () => {
      const id = "nonexistent_id";
      const data = { title: "Updated Category Title" };

      mockExec.mockResolvedValueOnce(null);

      await expect(Model.fUpdate(id, data)).rejects.toThrow("Não encontrado.");
    });
  });

  describe("fDelete", () => {
    it("should delete an existing Category entry", async () => {
      const id = "category_id";
      const category = new Model({ title: "Category Title" });
      const expectedOutput = { id: id, title: "Category Title" };

      mockFindById.mockResolvedValueOnce(category);

      const result = await Model.fDelete(id);

      expect(mockFindById).toHaveBeenCalledWith(id);
      expect(mockRemove).toHaveBeenCalled();
      expect(result).toEqual(expectedOutput);
    });

    it("should throw an error when the Category is not found", async () => {
      const id = "nonexistent_id";

      mockFindById.mockResolvedValueOnce(null);

      await expect(Model.fDelete(id)).rejects.toThrow("Não encontrado.");
    });

    it("should throw an error when an error occurs during deletion", async () => {
      const id = "category_id";
      const category = new Model({ title: "Category Title" });
      const originalError = new Error("Deletion Error");

      mockFindById.mockResolvedValueOnce(category);
      mockRemove.mockRejectedValueOnce(originalError);

      await expect(Model.fDelete(id)).rejects.toThrow(originalError);
    });
  });

  describe("fGet", () => {
    it("should retrieve an existing Category entry", async () => {
      const id = "category_id";
      const category = new Model({ title: "Category Title" });
      const expectedOutput = { id: id, title: "Category Title" };

      mockFindById.mockImplementationOnce(() => {
        return Model;
      });
      mockExec.mockResolvedValueOnce(category);

      const result = await Model.fGet(id);

      expect(mockFindById).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedOutput);
    });

    it("should throw an error when the Category is not found", async () => {
      const id = "nonexistent_id";

      mockFindById.mockImplementationOnce(() => {
        return Model;
      });
      mockExec.mockResolvedValueOnce(null);

      await expect(Model.fGet(id)).rejects.toThrow("Não encontrado.");
    });
  });

  describe("fGetAll", () => {
    it("should retrieve all Category entries", async () => {
      const categories = [
        new Model({ _id: "category_id1", title: "Category 1" }),
        new Model({ _id: "category_id2", title: "Category 2" }),
      ];
      const expectedOutput = [
        { id: "category_id1", title: "Category 1" },
        { id: "category_id2", title: "Category 2" },
      ];

      mockExec.mockResolvedValueOnce(categories);

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
});
