const supertest = require("supertest");
const assert = require("assert");
const fs = require("fs");
const app = require("./index");


/* describe("GET/osoblje", function() {
    for(int i=0; i<1;i++)
    it("Provjera da li je vraceno svo osoblje", function(done) {
      supertest(app)
        .get("/osoblje")
        .expect([
          {"id":1,"ime":"Neko","prezime":"Nekic","uloga":"profesor"},
          {"id":2,"ime":"Drugi","prezime":"Neko","uloga":"asistent"},
          {"id":3,"ime":"Test","prezime":"Test","uloga":"asistent"}])
        .end(function(err, res) {
          if (err) done(err);
          done();
        });  
    });
  }); */


describe("Svi testovi", function(){
    it("stydhilvu", function(done){
        fs.readFile(__dirname + "/testovi.txt", function(err,data){
            var tekst=data.toString();
            var redovi=tekst.split("\n");
            for(var i=0;i<redovi.length;i++){
                var poziv=redovi[i].split(";");
                console.log(poziv[0]);
                console.log(poziv[1]);
                if(poziv[0].includes("GET")){
                    if(poziv[1].includes("predmeti")){
                        console.log("Evo me u ifu za getanje predmete!");
                        describe("GET/predmeti", function(){
                            console.log("Evo me u describeu za predmete!");
                            it("Provjeravamo da li su svi predmeti vraceni", function(done1){
                                console.log("ispisujem poziv "+ poziv[1] + " i api " + poziv[0]);
                                supertest(app).get(poziv[1]).expect(
                                    poziv[3]
                                ).end(function(err, res){
                                    if(err) done1(err);
                                    done1;
                                });
                                done1();
                            });
                        });
                    }
                    else if(poziv[1].includes("aktivnosti")){
                        describe("GET/aktivnosti", function(){
                            it("Provjeravamo da li su sve aktivnosti vracene", function(done1){
                                supertest(app).get(poziv[1]).expect([
                                    poziv[3]
                                ]).end(function(err, res){
                                    if(err) done1(err);
                                    done1;
                                });
                                done1();
                            });
                        });
                    }
                    else if(poziv[1].includes("predmet")){
                        describe("GET" + poziv[1], function(){
                            it("Provjeravamo da li su vracene sve aktivnosti za predmet odredjeni predmet", function(done1){
                                supertest(app).get(poziv[1]).expect([
                                    poziv[3]
                                ]).end(function(err, res){
                                    if(err) done1(err);
                                    done1;
                                });
                                done1();
                            });
                        });
                    }
                }
                else if(poziv[0].includes("POST")){
                    if(poziv[1].includes("predmet")){
                        describe("POST" + poziv[1], function(){
                            it("Provjeravamo da li se dodaje odredjeni predmet", function(done1){
                                console.log("ispisujem poziv "+ poziv[1] + " i api " + poziv[0]);
                                supertest(app).post(poziv[1]).send(poziv[2]).expect([
                                    poziv[3]
                                ]).end(function(err, res){
                                    if(err) done1(err);
                                    done1;
                                });
                                done1();
                            });
                        });
                    }
                    if(poziv[1].includes("aktivnost")){
                        describe("POST" + poziv[1], function(){
                            it("Provjeravamo da li se dodaje odredjena aktivnost", function(done1){
                                supertest(app).post(poziv[1]).send(poziv[2]).expect([
                                    poziv[3]
                                ]).end(function(err, res){
                                    if(err) done1(err);
                                    done1;
                                });
                                done1();
                            });
                        });
                    }
                }
                else if(poziv[0].includes("DELETE")){
                    if(poziv[1].includes("predmet")){
                        describe("DELETE" + poziv[1], function(){
                            console.log("Evo me u delete predmeta bog zna zasto");
                            it("Provjeravamo da li se brise odredjeni predmet", function(done1){
                                supertest(app).del(poziv[1]).expect([
                                    poziv[3]
                                ]).end(function(err, res){
                                    if(err) done1(err);
                                    done1;
                                });
                                done1();
                            });
                        });
                    }
                    else if(poziv[1].includes("aktivnost")){
                        describe("DELETE" + poziv[1], function(){
                            it("Provjeravamo da li se brise odredjena aktivnost", function(done1){
                                supertest(app).del(poziv[1]).expect([
                                    poziv[3]
                                ]).end(function(err, res){
                                    if(err) done1(err);
                                    done1;
                                });
                                done1();
                            });
                        });
                    }
                    else if(poziv[1] == "/all"){
                        describe("DELETE" + poziv[1], function(){
                            console.log("Evo me u delete all konacno");
                            it("Provjeravamo da li se brise sve", function(done1){
                                console.log("ispisujem poziv "+ poziv[1] + " i api " + poziv[0]);
                                supertest(app).del(poziv[1]).expect(
                                    poziv[3]
                                ).end(function(err, res){
                                    if(err) done1(err);
                                    done1;
                                });
                                done1();
                            });
                        });
                    }
                }
            }
        });
    });
});


//DELETE;/all;null;{”message”:”Uspješno obrisan sadržaj datoteka!”}
   /*  fs.readFile(__dirname + "/testovi.txt", function(err,data){
        var tekst=data.toString();
        var redovi=tekst.split("\n");
        for(var i=0;i<redovi.length;i++){
            var poziv=redovi[i].split(";");
            console.log(poziv[0]);
            console.log(poziv[1]);
            if(poziv[0].includes("GET")){
                if(poziv[1].includes("predmeti")){
                    console.log("Evo me u ifu za getanje predmete!");
                    describe("GET/predmeti", function(){
                        console.log("Evo me u describeu za predmete!");
                        it("Provjeravamo da li su svi predmeti vraceni", function(done){
                            console.log("Evo me u getu za predmete!");
                            supertest(app).get(poziv[1]).expect(
                                poziv[3]
                            ).end(function(err, res){
                                if(err) done(err);
                                done;
                            });
                        });
                    });
                }
                else if(poziv[1].includes("aktivnosti")){
                    describe("GET/aktivnosti", function(){
                        it("Provjeravamo da li su sve aktivnosti vracene", function(done){
                            supertest(app).get(poziv[1]).expect([
                                poziv[3]
                            ]).end(function(err, res){
                                if(err) done(err);
                                done;
                            });
                        });
                    });
                }
                else if(poziv[1].includes("predmet")){
                    describe("GET" + poziv[1], function(){
                        it("Provjeravamo da li su vracene sve aktivnosti za predmet odredjeni predmet", function(done){
                            supertest(app).get(poziv[1]).expect([
                                poziv[3]
                            ]).end(function(err, res){
                                if(err) done(err);
                                done;
                            });
                        });
                    });
                }
            }
            if(poziv[0].includes("POST")){
                if(poziv[1].includes("predmet")){
                    describe("POST" + poziv[1], function(){
                        it("Provjeravamo da li se dodaje odredjeni predmet", function(done){
                            supertest(app).post(poziv[1]).send(poziv[2]).expect([
                                poziv[3]
                            ]).end(function(err, res){
                                if(err) done(err);
                                done;
                            });
                        });
                    });
                }
                if(poziv[1].includes("aktivnost")){
                    describe("POST" + poziv[1], function(){
                        it("Provjeravamo da li se dodaje odredjena aktivnost", function(done){
                            supertest(app).post(poziv[1]).send(poziv[2]).expect([
                                poziv[3]
                            ]).end(function(err, res){
                                if(err) done(err);
                                done;
                            });
                        });
                    });
                }
            }
            if(poziv[0].includes("DELETE")){
                if(poziv[1].includes("predmet")){
                    describe("DELETE" + poziv[1], function(){
                        it("Provjeravamo da li se brise odredjeni predmet", function(done){
                            supertest(app).del(poziv[1]).expect([
                                poziv[3]
                            ]).end(function(err, res){
                                if(err) done(err);
                                done;
                            });
                        });
                    });
                }
                if(poziv[1].includes("aktivnost")){
                    describe("DELETE" + poziv[1], function(){
                        it("Provjeravamo da li se brise odredjena aktivnost", function(done){
                            supertest(app).del(poziv[1]).expect([
                                poziv[3]
                            ]).end(function(err, res){
                                if(err) done(err);
                                done;
                            });
                        });
                    });
                }
                if(poziv[1].includes("all")){
                    describe("DELETE" + poziv[1], function(){
                        it("Provjeravamo da li se brise sve", function(done){
                            supertest(app).del(poziv[1]).expect([
                                poziv[3]
                            ]).end(function(err, res){
                                if(err) done(err);
                                done;
                            });
                        });
                    });
                }
            }
        }
    }); */
