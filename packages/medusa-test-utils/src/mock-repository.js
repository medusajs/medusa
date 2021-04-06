class MockRepo {
  constructor({
    create,
    update,
    remove,
    softRemove,
    find,
    findOne,
    findOneWithRelations,
    findOneOrFail,
    save,
    findAndCount,
    del,
  }) {
    this.create_ = create;
    this.update_ = update;
    this.remove_ = remove;
    this.delete_ = del;
    this.softRemove_ = softRemove;
    this.find_ = find;
    this.findOne_ = findOne;
    this.findOneOrFail_ = findOneOrFail;
    this.save_ = save;
    this.findAndCount_ = findAndCount;
    this.findOneWithRelations_ = findOneWithRelations;
  }

  setFindOne(fn) {
    this.findOne_ = fn;
  }

  create = jest.fn().mockImplementation((...args) => {
    if (this.create_) {
      return this.create_(...args);
    }
    return {};
  });
  softRemove = jest.fn().mockImplementation((...args) => {
    if (this.softRemove_) {
      return this.softRemove_(...args);
    }
    return {};
  });
  remove = jest.fn().mockImplementation((...args) => {
    if (this.remove_) {
      return this.remove_(...args);
    }
    return {};
  });
  update = jest.fn().mockImplementation((...args) => {
    if (this.update_) {
      return this.update_(...args);
    }
  });
  findOneOrFail = jest.fn().mockImplementation((...args) => {
    if (this.findOneOrFail_) {
      return this.findOneOrFail_(...args);
    }
  });
  findOneWithRelations = jest.fn().mockImplementation((...args) => {
    if (this.findOneWithRelations_) {
      return this.findOneWithRelations_(...args);
    }
  });
  findOne = jest.fn().mockImplementation((...args) => {
    if (this.findOne_) {
      return this.findOne_(...args);
    }
  });
  findOneOrFail = jest.fn().mockImplementation((...args) => {
    if (this.findOneOrFail_) {
      return this.findOneOrFail_(...args);
    }
  });
  find = jest.fn().mockImplementation((...args) => {
    if (this.find_) {
      return this.find_(...args);
    }
  });
  softRemove = jest.fn().mockImplementation((...args) => {
    if (this.softRemove_) {
      return this.softRemove_(...args);
    }
  });
  save = jest.fn().mockImplementation((...args) => {
    if (this.save_) {
      return this.save_(...args);
    }
    return Promise.resolve(...args);
  });

  findAndCount = jest.fn().mockImplementation((...args) => {
    if (this.findAndCount_) {
      return this.findAndCount_(...args);
    }
    return {};
  });
  delete = jest.fn().mockImplementation((...args) => {
    if (this.delete_) {
      return this.delete_(...args);
    }
    return {};
  });
}

export default (methods = {}) => {
  return new MockRepo(methods);
};
