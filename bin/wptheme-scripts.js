#!/usr/bin/env node
/**
 * Copyright (c) 2015-present, devloco.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

const spawn = require("react-dev-utils/crossSpawn");
const args = process.argv.slice(2);

const scriptIndex = args.findIndex((x) => x === "build" || x === "start" || x === "wpbuild" || x === "wpstart");
const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];

let script = scriptIndex === -1 ? args[0] : args[scriptIndex];
if (!script.startsWith("wp")) {
    script = `wp${script}`;
}
switch (script) {
    case "wpbuild":
    case "wpstart": {
        const result = spawn.sync("node", nodeArgs.concat(require.resolve("../scripts/" + script)).concat(args.slice(scriptIndex + 1)), { stdio: "inherit" }).on("error", function(err) {
            console.log("wpstart error: ", err);
            console.log("wpstart error args: ", args);
            throw err;
        });
        if (result.signal) {
            if (result.signal === "SIGKILL") {
                console.log("The build failed because the process exited too early.");
                console.log("This probably means the system ran out of memory or someone called `kill -9` on the process.");
            } else if (result.signal === "SIGTERM") {
                console.log("The build failed because the process exited too early.");
                console.log("Someone might have called `kill` or `killall`, or the system could be shutting down.");
            }

            process.exit(1);
        }

        process.exit(result.status);
        break;
    }
    default:
        console.log('Unknown script "' + script + '".');
        console.log("The original create-react-scripts commands are still available but must be prefixed with 'cra' (e.g. crastart, craeject, etc.).");
        break;
}
