const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const db = require('./db.js');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public_html'));

db.sequelize.sync();

function postojiStudent(ime, indeks){
    return new Promise(resolve => {
        var returnMessage = 0;
        db.student.findAll().then(function(data){
            for(var i = 0; i<data.length; i++){
                //console.log("Index u bazi: " + data[i].index.toString() + "\nIndex poslan: " + indeks);
                if(data[i].index.toString() === indeks){
                    returnMessage = {
                        message: "Student " + ime + " nije kreiran jer postoji student " + data[i].ime.toString() + " sa istim indexom " + indeks
                    };
                    break;
                }
            }
            resolve(returnMessage);
        });
    });
}

function postojiPredmet(ime){
    return new Promise(resolve => {
        var returnMessage = 0;
        db.predmet.findAll().then(function(data){
            for(var i = 0; i<data.length; i++){
                if(data[i].naziv.toString() === ime){
                    returnMessage = {
                        message: "Predmet " + ime + " nije kreiran jer vec postoji"
                    };
                    break;
                }
            }
            resolve(returnMessage);
        });
    });
}

function postojiGrupa(ime){
    return new Promise(resolve => {
        var returnMessage = 0;
        db.grupa.findAll().then(function(data){
            for(var i = 0; i<data.length; i++){
                if(data[i].naziv.toString() === ime){
                    returnMessage = {
                        message: "Grupa " + ime + " nije kreirana jer vec postoji"
                    };
                    break;
                }
            }
            resolve(returnMessage);
        });
    });
}

//postojiAktivnost

function postojiDan(ime){
    return new Promise(resolve => {
        var returnMessage = 0;
        db.dan.findAll().then(function(data){
            for(var i = 0; i<data.length; i++){
                if(data[i].naziv.toString() === ime){
                    returnMessage = {
                        message: "Dan " + ime + " nije kreiran jer vec postoji"
                    };
                    break;
                }
            }
            resolve(returnMessage);
        });
    });
}

function postojiTip(ime){
    return new Promise(resolve => {
        var returnMessage = 0;
        db.tip.findAll().then(function(data){
            for(var i = 0; i<data.length; i++){
                if(data[i].naziv.toString() === ime){
                    returnMessage = {
                        message: "Tip " + ime + " nije kreiran jer vec postoji"
                    };
                    break;
                }
            }
            resolve(returnMessage);
        });
    });
}

app.post("/v2/student", async function(req, res){
    var postoji = await postojiStudent(req.body.ime, req.body.index);
    if(postoji !== 0){
        res.writeHead(200,{'Content-Type':"application/json"});
        res.end(JSON.stringify(postoji));
    }
    else{
        var studentiListaPromisea=[];
        new Promise(function(resolve, reject){
            studentiListaPromisea.push(db.student.create({ime:req.body.ime,index:req.body.index}));
            Promise.all(studentiListaPromisea).then(function(data){
                db.grupa.findOne({where:{id:req.body.grupaId}}).then(function(data1){
                    data[0].setGrupa(data1);
                })
                return new Promise(function(resolve,reject){resolve(data[0]);});
            });
        });
        res.writeHead(200,{'Content-Type':"application/json"});
        res.end(JSON.stringify({message: "Uspjesno unesen student " + req.body.ime}));
    }
});
app.post("/v2/predmet", async function(req, res){
    var postoji = await postojiPredmet(req.body.naziv);
    if(postoji !== 0){
        res.writeHead(200,{'Content-Type':"application/json"});
        res.end(JSON.stringify(postoji));
    }
    else{
        var predmetiListaPromisea=[];
        new Promise(function(resolve, reject){
            predmetiListaPromisea.push(db.predmet.create({naziv:req.body.naziv}));
        });
        res.writeHead(200,{'Content-Type':"application/json"});
        res.end(JSON.stringify({message: "Uspjesno unesen predmet " + req.body.naziv}));
    }
});
app.post("/v2/grupa", async function(req, res){
    var postoji = await postojiGrupa(req.body.naziv);
    if(postoji !== 0){
        res.writeHead(200,{'Content-Type':"application/json"});
        res.end(JSON.stringify(postoji));
    }
    else{
        var grupeListaPromisea=[];
        var litaStudenata = req.body.students;
        new Promise(function(resolve, reject){
            grupeListaPromisea.push(db.grupa.create({naziv:req.body.naziv, predmetId:req.body.predmetId}));
            Promise.all(grupeListaPromisea).then(function(data){
                for(var i = 0; i < litaStudenata.length; i++){
                    db.student.findOne({where:{id:litaStudenata[i]}}).then(function(data1){
                        data1.setGrupa(data[0]);
                    });
                }
                return new Promise(function(resolve,reject){resolve(data[0]);});
            });
        });
        res.writeHead(200,{'Content-Type':"application/json"});
        res.end(JSON.stringify({message: "Uspjesno unesena grupa " + req.body.naziv}));
    }
});
app.post("/v2/aktivnost", function(req, res){
    var aktivnostiListaPromisea=[];
    new Promise(function(resolve, reject){
        aktivnostiListaPromisea.push(db.aktivnost.create({naziv:req.body.naziv,pocetak:req.body.pocetak,kraj:req.body.kraj, predmetId:req.body.predmetId, grupaId:req.body.grupaId}));
    });
    res.end();
});
app.post("/v2/dan", async function(req, res){
    var postoji = await postojiDan(req.body.naziv);
    if(postoji !== 0){
        res.writeHead(200,{'Content-Type':"application/json"});
        res.end(JSON.stringify(postoji));
    }
    else{
        var daniListaPromisea=[];
        new Promise(function(resolve, reject){
            daniListaPromisea.push(db.dan.create({naziv:req.body.naziv, aktivnostId:req.body.aktivnostId}));
        });
        res.writeHead(200,{'Content-Type':"application/json"});
        res.end(JSON.stringify({message: "Uspjesno unesen dan " + req.body.naziv}));
    }
});
app.post("/v2/tip", async function(req, res){
    var postoji = await postojiTip(req.body.naziv);
    if(postoji !== 0){
        res.writeHead(200,{'Content-Type':"application/json"});
        res.end(JSON.stringify(postoji));
    }
    else{
        var tipoviListaPromisea=[];
        new Promise(function(resolve, reject){
            tipoviListaPromisea.push(db.tip.create({naziv:req.body.naziv, aktivnostId:req.body.aktivnostId}));
        });
        res.writeHead(200,{'Content-Type':"application/json"});
        res.end(JSON.stringify({message: "Uspjesno unesen tip " + req.body.naziv}));
    }
});
app.get("/v2/student", function(req, res){
    var objekat;
    var podaci = [];
    db.student.findAll().then(function(data){
        for(var i = 0; i<data.length; i++){
            objekat = {
                id: data[i].id,
                ime: data[i].ime,
                index: data[i].index
            };
            podaci.push(objekat);
        }
        res.writeHead(200,{'Content-Type':"application/json"});
        res.end(JSON.stringify(podaci));
    });
});
app.get("/v2/predmet", function(req, res){
    db.predmet.findAll().then(function(data){
        var podaci = [];
        for(var i = 0; i<data.length; i++){
            var objekat = {
                id: data[i].id,
                naziv: data[i].naziv
            };
            podaci.push(objekat);
        }
        res.writeHead(200,{'Content-Type':"application/json"});
        res.end(JSON.stringify(podaci));
    });
});
app.get("/v2/grupa", function(req, res){
    db.grupa.findAll().then(function(data){
        var podaci = [];
        for(var i = 0; i<data.length; i++){
            var objekat = {
                id: data[i].id,
                naziv: data[i].naziv,
                predmetGrupa: data[i].predmetGrupa
            };
            podaci.push(objekat);
        }
        res.writeHead(200,{'Content-Type':"application/json"});
        res.end(JSON.stringify(podaci));
    });
});
app.get("/v2/aktivnost", function(req, res){
    db.aktivnost.findAll().then(function(data){
        var podaci = [];
        for(var i = 0; i<data.length; i++){
            var objekat = {
                id: data[i].id,
                naziv: data[i].naziv,
                pocetak: data[i].pocetak,
                kraj: data[i].kraj,
                predmetAktivnost: data[i].predmetAktivnost
            };
            podaci.push(objekat);
        }
        res.writeHead(200,{'Content-Type':"application/json"});
        res.end(JSON.stringify(podaci));
    });
});
app.get("/v2/dan", function(req, res){
    db.dan.findAll().then(function(data){
        var podaci = [];
        for(var i = 0; i<data.length; i++){
            var objekat = {
                id: data[i].id,
                naziv: data[i].naziv,
                aktivnostDan: data[i].aktivnostDan
            };
            podaci.push(objekat);
        }
        res.writeHead(200,{'Content-Type':"application/json"});
        res.end(JSON.stringify(podaci));
    });
});
app.get("/v2/tip", function(req, res){
    db.tip.findAll().then(function(data){
        var podaci = [];
        for(var i = 0; i<data.length; i++){
            var objekat = {
                id: data[i].id,
                naziv: data[i].naziv,
                aktivnostTip: data[i].aktivnostTip
            };
            podaci.push(objekat);
        }
        res.writeHead(200,{'Content-Type':"application/json"});
        res.end(JSON.stringify(podaci));
    });
});

////////////////////////




app.get("/v2/student/:id", function(req, res){

    db.student.findById(req.params.id).then(function(data){
        var objekat;
        if(data == null){
            objekat = {
                message: "Ne postoji korisnik"
            };
            res.writeHead(404,{'Content-Type':"application/json"});
        }
        else{
            objekat = {
                id: data.id,
                ime: data.ime,
                index: data.index
            };
            res.writeHead(200,{'Content-Type':"application/json"});
        }
        res.end(JSON.stringify(objekat));
    });
});

app.get("/v2/predmet/:id", function(req, res){
    db.predmet.findById(req.params.id).then(function(data){
        var objekat;
        if(data == null){
            objekat = {
                message: "Ne postoji predmet"
            };
            res.writeHead(404,{'Content-Type':"application/json"});
        }
        else{
            objekat = {
                id: data.id,
                naziv: data.naziv
            };
            res.writeHead(200,{'Content-Type':"application/json"});
        }
        res.end(JSON.stringify(objekat));
    });
});
app.get("/v2/grupa/:id", function(req, res){
    db.grupa.findById(req.params.id).then(function(data){
        var objekat;
        if(data == null){
            objekat = {
                message: "Ne postoji grupa"
            };
            res.writeHead(404,{'Content-Type':"application/json"});
        }
        else{
            objekat = {
                id: data.id,
                naziv: data.naziv,
                predmetId: data.predmetId
            };
            res.writeHead(200,{'Content-Type':"application/json"});
        }
        res.end(JSON.stringify(objekat));
    });
});
app.get("/v2/aktivnost/:id", function(req, res){
    db.aktivnost.findById(req.params.id).then(function(data){
        var objekat;
        if(data == null){
            objekat = {
                message: "Ne postoji aktivnost"
            };
            res.writeHead(404,{'Content-Type':"application/json"});
        }
        else{
            objekat = {
                id: data.id,
                naziv: data.naziv,
                pocetak: data.pocetak,
                kraj: data.kraj,
                predmetId: data.predmetId
            };
            res.writeHead(200,{'Content-Type':"application/json"});
        }
        res.end(JSON.stringify(objekat));
    });
});
app.get("/v2/dan/:id", function(req, res){
    db.dan.findById(req.params.id).then(function(data){
        var objekat;
        if(data == null){
            objekat = {
                message: "Ne postoji dan"
            };
            res.writeHead(404,{'Content-Type':"application/json"});
        }
        else{
            objekat = {
                id: data.id,
                naziv: data.naziv,
                aktivnostId: data.aktivnostId
            };
            res.writeHead(200,{'Content-Type':"application/json"});
        }
        res.end(JSON.stringify(objekat));
    });
});
app.get("/v2/tip/:id", function(req, res){
    db.tip.findById(req.params.id).then(function(data){
        var objekat;
        if(data == null){
            objekat = {
                message: "Ne postoji tip"
            };
            res.writeHead(404,{'Content-Type':"application/json"});
        }
        else{
            objekat = {
                id: data.id,
                naziv: data.naziv,
                aktivnostId: data.aktivnostId
            };
            res.writeHead(200,{'Content-Type':"application/json"});
        }
        res.end(JSON.stringify(objekat));
    });
});

///////////////////////////////////////////////////


app.delete("/v2/student/:id", function(req, res){
    db.student.destroy({
        where: {id:req.params.id}
    }).then(izbrisan=>{
        if(izbrisan === 0){
            res.writeHead(404,{'Content-Type':"application/json"});
            res.end(JSON.stringify({message:"Student s id-em " + req.params.id + " ne postoji"}));
        }
        else{
            res.writeHead(200,{'Content-Type':"application/json"});
            res.end(JSON.stringify({message:"Uspjesno izbrisan student"}));
        }
    });
});
app.delete("/v2/aktivnost/:id", function(req, res){
    db.aktivnost.destroy({
        where: {id:req.params.id}
    }).then(izbrisan=>{
        if(izbrisan === 0){
            res.writeHead(404,{'Content-Type':"application/json"});
            res.end(JSON.stringify({message:"Aktivnost s id-em " + req.params.id + " ne postoji"}));
        }
        else{
            res.writeHead(200,{'Content-Type':"application/json"});
            res.end(JSON.stringify({message:"Uspjesno izbrisana aktivnost"}));
        }
    });
});
app.delete("/v2/dan/:id", function(req, res){
    db.dan.destroy({
        where: {id:req.params.id}
    }).then(izbrisan=>{
        if(izbrisan === 0){
            res.writeHead(404,{'Content-Type':"application/json"});
            res.end(JSON.stringify({message:"Dan s id-em " + req.params.id + " ne postoji"}));
        }
        else{
            res.writeHead(200,{'Content-Type':"application/json"});
            res.end(JSON.stringify({message:"Uspjesno izbrisan dan"}));
        }
    });
});
app.delete("/v2/grupa/:id", function(req, res){
    db.grupa.destroy({
        where: {id:req.params.id}
    }).then(izbrisan=>{
        if(izbrisan === 0){
            res.writeHead(404,{'Content-Type':"application/json"});
            res.end(JSON.stringify({message:"Grupa s id-em " + req.params.id + " ne postoji"}));
        }
        else{
            res.writeHead(200,{'Content-Type':"application/json"});
            res.end(JSON.stringify({message:"Uspjesno izbrisana grupa"}));
        }
    });
});
app.delete("/v2/predmet/:id", function(req, res){
    db.predmet.destroy({
        where: {id:req.params.id}
    }).then(izbrisan=>{
        if(izbrisan === 0){
            res.writeHead(404,{'Content-Type':"application/json"});
            res.end(JSON.stringify({message:"Predmet s id-em " + req.params.id + " ne postoji"}));
        }
        else{
            res.writeHead(200,{'Content-Type':"application/json"});
            res.end(JSON.stringify({message:"Uspjesno izbrisan predmet"}));
        }
    });
});
app.delete("/v2/tip/:id", function(req, res){
    db.tip.destroy({
        where: {id:req.params.id}
    }).then(()=>{
        if(izbrisan === 0){
            res.writeHead(404,{'Content-Type':"application/json"});
            res.end(JSON.stringify({message:"Tip s id-em " + req.params.id + " ne postoji"}));
        }
        else{
            res.writeHead(200,{'Content-Type':"application/json"});
            res.end(JSON.stringify({message:"Uspjesno izbrisan tip"}));
        }
    });
});

///////////////////////////////////

app.put("/v2/student/:id", async function(req,res){
    var postoji = await postojiStudent(req.body.ime, req.body.index);
    if(postoji !== 0){
        res.writeHead(200,{'Content-Type':"application/json"});
        res.end(JSON.stringify(postoji));
    }
    else{
        db.student.update({
            ime: req.body.ime,
            index: req.body.index
        }, {
            where: { id: req.params.id },
            returning: true,
            plain: true
        });
        res.writeHead(200,{'Content-Type':"application/json"});
        res.end(JSON.stringify({message:"Uspjesno azuriran student " + req.body.ime}));
    }
});

app.put("/v2/aktivnost/:id", async function(req,res){
    db.aktivnost.update({
        naziv: req.body.naziv,
        pocetak: req.body.pocetak,
        kraj:req.body.kraj
    }, {
        where: { id: req.params.id },
        returning: true,
        plain: true
    });
    res.end();
    //treba vratiti apdejtovan objekat
});
app.put("/v2/dan/:id", async function(req,res){
    var postoji = await postojiDan(req.body.naziv);
    if(postoji !== 0){
        res.writeHead(200,{'Content-Type':"application/json"});
        res.end(JSON.stringify(postoji));
    }
    else{
        db.dan.update({
            naziv: req.body.naziv
        }, {
            where: { id: req.params.id },
            returning: true,
            plain: true
        });
        res.writeHead(200,{'Content-Type':"application/json"});
        res.end(JSON.stringify({message:"Uspjesno azuriran dan " + req.body.naziv}));
    }
    //then funkcija treba vratiti apdejtovan objekat
});
app.put("/v2/grupa/:id", async function(req,res){
    var postoji = await postojiGrupa(req.body.naziv);
    if(postoji !== 0){
        res.writeHead(200,{'Content-Type':"application/json"});
        res.end(JSON.stringify(postoji));
    }
    else{
        db.grupa.update({
            naziv: req.body.naziv
        }, {
            where: { id: req.params.id },
            returning: true,
            plain: true
        });
        res.writeHead(200,{'Content-Type':"application/json"});
        res.end(JSON.stringify({message:"Uspjesno azurirana grupa " + req.body.naziv}));
    }
    //then funkcija treba vratiti apdejtovan objekat
});
app.put("/v2/predmet/:id", async function(req,res){
    var postoji = await postojiPredmet(req.body.naziv);
    if(postoji !== 0){
        res.writeHead(200,{'Content-Type':"application/json"});
        res.end(JSON.stringify(postoji));
    }
    else{
        db.predmet.update({
            naziv: req.body.naziv
        }, {
            where: { id: req.params.id },
            returning: true,
            plain: true
        });
        res.writeHead(200,{'Content-Type':"application/json"});
        res.end(JSON.stringify({message: "Uspjesno azuriran predmet " + req.body.naziv}));
    }
    //then funkcija treba vratiti apdejtovan objekat
});
app.put("/v2/tip/:id", async function(req,res){
    var postoji = await postojiTip(req.body.naziv);
    if(postoji !== 0){
        res.writeHead(200,{'Content-Type':"application/json"});
        res.end(JSON.stringify(postoji));
    }
    else{
        db.tip.update({
            naziv: req.body.naziv
        }, {
            where: { id: req.params.id },
            returning: true,
            plain: true
        });
        res.writeHead(200,{'Content-Type':"application/json"});
        res.end(JSON.stringify({message: "Uspjesno azuriran tip " + req.body.naziv}));
    }
});


app.get("/", function(req, res){
    res.sendFile(__dirname + "/public_html/studenti.html");
});

app.get("/v1/predmeti", function(req, res){
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

app.get("/v1/aktivnosti", function(req, res){
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

app.get("/v1/predmet/:naziv/aktivnost", function(req, res){
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

app.post("/v1/predmet", function(req, res){
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

app.post("/v1/aktivnost", function(req, res){
    const aktivnostNaziv = req.body.naziv;
    const aktivnostTip = req.body.tip;
    const aktivnostPocetak = req.body.pocetak;
    const aktivnostKraj = req.body.kraj;
    const aktivnostDan = req.body.dan;
    fs.readFile(__dirname + "/aktivnosti.txt",function(err,data){
        var n=[];
        var tekst=data.toString();
        var redovi=tekst.split("\n");
        var odgovara = true;
        for(var i=0;i<redovi.length;i++){
            var aktivnost = redovi[i].split(",");
            if(aktivnostKraj <= aktivnostPocetak || aktivnostPocetak < 8 || aktivnostKraj > 20) odgovara = false;
            else if(((aktivnostPocetak*10)%10 != 0 && (aktivnostPocetak*10)%10 != 5) || ((aktivnostKraj*10)%10 != 0 && (aktivnostKraj*10)%10 != 5)) odgovara = false;
            else if(aktivnostNaziv == "" || aktivnostTip == "" || aktivnostDan == "" || aktivnostPocetak == null || aktivnostKraj == null) odgovara = false;
            else if(aktivnostDan == aktivnost[4]){
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
            if(data != "") aktivnost = '\n'+aktivnost;
            fs.appendFile('aktivnosti.txt', aktivnost, function(error){
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

app.delete("/v1/aktivnost/:naziv", function(req, res){
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

app.delete("/v1/predmet/:naziv", function(req, res){
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

app.delete("/v1/all", function(req, res){
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