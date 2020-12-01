let assert = chai.assert;
let okvir2 = document.getElementById("okvir1");
describe('raspored', function() {
    describe('iscrtajRaspored()', function(){
        it('trebalo bi nacrtati 6 redova ako je zadano 5 dana jer jedan red predstavljaju vremena', function(){
            raspored.iscrtajRaspored(okvir2,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],8,21);
            assert.equal(okvir2.querySelector("#tabela1").getElementsByTagName("tr").length, 6, "Broj redova treba biti 6");
        });
        it('trebalo bi nacrtati 5 redova ako su zadana 4 dana jer jedan red predstavljaju vremena', function(){
            raspored.iscrtajRaspored(okvir2,["Ponedjeljak","Utorak","Srijeda","Četvrtak"],8,21);
            assert.equal(okvir2.querySelector("#tabela1").getElementsByTagName("tr").length, 5, "Broj redova treba biti 5");
        });
        it('trebali bi dobiti error jer vremena nisu validna, tj krajnje manje od pocetnog', function(){
            raspored.iscrtajRaspored(okvir2,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],18,10);
            assert.equal(okvir2.innerHTML, "Greska!", "Sadrzaj diva samo treba biti 'Greska!'");
        });
        it('trebali bi dobiti error jer vremena nisu validna, tj nisu cijeli brojevi', function(){
            raspored.iscrtajRaspored(okvir2,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],9.5,12);
            assert.equal(okvir2.innerHTML, "Greska!", "Sadrzaj diva samo treba biti 'Greska!'");
        });
        it('trebali bi dobiti error jer vremena nisu validna, tj veci broj od 24', function(){
            raspored.iscrtajRaspored(okvir2,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],9,27);
            assert.equal(okvir2.innerHTML, "Greska!", "Sadrzaj diva samo treba biti 'Greska!'");
        });
    });
    //raspored.iscrtajRaspored(okvir2,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],8,21);
    describe('dodajAktivnost()', function(){
        it('greska jer zelimo da pristupimo 25. i 26. satu', function(){
            raspored.iscrtajRaspored(okvir2,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],8,21);
            let odgovor = raspored.dodajAktivnost(okvir1,"WT","predavanje",25,26,"Ponedjeljak");
            assert.equal(odgovor, "Greška - u rasporedu ne postoji dan ili vrijeme u kojem pokušavate dodati termin", "Dobar odgovor!");
        });
        it('greska ako vremena ne zavrsavaju na .0 ili .5', function(){
            let odgovor = raspored.dodajAktivnost(okvir1,"WT","predavanje",10.4,12.28637,"Ponedjeljak");
            assert.equal(odgovor, "Greška - u rasporedu ne postoji dan ili vrijeme u kojem pokušavate dodati termin", "Dobar odgovor!");
        });
        it('trebali bismo dobiti WT predavanje u periodu od 9 do 12', function(){
            raspored.dodajAktivnost(okvir2,"WT","predavanje",9,12,"Ponedjeljak");
            let tempKolona = document.createElement("TD");
            tempKolona.setAttribute("id", "predavanje");
            tempKolona.setAttribute("class", "sat90");
            tempKolona.setAttribute("colspan", 6);
            tempKolona.innerHTML = "<h4>WT</h4><p>predavanje</p>";
            let string1 = okvir2.querySelector("#tabela1").getElementsByTagName("tr")[1].cells[3].getAttribute("id")+okvir2.querySelector("#tabela1").getElementsByTagName("tr")[1].cells[3].getAttribute("class")+okvir2.querySelector("#tabela1").getElementsByTagName("tr")[1].cells[3].getAttribute("colspan")+okvir2.querySelector("#tabela1").getElementsByTagName("tr")[1].cells[3].innerHTML;
            let string2 = tempKolona.getAttribute("id")+tempKolona.getAttribute("class")+tempKolona.getAttribute("colspan")+tempKolona.innerHTML;
            assert.equal(string1, string2, "Odgovarajuca celija!");
        });
        it('trebali bismo dobiti DM tutorijal u periodu od 12 do 14:30', function(){
            raspored.dodajAktivnost(okvir2,"DM","tutorijal",12,14.5,"Utorak");
            let tempKolona = document.createElement("TD");
            tempKolona.setAttribute("id", "tutorijal");
            tempKolona.setAttribute("class", "sat120");
            tempKolona.setAttribute("colspan", 5);
            tempKolona.innerHTML = "<h4>DM</h4><p>tutorijal</p>";
            let string1 = okvir2.querySelector("#tabela1").getElementsByTagName("tr")[2].cells[9].getAttribute("id")+okvir2.querySelector("#tabela1").getElementsByTagName("tr")[2].cells[9].getAttribute("class")+okvir2.querySelector("#tabela1").getElementsByTagName("tr")[2].cells[9].getAttribute("colspan")+okvir2.querySelector("#tabela1").getElementsByTagName("tr")[2].cells[9].innerHTML;
            let string2 = tempKolona.getAttribute("id")+tempKolona.getAttribute("class")+tempKolona.getAttribute("colspan")+tempKolona.innerHTML;
            assert.equal(string1, string2, "Odgovarajuca celija!");
        });
        it('trebali bismo dobiti gresku zbog preklapanja termina', function(){
            let odgovor = raspored.dodajAktivnost(okvir2,"DM","predavanje",13,14,"Utorak");
            assert.equal(odgovor, "Greška - već postoji termin u rasporedu u zadanom vremenu", "Dobar odgovor jer se preklapaju termini!");
        });   
    });
});