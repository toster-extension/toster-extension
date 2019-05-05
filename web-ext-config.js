require("dotenv").config();

module.exports = {
    artifactsDir: process.env.WEB_EXT_ARTIFACTS_DIR,
    build: {
        overwriteDest: JSON.parse(process.env.WEB_EXT_OVERWRITE_DEST),
    },
    sourceDir: process.env.WEB_EXT_SOURCE_DIR,
    verbose: JSON.parse(process.env.WEB_EXT_VERBOSE),
};
