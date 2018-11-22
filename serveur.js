"use strict";
// On récupère les librairies
const url = require("url");
const http = require("http");
const querystring = require("querystring");
const fs = require("fs");
const zlib = require("zlib");
const jsontocsv = require("./jsontocsv");

let ipBloque = [];

var cacheData = "";

// On créer notre serveur
let server = http.createServer(function (req, res) { // On reçoit la demande de connexion du client

    if(url.parse(req.url).href.includes(".php") || ipBloque.includes(req.connection.remoteAddress)){
        console.log("Bloquage de requête ! :");
        let date = new Date().toLocaleTimeString('en-US', {
            hour12: false,
            hour: "numeric",
            minute: "numeric"
        });
        console.log(date + " : " + req.connection.remoteAddress + " : " + url.parse(req.url).href);
        ipBloque.push(req.connection.remoteAddress);
    } else {
        // ------------------ Parsing de l'url -----------------------------
        let page = url.parse(req.url).pathname; // On parse le nom dans l'url
        let date = new Date().toLocaleTimeString('en-US', {
            hour12: false,
            hour: "numeric",
            minute: "numeric"
        });
        console.log(date + " : " + req.connection.remoteAddress + " : " + url.parse(req.url).href);

        let params = querystring.parse(url.parse(req.url).query); // On récupère les paramètres dans l'url puis les valeurs

    // ------------------ Savegarde fichier -----------------------------
    if (req.method === "POST") {
        let lejson = "";
        req.on("data", (chunk) => {
            fs.writeFileSync("data/jsonanswer/" + (((JSON.parse(chunk.toString()))["token"])['i']) + ".json", chunk.toString(), "UTF-8");
        });
    }


        // ------------------ Chargement d'une page avec condition -----------------------------
        if (page === "/" && params["mdp"] === "etienne") { // Si le nom est '/'


            // // ------------------ Création d'une page avec des infos contenu dans l'URL -----------------------------

            if (params["download"] === "true") {

                fs.readFile("./data/megafile.csv", null, (err, data) => {
                    if (err) {
                        res.writeHead(404);
                        res.end();
                    } else {
                        zlib.gzip(data, function (_, result) {
                            res.setHeader("Content-disposition", "attachment; filename=resultat.csv");
                            res.writeHead(200, {"Content-Encoding": "gzip"});
                            res.end(result);
                        });
                    }
                });
            } else {
                res.writeHead(200, {"Content-Type": "text/html", "Content-Encoding": "gzip"});
                if (typeof params["token"] === 'undefined' && cacheData !== "") {
                    console.log("utilisation du cache !");
                    res.end(cacheData);
                } else {
                    fs.readFile("./view/index_head.html", null, (err, data2) => {
                            if (err) {
                                console.log(err);
                            } else {
                                let html = data2;
                                fs.readFile("./data/questionsv2_min.json", null, (err, data) => {
                                    if (params["token"]) {
                                        fs.readFile("./data/jsonanswer/" + params["token"] + ".json", null, (err, content) => {
                                            if (err) {
                                                console.log(err);
                                                let toEncode = "\n<script>var token = '" + Math.random().toString(36).substring(2) + "';var json = \`" + data + "\`; var jsonrep =  " + null + " ;</script>\n";
                                                html += toEncode;
                                            } else {
                                                let toEncode = "\n<script>var token = \`" + params['token'] + "\`;var json = \`" + data + "\`; var jsonrep = \`" + content + "\`;</script>\n";
                                                html += toEncode;
                                            }
                                            fs.readFile("./view/index.html", null, (err, data3) => {
                                                html += data3;
                                                zlib.gzip(html, function (_, result) {
                                                    res.end(result);
                                                });
                                            });
                                        });
                                    } else {
                                        let toEncode = "\n<script>var token = \`" + Math.random().toString(36).substring(2) + "\`;var json = \`" + data + "\`; var jsonrep =  " + null + " ;</script>\n";
                                        html += toEncode;
                                        fs.readFile("./view/index.html", null, (err, data3) => {
                                            html += data3;
                                            zlib.gzip(html, function (_, result) {
                                                cacheData = result;
                                                res.end(result);
                                            });
                                        });
                                    }
                                });
                            }
                        }
                    );

                }

            }
            // ------------------ Envoit d'un code html -----------------------------
// "</script>\n";


        } else if (page === '/favicon.ico') {
            res.writeHead(200, {'Content-Type': 'image/x-icon'});
            res.end();
        } else {
            // TODO : remettre
            // res.writeHead(404, {"Content-Type": "text/plain"});
            res.writeHead(202, {"Content-Type": "text/html"});
            res.end("<img src='https://media0.giphy.com/media/ZXlDOOsfV0a8U/giphy.gif?cid=e1bb72ff5bf6a90b36514e32554350fe'> ");
        }
    }

});


server.listen(8080); // Le serveur écoute au port 8080

// server.close(); // Arrête le serveur. Déclenche l'évènement close

