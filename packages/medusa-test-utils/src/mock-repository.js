export default ({ create, update, find, findOne, save } = {}) => {
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
    find: jest.fn().mockImplementation((...args) => {
      if (find) {
        return find(...args);
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
