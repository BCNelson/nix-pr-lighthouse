import fs from "fs/promises"
import Path from "path";
import type Postgrator from "postgrator";
import Url from "url";
import crypto from "crypto";
import type { PartialMessage } from "esbuild";

interface StaticMigration extends Omit<Postgrator.Migration, 'getSql'> {
    sql: string;
}

const warnings: Array<PartialMessage> = [];

// Get the current dir
const directory = Path.dirname(Url.fileURLToPath(import.meta.url));

const directoryContents = await fs.readdir(directory);

const toProcess = directoryContents.filter((file) => file.endsWith(".sql")).sort((a, b) => a.localeCompare(b, "en", {numeric: true}));

if (toProcess[0] == "0000.setup.sql") {
    toProcess.shift();
} else {
    warnings.push({
        text: "The first migration file is not 0000.setup.sql"
    });
}

const migrations = await Promise.all(toProcess.map(async (file) => {
    const contents = await fs.readFile(Path.join(directory, file), "utf-8");
    const md5 = crypto.createHash('md5').update('contents').digest("hex");

    const fileSplit = file.split(".");

    if (fileSplit.length != 4) {
        throw new Error(`Migration file ${file} does not have a valid name`);
    }

    const action: "do" | "undo" | string = fileSplit[1];
    if (action != "do" && action != "undo") {
        throw new Error(`Migration file ${file} does not have a valid action`);
    }

    const migration: StaticMigration = {
        version: parseInt(file.split(".")[0]),
        action,
        name: fileSplit[2],
        filename: file,
        sql: contents,
        md5
    }
    return migration;
}));

export const __esbuild = {
    warnings
};

export default migrations;