let raspored = (function(){
    const iscrtajRaspored = function (div, dani, satPocetak, satKraj){
        div.innerHTML = "";
        if(satPocetak >= satKraj || !Number.isInteger(satKraj) || !Number.isInteger(satPocetak) || satPocetak>24 || satPocetak<0 || satKraj>24 || satKraj<0){
            //var p = document.createElement("P");
            //var t = document.createTextNode("Greška");
            //p.appendChild(t);
            //div.appendChild(p);
            div.innerHTML = "Greska!";
            return;
        }
        var satnice = [0,2,4,6,8,10,12,15,17,19,21,23];
        var tabela = document.createElement("TABLE");
        tabela.setAttribute("id", "tabela1");
        var sat;
        var prviRed = document.createElement("TR");
        tabela.appendChild(prviRed);
        for(sat = satPocetak; sat<satKraj; sat++){
            if(satnice.includes(sat)){
                var kolonaSat = document.createElement("TD");
                var kolonaSatTemp;
                if(sat==15){
                    kolonaSatTemp = document.createElement("TD");
                    kolonaSatTemp.setAttribute("colspan", "2");
                    prviRed.appendChild(kolonaSatTemp);
                }
                kolonaSat.setAttribute("colspan", "2");
                if(sat<10){
                    kolonaSat.innerHTML = "0" + sat + ":00";
                }
                else{
                    kolonaSat.innerHTML = sat + ":00";
                }
                prviRed.appendChild(kolonaSat);
                kolonaSatTemp = document.createElement("TD");
                kolonaSatTemp.setAttribute("colspan", "2");
                prviRed.appendChild(kolonaSatTemp);
            }
        }
        var i, j;
        for(i = 0; i<dani.length; i++){
            var red = document.createElement("TR");
            red.setAttribute("id", dani[i]);
            var kolonaDani = document.createElement("TD");
            kolonaDani.innerHTML = dani[i];
            red.appendChild(kolonaDani)
            for(j=satPocetak; j<satKraj; j+=0.5){
                var kolona = document.createElement("TD");
                kolona.setAttribute("id", "prazan");
                kolona.setAttribute("class", "sat"+j*10);
                red.appendChild(kolona);
            }
            tabela.appendChild(red);
        }
        div.appendChild(tabela);
    }
    
    const dodajAktivnost = function (raspored, naziv, tip, vrijemePocetak, vrijemeKraj, dan){
        if(raspored == null){
            //alert("Greška - raspored nije kreiran");
            return "Greška - raspored nije kreiran";
        }
        if(vrijemePocetak > 24 || vrijemePocetak<0 || vrijemeKraj<0 || vrijemeKraj>24 || ((vrijemePocetak*10)%10 != 0 && (vrijemePocetak*10)%10 != 5) || ((vrijemeKraj*10)%10 != 0 && (vrijemeKraj*10)%10 != 5)){
            //alert("Greška - u rasporedu ne postoji dan ili vrijeme u kojem pokušavate dodati termin");
            return "Greška - u rasporedu ne postoji dan ili vrijeme u kojem pokušavate dodati termin";
        }
        var a = raspored.querySelector("#tabela1");
        var b = document.getElementById(dan).rowIndex;
        var c, i, j;
        var prazan = true;
        var postoji = false;
        for(j = 0; j < a.rows[b].cells.length; j++){
            if(a.rows[b].cells[j].className == "sat"+vrijemePocetak*10){
                for(i = 0; i<(vrijemeKraj-vrijemePocetak)*2; i++){
                    if(a.rows[b].cells[j+i].innerHTML != ""){
                        prazan = false;
                        break;
                    }
                }
                postoji = true;
                break;
            }
        }
        if(postoji == false || prazan == false){
            //alert("Greška - već postoji termin u rasporedu u zadanom vremenu");
            return "Greška - već postoji termin u rasporedu u zadanom vremenu";
        }
        var sirina = parseInt((vrijemeKraj-vrijemePocetak)*2);
        var naslov = document.createElement("H4");
        var nastava = document.createElement("P");
        naslov.innerHTML = naziv;
        nastava.innerHTML = tip;
        for(i = 0; i < a.rows[b].cells.length; i++){
            if(a.rows[b].cells[i].className == "sat"+(vrijemePocetak*10).toString()){
                c = a.rows[b].cells[i];
            }
        }
        var j;
        for(j = 0; j < a.rows[b].cells.length; j++){
            if(a.rows[b].cells[j].className == "sat"+vrijemePocetak*10){
                for(i = 1; i<(vrijemeKraj-vrijemePocetak)*2; i++){
                    var celija = a.rows[b].cells[j+1];
                    celija.remove();
                }
                break;
            }
        }
        c.setAttribute("colspan", sirina.toString());
        c.setAttribute("id", tip);
        c.appendChild(naslov);
        c.appendChild(nastava);
    }
    return{
        iscrtajRaspored: iscrtajRaspored,
        dodajAktivnost: dodajAktivnost
    }
}());

//let okvir1 = document.getElementById("okvir1");
//raspored.iscrtajRaspored(okvir1,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],8,21);
//raspored.dodajAktivnost(okvir1,"WT","predavanje",9,12,"Ponedjeljak");
//raspored.dodajAktivnost(okvir1,"WT","tutorijal",12,13.5,"Ponedjeljak");
//raspored.dodajAktivnost(okvir1,"RG","predavanje",9,12,"Srijeda");
//raspored.dodajAktivnost(okvir1,"OOI","vjezbe",9,9.5,"Petak");
//raspored.dodajAktivnost(okvir1,"DM","Predavanje",9,9.5,"Utorak");
//raspored.dodajAktivnost(okvir1,"ASFGASKAKJGSFJKASFFAS","Predavanje",19,19.5,"Utorak");