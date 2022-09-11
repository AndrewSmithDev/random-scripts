/**
 * Update scripts in C:\Users\<username>\AppData\Roaming\AutoDarkMode to match the following:
 * 
 * Enabled: true
 * Component:
 *   TimeoutMillis: 10000
 *   Scripts:
 *     - Name: WindowsTerminal
 *       Command: node
 *       ArgsLight: [C:\toggle-win-term-color.js, -light]
 *       ArgsDark: [C:\toggle-win-term-color.js, -dark]
 *       AllowedSources: [Any]
 * 
 * Save this script as C:\toggle-win-term-color.js. Ensure Node is installed on Windows machine
 */
const { readFileSync, writeFileSync } = require("fs");
const { join } = require("path");

// color scheme configurations
// The dark scheme will be swapped with the light scheme and vice versa
const colorSchemes = [
  { dark: "Campbell", light: "Campbell Powershell" },
  { dark: "One Half Dark", light: "One Half Light" },
  { dark: "Solarized Dark", light: "Solarized Light" },
  { dark: "Tango Dark", light: "Tango Light" },
];

// parse argument to determine which mode to switch to
const modeArg = process.argv[2];
if (modeArg !== "-dark" && modeArg !== "-light") {
  console.error(`Invalid Argument. Argument must be '-dark' or '-light'. Received '${modeArg}'`);
  process.exit(-1);
}
const isDarkMode = modeArg === "-dark";

// read Windows Terminal config
const pathToWinTermConfig = join(
  process.env.LocalAppData,
  "/Packages/Microsoft.WindowsTerminal_8wekyb3d8bbwe/LocalState/settings.json"
);
const configFileContents = readFileSync(pathToWinTermConfig).toString("utf-8");
const config = JSON.parse(configFileContents);

// update Windows Terminal config
config.profiles.list.forEach((profile) => {
  const color = colorSchemes.find((c) => profile.colorScheme === c[isDarkMode ? "light" : "dark"]);
  if (color) profile.colorScheme = color[isDarkMode ? "dark" : "light"];
});

// write Windows Terminal config changes to file system
writeFileSync(pathToWinTermConfig, JSON.stringify(config, null, 2));