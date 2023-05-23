// A generic repository for CRUD operations (DAO)
export default class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  create = async (entity) => {
    return await this.model.create(entity);
  };

  getOne = async (criteria) => {
    return await this.model.findOne(criteria).lean();
  };

  getById = async (id) => {
    return await this.model.findById(id).lean();
  };

  getMany = async (criteria) => {
    return await this.model.find(criteria).lean();
  };

  update = async (
    filter,
    update,
    arrayFilters = {
      new: true,
    }
  ) => {
    return await this.model
      .findOneAndUpdate(filter, update, arrayFilters)
      .lean();
  };

  // Hard delete
  delete = async (id) => {
    return await this.model.deleteOne({ _id: id }).lean();
  };

  deleteMany = async (criteria) => {
    return await this.model.deleteMany(criteria).lean();
  };
}
