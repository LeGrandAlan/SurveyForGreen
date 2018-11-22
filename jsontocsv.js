"use strict";

const fs = require("fs");


const jsontocsv = {

    jsonToCsv: function (token, megaCsvPath) {
        fs.readFile("./data/tokenjson/" + token + ".json", null, (err, content) => {
            if (err) throw err;
            let tabJson = JSON.parse(content);

            let string = token;
            for (let column = 1; column <= 88; ++column) {
                if (tabJson[column] != null) {
                    for (let lign in tabJson[column]) {
                        string += ";" + JSON.stringify(tabJson[column][lign]);
                    }
                } else string += ";";
            }
            string = string.replace(/\"[it]\":/g, '');
            fs.appendFile(megaCsvPath, string, (err) => {
                if (err) throw err;
                console.log("JSON mis dans le grand csv");
            });
        });
    }
};

module.exports = jsontocsv;