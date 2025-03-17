import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

let updatesMade = false;

function updateManifestVersion(manifestPath, manifestName) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (manifest.version !== version) {
    manifest.version = version;
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`✅ Updated ${manifestName} manifest to version ${version}`);
    updatesMade = true;
    return true;
  }
  return false;
}

function updateComponentVersion(filePath, fileName) {
  const content = fs.readFileSync(filePath, 'utf8');

  const hasVersionImport = content.includes("import { APP_VERSION } from '../version'");

  const versionPattern = /Qwacky v(?:{APP_VERSION}|[\d\.]+)/;
  const versionMatch = content.match(versionPattern);
  
  if (hasVersionImport || (versionMatch && !versionMatch[0].includes(version))) {
    let newContent = content;

    if (hasVersionImport) {
      newContent = newContent.replace(/import { APP_VERSION } from \'\.\.\/version\'.*?\n/, '');
    }
    
    newContent = newContent.replace(/Qwacky v(?:{APP_VERSION}|[\d\.]+)/g, `Qwacky v${version}`);

    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Updated ${fileName} with version: ${version}`);
      updatesMade = true;
      return true;
    }
  }
  return false;
}

const chromeManifestPath = path.join(__dirname, '..', 'manifest.chrome.json');
updateManifestVersion(chromeManifestPath, 'Chrome');

const firefoxManifestPath = path.join(__dirname, '..', 'manifest.firefox.json');
updateManifestVersion(firefoxManifestPath, 'Firefox');

const loginPath = path.join(__dirname, '..', 'src', 'pages', 'Login.tsx');
updateComponentVersion(loginPath, 'Login.tsx');

const settingsPath = path.join(__dirname, '..', 'src', 'pages', 'Settings.tsx');
updateComponentVersion(settingsPath, 'Settings.tsx');

const appPath = path.join(__dirname, '..', 'src', 'App.tsx');
const appContent = fs.readFileSync(appPath, 'utf8');
const appVersionPattern = /const APP_VERSION = ['"](.+)['"]/;
const appVersionMatch = appContent.match(appVersionPattern);

if (appVersionMatch && appVersionMatch[1] !== version) {
  const newAppContent = appContent.replace(appVersionPattern, `const APP_VERSION = '${version}'`);
  fs.writeFileSync(appPath, newAppContent);
  console.log(`✅ Updated App.tsx with version: ${version}`);
  updatesMade = true;
}

if (updatesMade) {
  console.log('Version updates complete! 🚀');
} else {
  console.log(`No version changes needed. Current version: ${version}`);
}
