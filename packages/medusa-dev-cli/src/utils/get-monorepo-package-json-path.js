const path = require(`path`);

exports.getMonorepoPackageJsonPath = ({ packageName, root }) => {
  let dirName = packageName;
  if (packageName.startsWith("@medusajs")) {
    const [, directory] = packageName.split("/");
    dirName = directory;
  }

  return path.join(root, `packages`, dirName, `package.json`);
};
