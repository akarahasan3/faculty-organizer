const supertest = require("supertest");
const assert = require("assert");
const fs = require("fs");
const app = require("./index");

describe("Svi testovi", function(){
    it("stydhilvu", function(done){
        fs.readFile(__dirname + "/testovi.txt", function(err,data){
            var tekst=data.toString();
            var redovi=tekst.split("\r\n");
            redovi.forEach(function(poziv, index){
                console.log(poziv);
                poziv=poziv.split(";");
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
                                    //done1;
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
                                    //done1;
                                });
                                //done1();
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
                                    //done1;
                                });
                                //done1();
                            });
                        });
                    }
                }
                else if(poziv[0].includes("POST")){
                    if(poziv[1].includes("predmet")){
                        describe("POST" + poziv[1], function(){
                            it("Provjeravamo da li se dodaje odredjeni predmet", function(done1){
                                console.log("ispisujem poziv "+ poziv[1] + " i api " + poziv[0]);
                                console.log("ispisujem poziv2222 "+ poziv[2]);
                                supertest(app).post(poziv[1]).send(JSON.parse(poziv[2])).expect(
                                    poziv[3]
                                ).end(function(err, res){
                                    if(err) done1(err);
                                    //done1;
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
                                    //done1;
                                });
                                //done1();
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
                                    //done1;
                                });
                                //done1();
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
                                    //done1;
                                });
                                //done1();
                            });
                        });
                    }
                    else if(poziv[1].includes("all")){
                        describe("DELETE" + poziv[1], function(){
                            console.log("Evo me u delete all konacno");
                            it("Provjeravamo da li se brise sve", function(done1){
                                this.timeout(10000);
                                console.log("ispisujem poziv "+ poziv[1] + " i api " + poziv[0]);
                                supertest(app).del(poziv[1]).expect(
                                    poziv[3]
                                ).end(function(err, res){
                                    if(err) done1(err);
                                    //done1;
                                });
                                done1();
                            });
                        });
                    }
                }
            });
            done();
        });
    });
});

/* function funkcija2(){
    fs.readFile(__dirname + "/testovi.txt", function(err,data){
        var tekst=data.toString();
        var redovi=tekst.split("\n");
        describe("Testovi", function(){
            it("idu horde", function(){
            redovi.forEach(function(poziv, Index){
                console.log(poziv);
                poziv=poziv.split(";");
                it("test1", function(){
                    console.log(poziv);
                });
                if(poziv[0].includes("GET")){
                    if(poziv[1].includes("predmeti")){
                        console.log("Evo me u ifu za getanje predmete!");
                        //describe("GET/predmeti", function(){
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
                        //});
                    }
                    else if(poziv[1].includes("aktivnosti")){
                        //describe("GET/aktivnosti", function(){
                            it("Provjeravamo da li su sve aktivnosti vracene", function(done1){
                                supertest(app).get(poziv[1]).expect([
                                    poziv[3]
                                ]).end(function(err, res){
                                    if(err) done1(err);
                                    done1;
                                });
                                done1();
                            });
                        //});
                    }
                    else if(poziv[1].includes("predmet")){
                        //describe("GET" + poziv[1], function(){
                            it("Provjeravamo da li su vracene sve aktivnosti za predmet odredjeni predmet", function(done1){
                                supertest(app).get(poziv[1]).expect([
                                    poziv[3]
                                ]).end(function(err, res){
                                    if(err) done1(err);
                                    done1;
                                });
                                done1();
                            });
                        //});
                    }
                }
                else if(poziv[0].includes("POST")){
                    if(poziv[1].includes("predmet")){
                        //describe("POST" + poziv[1], function(){
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
                        //});
                    }
                    if(poziv[1].includes("aktivnost")){
                        //describe("POST" + poziv[1], function(){
                            it("Provjeravamo da li se dodaje odredjena aktivnost", function(done1){
                                supertest(app).post(poziv[1]).send(poziv[2]).expect([
                                    poziv[3]
                                ]).end(function(err, res){
                                    if(err) done1(err);
                                    done1;
                                });
                                done1();
                            });
                        //});
                    }
                }
                else if(poziv[0].includes("DELETE")){
                    if(poziv[1].includes("predmet")){
                        //describe("DELETE" + poziv[1], function(){
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
                        //});
                    }
                    else if(poziv[1].includes("aktivnost")){
                        //describe("DELETE" + poziv[1], function(){
                            it("Provjeravamo da li se brise odredjena aktivnost", function(done1){
                                supertest(app).del(poziv[1]).expect([
                                    poziv[3]
                                ]).end(function(err, res){
                                    if(err) done1(err);
                                    done1;
                                });
                                done1();
                            });
                        //});
                    }
                    else if(poziv[1] == "/all"){
                        //describe("DELETE" + poziv[1], function(){
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
                        //});
                    }
                }
            });
        });
        });
    }); 
} */

//funkcija2();