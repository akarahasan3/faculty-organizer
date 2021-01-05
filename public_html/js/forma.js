var Poziv = (function(){    
    var ajax = new XMLHttpRequest();
    function ucitajPredmete(){
        ajax.onreadystatechange = function(){
            if(ajax.status == 404 && ajax.readyState == 4)
                throw ajax.status;
            else if(ajax.readyState == 4 && ajax.status == 200){
                let rt = JSON.parse(ajax.responseText);
                let predmeti = document.getElementById("predmeti");
                for(var i=0; i<rt.length; i++){
                    let paragraf = document.createElement("P");
                    paragraf.innerHTML = rt[i].naziv.toString();
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
    function unesiAktivnost(){
        let naziv = document.getElementById("naziv_aktivnosti").value;
        let tip = document.getElementById("tip_aktivnosti").value;
        let pocetak = document.getElementById("pocetak_aktivnosti").value.toString().substring(0,5);
        pocetak = pocetak.replace(":", ".");
        pocetak = parseFloat(pocetak);
        if((pocetak*100)%100 == 50) pocetak = Math.floor(pocetak) + 0.6;
        if(Math.floor((pocetak*100)%100) == 30) pocetak = Math.floor(pocetak) + 0.5;
        let kraj = document.getElementById("kraj_aktivnosti").value.toString().substring(0,5);
        kraj = kraj.replace(":", ".");
        kraj = parseFloat(kraj);
        if((pocetak*100)%100 == 50) kraj = Math.floor(kraj) + 0.6;
        if(Math.floor((pocetak*100)%100) == 30) kraj = Math.floor(kraj) + 0.5; 
        let dan = document.getElementById("dan_aktivnosti").value;
        ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function(){
            if(ajax.status == 404 && ajax.readyState == 4){
                throw ajax.status;
            }
            else if(ajax.readyState == 4 && ajax.status == 200){
            }
        };
        alert(pocetak);
        alert(kraj);
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
        unesiAktivnost:unesiAktivnost
    }
}());