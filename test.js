const supertest = require("supertest");
const assert = require("assert");
const fs = require("fs");
const app = require("./index");

function testiranje(){
    fs.readFile(__dirname + "/testovi.txt", function(err,data){
        var tekst=data.toString();
        var redovi=tekst.split("\n");
        for(var i=0;i<redovi.length;i++){
            var poziv=redovi[i].split(";");
            if(poziv[0].includes("GET")){
                if(poziv[1].includes("predmeti")){
                    describe("GET/predmeti", function(){
                        it("Provjeravamo da li su svi predmeti vraceni", function(done){
                            supertest(app).get(poziv[1]).expect([
                                poziv[3]
                            ]).end(function(err, res){
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
    });
}

testiranje();