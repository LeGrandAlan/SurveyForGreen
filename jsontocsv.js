"use strict";

const fs = require("fs");


const jsontocsv = {

    jsonToCsv: function (token, megaCsvPath) {
        fs.readFile("./data/jsonanswer/" + token + ".json", null, (err, content) => {
            if (err) throw err;
            let tabJson = JSON.parse(content);

            let string = token;
            for (let column = 1; column <= 88; ++column) {
                if (tabJson[column] != null) {
                    string += ";" + JSON.stringify(tabJson[column]);
                } else string += ";";
            }
            string += "\n";
            string = string.replace(/\"[it]\":/g, '');
            fs.appendFile(megaCsvPath, string, (err) => {
                if (err) throw err;
                fs.unlink("./data/jsonanswer/" + token + ".json", function (err) {
                });
            });
        });
    }
};

module.exports = jsontocsv;