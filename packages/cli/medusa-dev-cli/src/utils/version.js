exports.getVersionInfo = () => {
  const { version: devCliVersion } = require(`../../package.json`);
  return `Medusa Dev CLI version: ${devCliVersion}`;
};
