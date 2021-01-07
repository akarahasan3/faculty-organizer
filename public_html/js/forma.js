var datoteka_predmeta;

var Poziv = (function(){    
    var ajax = new XMLHttpRequest();
    function ucitajPredmete(){
        ajax.onreadystatechange = function(){
            if(ajax.status == 404 && ajax.readyState == 4)
                throw ajax.status;
            else if(ajax.readyState == 4 && ajax.status == 200){
                datoteka_predmeta = JSON.parse(ajax.responseText);
                document.getElementById('predmeti').innerHTML = "<div id=\"predmeti\"><h2>Predmeti</h2></div>";
                let predmeti = document.getElementById("predmeti");
                for(var i=0; i<datoteka_predmeta.length; i++){
                    let paragraf = document.createElement("P");
                    paragraf.innerHTML = datoteka_predmeta[i].naziv.toString();
                    predmeti.appendChild(paragraf);
                }
                Poziv.ucitajAktivnosti();
            }
        };
        ajax.open("GET", "http://localhost:3000/predmeti", true);
        ajax.send();
    }
    function ucitajAktivnosti(){
        ajax.onreadystatechange = function(){
            if(ajax.status == 404 && ajax.readyState == 4)
                throw ajax.status;
            else if(ajax.readyState == 4 && ajax.status == 200){
                let rt = JSON.parse(ajax.responseText);
                document.getElementById('aktivnosti').innerHTML = "<div id=\"aktivnosti\"><h2>Aktivnosti</h2></div>";
                let aktivnosti = document.getElementById("aktivnosti");
                for(var i=0; i<rt.length; i++){
                    let paragraf = document.createElement("P");
                    paragraf.innerHTML = rt[i].naziv.toString() + " " + rt[i].tip.toString() + " " + rt[i].pocetak.toString() + " " + rt[i].kraj.toString() + " " + rt[i].dan.toString();
                    aktivnosti.appendChild(paragraf);
                }
            }
        };
        ajax.open("GET", "http://localhost:3000/aktivnosti", true);
        ajax.send();
    }
    function unesiPredmet(predmet){
        ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function(){
            if(ajax.status == 404 && ajax.readyState == 4){
                throw ajax.status;
            }
            else if(ajax.readyState == 4 && ajax.status == 200){
            }
        };
        let temp = {
            naziv:predmet
        };
        ajax.open("POST", "http://localhost:3000/predmet", true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify(temp));
    }
    function obrisiPredmet(naziv, uslov){
        if(uslov){
            ajax = new XMLHttpRequest();
            ajax.onreadystatechange = function(){
                if(ajax.status == 404 && ajax.readyState == 4){
                    throw ajax.status;
                }
                else if(ajax.readyState == 4 && ajax.status == 200){
                }
            };
            ajax.open("DELETE", "http://localhost:3000/predmet/"+naziv, true);
            ajax.setRequestHeader("Content-Type", "application/json");
            ajax.send();
        }   

    }

    function unesiAktivnost(){
        Poziv.ucitajPredmete();
        var postoji = false;

        let naziv = document.getElementById("naziv_aktivnosti").value;
        datoteka_predmeta.forEach(predmet => {
            if(predmet.naziv.toString() == naziv) postoji = true;
        });
        if(!postoji) Poziv.unesiPredmet(naziv);
        let tip = document.getElementById("tip_aktivnosti").value;
        let pocetak = document.getElementById("pocetak_aktivnosti").value;

        pocetak = pocetak.split(":");
        if(pocetak[1] == 50) pocetak[1] = pocetak[1]+1;
        else if(pocetak[1] == 30) pocetak[1] = 50;
        pocetak = parseFloat(parseInt(pocetak[0]) + parseFloat(pocetak[1]/100));
        
        let kraj = document.getElementById("kraj_aktivnosti").value.toString().substring(0,5);
        
        kraj = kraj.split(":");
        if(kraj[1] == 50) kraj[1] = kraj[1]+1;
        if(kraj[1] == 30) kraj[1] = 50;
        kraj = parseFloat(parseInt(kraj[0]) + parseFloat(kraj[1]/100));

        let dan = document.getElementById("dan_aktivnosti").value;
        ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function(){
            if(ajax.status == 404 && ajax.readyState == 4){
                throw ajax.status;
            }
            else if(ajax.readyState == 4 && ajax.status == 200){
            }
        };
        let temp={
            naziv,
            tip,
            pocetak,
            kraj,
            dan
        };
        ajax.open("POST", "http://localhost:3000/aktivnost", true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify(temp));
    }
    return{
        ucitajPredmete:ucitajPredmete,
        ucitajAktivnosti:ucitajAktivnosti,
        unesiPredmet:unesiPredmet,
        unesiAktivnost:unesiAktivnost,
        obrisiPredmet:obrisiPredmet
    }
}());