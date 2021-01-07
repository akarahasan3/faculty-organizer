const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public_html'));


app.get("/predmeti", function(req, res){
    fs.readFile(__dirname + "/predmeti.txt",function(err,data){
        var n=[];
        var tekst=data.toString();
        if(data != ""){
            var redovi=tekst.split("\n");
            for(var i=0;i<redovi.length;i++){
                var predmet=redovi[i];
                var objekat={naziv:predmet};
                n.push(objekat);
            }
        }
        res.writeHead(200,{'Content-Type':"application/json"});
        res.end(JSON.stringify(n));}
  );
});

app.get("/aktivnosti", function(req, res){
    fs.readFile(__dirname + "/aktivnosti.txt",function(err,data){
        var n=[];
        var tekst=data.toString();
        if(data != ""){
            var redovi=tekst.split("\n");
            for(var i=0;i<redovi.length;i++){
                var aktivnosti=redovi[i].split(",");
                var objekat={naziv:aktivnosti[0],tip:aktivnosti[1],pocetak:Number(aktivnosti[2]),kraj:Number(aktivnosti[3]),dan:aktivnosti[4]};
                n.push(objekat);
            }
        }
        res.writeHead(200,{'Content-Type':"application/json"});
        res.end(JSON.stringify(n));
    });
});

app.get("/predmet/:naziv/aktivnost", function(req, res){
    fs.readFile(__dirname + "/aktivnosti.txt",function(err,data){
        var n=[];
        var tekst=data.toString();
        if(data != ""){
            var redovi=tekst.split("\n");
            for(var i=0;i<redovi.length;i++){
                var aktivnosti=redovi[i].split(",");
                if(aktivnosti[0] == req.params.naziv)
                {
                    var objekat={naziv:aktivnosti[0],tip:aktivnosti[1],pocetak:Number(aktivnosti[2]),kraj:Number(aktivnosti[3]),dan:aktivnosti[4]};
                    n.push(objekat);
                }
            }
        }
        res.writeHead(200,{'Content-Type':"application/json"});
        res.end(JSON.stringify(n));}
  );
});

app.post("/predmet", function(req, res){
    var predmet = req.body.naziv;
    fs.readFile(__dirname + "/predmeti.txt",function(err,data){
        var n=[];
        var tekst=data.toString();
        if(data != ""){
            predmet = '\n'+predmet;
        }
        var redovi=tekst.split("\n");
        var postoji = false;
        for(var i=0;i<redovi.length;i++){
            var nazivPredmeta = redovi[i];
            console.log(predmet.length + " i " + nazivPredmeta.length);
            console.log(predmet.substring(1,predmet.length-1));
            console.log("Naziv "+nazivPredmeta);
            if(predmet.substring(1,predmet.length)==nazivPredmeta){
                postoji = true;
            }
        }
        if(postoji){
            var objekat = {message:"Naziv predmeta postoji!"};
            res.writeHead(200,{'Content-Type':"application/json"});
            res.end(JSON.stringify(objekat));
        }
        else{
            fs.appendFile('predmeti.txt', predmet, function(error){
                if(error) console.log("a-a");
                else{
                    var objekat = {message:"Uspješno dodan predmet!"};
                    res.writeHead(200,{'Content-Type':"application/json"});
                    res.end(JSON.stringify(objekat));
                }
            });
        }
    });
});

app.post("/aktivnost", function(req, res){
    const aktivnostNaziv = req.body.naziv;
    const aktivnostTip = req.body.tip;
    const aktivnostPocetak = req.body.pocetak;
    const aktivnostKraj = req.body.kraj;
    const aktivnostDan = req.body.dan;
    fs.readFile(__dirname + "/aktivnosti.txt",function(err,data){
        var n=[];
        var tekst=data.toString();
        if(data == ""){ //OVO NE VALJA, DODATI TESTOVE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            var aktivnost = aktivnostNaziv + "," + aktivnostTip + "," + aktivnostPocetak + "," + aktivnostKraj + "," + aktivnostDan;
            fs.appendFile('aktivnosti.txt', aktivnost, function(error){
                if(error) console.log("a-a");
                else{
                    var objekat = {message:"Uspješno dodana aktivnost!"};
                    res.writeHead(200,{'Content-Type':"application/json"});
                    res.end(JSON.stringify(objekat));
                }
            });
        }
        var redovi=tekst.split("\n");
        var odgovara = true;
        for(var i=0;i<redovi.length;i++){
            var aktivnost = redovi[i].split(",");
            if(aktivnostKraj <= aktivnostPocetak || aktivnostPocetak < 8 || aktivnostKraj > 20) odgovara = false;
            else if(((aktivnostPocetak*10)%10 != 0 && (aktivnostPocetak*10)%10 != 5) || ((aktivnostKraj*10)%10 != 0 && (aktivnostKraj*10)%10 != 5)) odgovara = false;
            else if(aktivnostNaziv.toString() == "" || aktivnostTip.toString() == "" || aktivnostDan.toString() == "" || aktivnostPocetak == null || aktivnostKraj == null) odgovara = false;
            else if(aktivnostDan.toString() == aktivnost[4].toString()){
                if ((aktivnostPocetak >= aktivnost[2] && aktivnostKraj <= aktivnost[3]) || (aktivnostPocetak <= aktivnost[2] && aktivnostKraj >= aktivnost[3])) odgovara = false;
                else if(aktivnostPocetak >= aktivnost[2] && aktivnostPocetak < aktivnost[3]) odgovara = false;
                else if(aktivnostKraj >= aktivnost[2] && aktivnostKraj < aktivnost[3]) odgovara = false;
            }
        }
        if(!odgovara){
            var objekat = {message:"Aktivnost nije validna!"};
            res.writeHead(200,{'Content-Type':"application/json"});
            res.end(JSON.stringify(objekat));
        }
        else{
            var aktivnost = aktivnostNaziv + "," + aktivnostTip + "," + aktivnostPocetak + "," + aktivnostKraj + "," + aktivnostDan;
            fs.appendFile('aktivnosti.txt', '\n' + aktivnost, function(error){
                if(error) console.log("a-a");
                else{
                    var objekat = {message:"Uspješno dodana aktivnost!"};
                    res.writeHead(200,{'Content-Type':"application/json"});
                    res.end(JSON.stringify(objekat));
                }
            });
        }
    });
});

const removeLines = (data, lines = []) => {
    return data
        .split('\n')
        .filter((val, idx) => lines.indexOf(idx) === -1)
        .join('\n');
}

app.delete("/aktivnost/:naziv", function(req, res){
    const nazivAktivnosti = req.params.naziv;
    fs.readFile(__dirname + "/aktivnosti.txt",function(err,data){
        var n=[];
        var tekst=data.toString();
        var redovi=tekst.split("\r\n");
        for(var i=0;i<redovi.length;i++){
            var aktivnosti=redovi[i].split(",");
            if(aktivnosti[0] == nazivAktivnosti){
                n.push(i);
            }
        }
        if(n.length == 0){
            var objekat = {message:"Greška - aktivnost nije obrisana!"};
            res.writeHead(200,{'Content-Type':"application/json"});
            res.end(JSON.stringify(objekat));
        }
        else{
            fs.writeFile(__dirname + "/aktivnosti.txt", removeLines(tekst, n), function(error){
                if(error){
                    var objekat = {message:"Greška - aktivnost nije obrisana!"};
                    res.writeHead(200,{'Content-Type':"application/json"});
                    res.end(JSON.stringify(objekat));
                }
                else{
                    var objekat = {message:"Uspješno obrisana aktivnost!"};
                    res.writeHead(200,{'Content-Type':"application/json"});
                    res.end(JSON.stringify(objekat));
                }
            });
        }
    });
});

app.delete("/predmet/:naziv", function(req, res){
    const nazivPredmeta = req.params.naziv;
    fs.readFile(__dirname + "/predmeti.txt",function(err,data){
        var n=[];
        var tekst=data.toString();
        var redovi=tekst.split("\n");
        for(var i=0;i<redovi.length;i++){
            if(redovi[i] == nazivPredmeta){
                n.push(i);
            }
        }
        if(n.length == 0){
            var objekat = {message:"Greška - predmet nije obrisan!"};
            res.writeHead(200,{'Content-Type':"application/json"});
            res.end(JSON.stringify(objekat));
        }
        else{
            fs.writeFile(__dirname + "/predmeti.txt", removeLines(tekst, n), function(error){
                if(error){
                    var objekat = {message:"Greška - predmet nije obrisan!"};
                    res.writeHead(200,{'Content-Type':"application/json"});
                    res.end(JSON.stringify(objekat));
                }
                else{
                    var objekat = {message:"Uspješno obrisan predmet!"};
                    res.writeHead(200,{'Content-Type':"application/json"});
                    res.end(JSON.stringify(objekat));
                }
            });
        }
    });
});

app.delete("/all", function(req, res){
    fs.writeFile(__dirname + "/predmeti.txt", "",function(err,data){
        if(err){
            var objekat = {message:"Greška - sadržaj datoteka nije moguće obrisati!"};
            res.writeHead(200,{'Content-Type':"application/json"});
            res.end(JSON.stringify(objekat));
        }
        else{
            fs.writeFile(__dirname + "/aktivnosti.txt", "",function(err2,data2){
                if(err2) {
                    var objekat = {message:"Greška - sadržaj datoteka nije moguće obrisati!"};
                    res.writeHead(200,{'Content-Type':"application/json"});
                    res.end(JSON.stringify(objekat));
                }
                else{
                    var objekat = {message:"Uspješno obrisan sadržaj datoteka!"};
                    res.writeHead(200,{'Content-Type':"application/json"});
                    res.end(JSON.stringify(objekat));
                }
            });
        }
    });
});

module.exports = app;
app.listen(3000);