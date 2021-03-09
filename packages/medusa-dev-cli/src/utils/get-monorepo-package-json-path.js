const path = require(`path`);

exports.getMonorepoPackageJsonPath = ({ packageName, root }) => {
  return path.join(root, `packages`, packageName, `package.json`);
};
