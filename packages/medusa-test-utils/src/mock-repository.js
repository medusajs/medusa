export default ({
  create,
  update,
  find,
  findOne,
  findOneOrFail,
  softRemove,
  save,
} = {}) => {
  return {
    create: jest.fn().mockImplementation((...args) => {
      if (create) {
        return create(...args);
      }
      return {};
    }),
    update: jest.fn().mockImplementation((...args) => {
      if (update) {
        return update(...args);
      }
    }),
    findOne: jest.fn().mockImplementation((...args) => {
      if (findOne) {
        return findOne(...args);
      }
    }),
    findOneOrFail: jest.fn().mockImplementation((...args) => {
      if (findOneOrFail) {
        return findOneOrFail(...args);
      }
    }),
    find: jest.fn().mockImplementation((...args) => {
      if (find) {
        return find(...args);
      }
    }),
    softRemove: jest.fn().mockImplementation((...args) => {
      if (softRemove) {
        return softRemove(...args);
      }
    }),
    save: jest.fn().mockImplementation((...args) => {
      if (save) {
        return save(...args);
      }
      return Promise.resolve(...args);
    }),
  };
};
