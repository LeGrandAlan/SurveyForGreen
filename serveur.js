'use strict';
// On récupère les librairies
const url = require("url");
const http = require('http');
const querystring = require('querystring');
const fs = require("fs");
const zlib = require('zlib');

// On créer notre serveur
let server = http.createServer(function (req, res) { // On reçoit la demande de connexion du client


    // ------------------ Parsing de l'url -----------------------------
    let page = url.parse(req.url).pathname; // On parse le nom dans l'url
    console.log(page);

    let params = querystring.parse(url.parse(req.url).query); // On récupère les paramètres dans l'url puis les valeurs

    // ------------------ Chargement d'une page avec condition -----------------------------
    if (page === '/' && params['mdp']==="etienne") { // Si le nom est '/'

        // // ------------------ Création d'une page avec des infos contenu dans l'URL -----------------------------
        // res.writeHead(200, {"Content-Type": "text/html"});
        res.writeHead(200, {'Content-Type': 'text/html', 'Content-Encoding': 'gzip'});
        if ('token' in params) { // Si il y a un nom et un prnom dans l'url
            res.write('Vous avez le token ' + params['token']);
            try {
                let content = fs.readFileSync("./data/" + params['token'] + '.json');

                console.log(content);
            } catch (e) {
                console.log("sdgsgq");
            }
        }

        // ------------------ Envoit d'un code html -----------------------------


        fs.readFile('./view/index_head.html', null, (err, data2) => {
                if (err) {
                    console.log(err);
                } else {
                    let html = data2;
                    fs.readFile('./data/questionsv2_min.json', null, (err, data) => {
                        let toEncode = "\n<script>var json = \`" + data + "\`;</script>\n";
                        html += toEncode;
                        fs.readFile('./view/index.html', null, (err, data3) => {
                            html += data3;
                            zlib.gzip(html, function (_, result) {
                                res.end(result);
                            });
                        });

                    });
                }
            }
        );
    } else {
        res.writeHead(404, {"Content-Type": "text/plain"});
        res.write('Erreur 404 : Page introuvable');
        res.end();
    }


});


server.listen(8080); // Le serveur écoute au port 8080

// server.close(); // Arrête le serveur. Déclenche l'évènement close

