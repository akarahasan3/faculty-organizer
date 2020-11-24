function iscrtajRaspored(div, dani, satPocetak, satKraj){
    if(satPocetak >= satKraj || !Number.isInteger(satKraj) || !Number.isInteger(satPocetak) || satPocetak>24 || satPocetak<0 || satKraj>24 || satKraj<0){
        var p = document.createElement("P");
        var t = document.createTextNode("Greška");
        p.appendChild(t);
        div.appendChild(p);
        return;
    }
    var satnice = [0,2,4,6,8,10,12,15,17,19,21,23];
    var tabela = document.createElement("TABLE");
    tabela.setAttribute("id", "tabela1");
    var sat;
    var prviRed = document.createElement("TR");
    tabela.appendChild(prviRed);
    for(sat = satPocetak; sat<satKraj; sat++){
        console.log("U petlji sam za sat " + sat);
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
        console.log("U petlji sam za kolonu " + i);
        var red = document.createElement("TR");
        red.setAttribute("id", dani[i]);
        //red.setAttribute("id", dani[i] + i);
        var kolonaDani = document.createElement("TD");
        kolonaDani.innerHTML = dani[i];
        //var daniText = document.createTextNode(dani[i]);
        //kolonaDani.appendChild(daniText);
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

function dodajAktivnost(raspored, naziv, tip, vrijemePocetak, vrijemeKraj,dan){
    if(raspored == null){
        alert("Greška - raspored nije kreiran")
    }
    if(vrijemePocetak > 24 || vrijemePocetak<0 || vrijemeKraj<0 || vrijemeKraj>24){
        alert("Greška - u rasporedu ne postoji dan ili vrijeme u kojem pokušavate dodati termin")
    }
    var a = raspored.querySelector("#tabela1");
    var b = document.getElementById(dan).rowIndex;
    var c, i;
    for(i = 0; i < a.rows[b].cells.length; i++){
        
    }
    var kocka = document.createElement("TD");
    var sirina = parseInt((vrijemeKraj-vrijemePocetak)*2);
    kocka.setAttribute("colspan", sirina.toString());
    kocka.setAttribute("id", tip);
    var naslov = document.createElement("H4");
    var nastava = document.createElement("P");
    naslov.innerHTML = naziv;
    nastava.innerHTML = tip;
    kocka.appendChild(naslov);
    kocka.appendChild(nastava);
    kocka.style.border = "dashed 1px black";
    for(i = 0; i < a.rows[b].cells.length; i++){
        if(a.rows[b].cells[i].className == "sat"+(vrijemePocetak*10).toString()){
            c = a.rows[b].cells[i];
        }
    }
    console.log("c je");
    console.log(c);
    var j;
    for(j = 0; j < a.rows[b].cells.length; j++){
        if(a.rows[b].cells[j].className == "sat"+vrijemePocetak*10){
            for(i = 1; i<(vrijemeKraj-vrijemePocetak)*2; i++){
                var celija = a.rows[b].cells[j+1];
                console.log(j+1);
                console.log(celija);
                celija.remove();
            }
            break;
        }
    }
    c.setAttribute("colspan", sirina.toString());
    c.setAttribute("id", tip);
    c.appendChild(naslov);
    c.appendChild(nastava);
    console.log(kocka);
    console.log(c);
}