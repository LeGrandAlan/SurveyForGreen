"use strict";
// On récupère les librairies
const url = require("url");
const http = require("http");
const querystring = require("querystring");
const fs = require("fs");
const zlib = require("zlib");
const jsontocsv = require("./jsontocsv");

let ipBloque = []; // une liste d'ip que l'on vas bloquer

let cacheData = ""; // variable contenant la page de base déjà encodéé en gzip

// On créer notre serveur
let server = http.createServer(function (req, res) { // On reçoit la demande de connexion du client

    // condition pour bloquer les tentatives d'intrusions (assez basique)
    if (url.parse(req.url).href.includes(".php") || ipBloque.includes(req.connection.remoteAddress)) {
        console.log("Bloquage de requête ! :");
        let date = new Date().toLocaleTimeString("en-US", {
            hour12: false,
            hour: "numeric",
            minute: "numeric"
        });
        console.log(date + " : " + req.connection.remoteAddress + " : " + url.parse(req.url).href);
        if (!ipBloque.includes(req.connection.remoteAddress)) { // si elle n'est pas dans la liste des ip bloquées on l'ajoute
            ipBloque.push(req.connection.remoteAddress);
        }
    } else {
        // ------------------ Parsing de l'url -----------------------------
        let page = url.parse(req.url).pathname; // On parse le nom dans l'url
        let date = new Date().toLocaleTimeString("en-US", {
            hour12: false,
            hour: "numeric",
            minute: "numeric"
        });
        console.log(date + " : " + req.connection.remoteAddress + " : " + url.parse(req.url).href);

        // On récupère les paramètres dans l'url puis les valeurs
        let params = querystring.parse(url.parse(req.url).query);

        // ------------------ Savegarde fichier passé en post-----------------------------
        if (req.method === "POST") {
            let lejson = "";
            req.on("data", (chunk) => {
                try {
                    fs.writeFileSync("data/jsonanswer/" + (((JSON.parse(chunk.toString()))["token"])['i']) + ".json", chunk.toString(), "UTF-8");
                    if (((JSON.parse(chunk.toString()))["88"]) != null) {
                        jsontocsv.jsonToCsv((JSON.parse(chunk.toString()))["token"]['i'], "./data/megafile.csv");
                    }
                    res.writeHead(202);
                    res.end();
                } catch (e) {
                    res.writeHead(500);
                    res.end();
                }
            });
        } else {


            // ------------------ Chargement d'une page avec condition -----------------------------
            if (page === "/") { // Si le nom est '/'


                // // ------------------ Création d'une page avec des infos contenu dans l'URL -----------------------------

                if (params["download"] === "true") { // si on veut télécharger le

                    fs.readFile("./data/megafile.csv", null, (err, data) => { // on ouvre le fichier
                        if (err) {
                            res.writeHead(404);
                            res.end();
                        } else {
                            zlib.gzip(data, function (_, result) { // on encode l'evoie du fichier en gzip
                                res.setHeader("Content-disposition", "attachment; filename=resultat.csv");
                                res.writeHead(200, {"Content-Encoding": "gzip"});
                                res.end(result);
                            });
                        }
                    });
                } else {
                    res.writeHead(200, {"Content-Type": "text/html", "Content-Encoding": "gzip"});
                    if (typeof params["token"] === 'undefined' && cacheData !== "") { // si on va ouvrir une page simple, on charge le cache
                        console.log("utilisation du cache !");
                        res.end(cacheData);
                    } else {
                        //TODO: mettre fichiers min
                        fs.readFile("./view/index_head.html", null, (err, data2) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    let html = data2;
                                    fs.readFile("./data/questionsv2_min.json", null, (err, data) => { // on ouvre notre fichier contenant toutes les questions
                                        if (params["token"] && fs.existsSync("./data/jsonanswer/" + params["token"] + ".json")) {
                                            fs.readFile("./data/jsonanswer/" + params["token"] + ".json", null, (err, content) => {
                                                if (err) {
                                                    console.log(err);
                                                    let toEncode = "\n<script>var json = \`" + data + "\`; var jsonrep =  " + null + " ;</script>\n";
                                                    html += toEncode; // on passe le contenu des variables dans le fichier
                                                } else { // s'il a un token valide on lui passe son avancement dans le questionnaire
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
                                        } else { // si pas de token, on passe la page de base
                                            let toEncode = "\n<script>var json = \`" + data + "\`; var jsonrep =  " + null + " ;</script>\n";
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


            } else if (page === '/favicon.ico') { // on n'a pas de favicon donc erreur 410
                res.writeHead(410);
                res.end();
            } else if (page === '/source.zip') { // si le jury cherche le fichier source.zip
                fs.readFile("./source.zip", null, (err, data) => { // on l'ouvre
                    if (err) { // si il y a une erreur on renvoie un code 404
                        res.writeHead(404);
                        res.end();
                    } else {
                        zlib.gzip(data, function (_, result) { // sinon on l'envoie au client encoder en gzip
                            res.setHeader("Content-disposition", "attachment; filename=source.zip");
                            res.writeHead(200, {"Content-Encoding": "gzip"});
                            res.end(result);
                        });
                    }
                });
            } else { // pour toute autre page, erreur 404
                res.writeHead(404, {"Content-Type": "text/plain"});
            }
        }
    }

});


server.listen(8080); // Le serveur écoute au port 8080

// server.close(); // Arrête le serveur. Déclenche l'évènement close

