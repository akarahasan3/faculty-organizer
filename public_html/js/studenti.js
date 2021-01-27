var textarea = "";
var Poziv = (function(){    
    var ajax = new XMLHttpRequest();
    function ucitajGrupe(){
        ajax.onreadystatechange = function(){
            if(ajax.status == 404 && ajax.readyState == 4)
                throw ajax.status;
            else if(ajax.readyState == 4 && ajax.status == 200){
                var grupe = JSON.parse(ajax.responseText);
                var meni = document.getElementById('dropdown');
                for(var i=0; i<grupe.length; i++){
                    let opcija = document.createElement("OPTION");
                    opcija.setAttribute("value", grupe[i].naziv);
                    opcija.innerHTML = grupe[i].naziv;
                    meni.appendChild(opcija);
                }
            }
        };
        ajax.open("GET", "http://localhost:3000/v2/grupa", true);
        ajax.send();
    }
    function dodajStudenteuGrupu(){
        var studenti = document.getElementById('studenticsv').value.toString().split('\n');
        document.getElementById('studenticsv').value = "";
        for(var i = 0; i<studenti.length; i++){
            var stud = studenti[i].split(',');
            var temp = {
                ime: stud[0],
                index: stud[1],
                grupaId: document.getElementById("dropdown").selectedIndex + 1
            };
            Poziv.dodajStudenta(temp);
        }
    }
    function dodajStudenta(student){
        ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function(){
            if(ajax.status == 404 && ajax.readyState == 4){
                throw ajax.status;
            }
            else if(ajax.readyState == 4 && ajax.status == 200){
            }
            if(textarea !== JSON.parse(this.response).message.toString() + '\n'){
                textarea = JSON.parse(this.response).message.toString() + '\n';
                document.getElementById('studenticsv').value += textarea;
            }
        }
        ajax.open("POST", "http://localhost:3000/v2/student", true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify(student));
    }
    /* function updateGrupe(){
        ajax = new XMLHttpRequest();
        var idGrupe = document.getElementById("dropdown").selectedIndex + 1;


        ajax.open("PUT", "http://localhost:3000/v2/grupa/"+idGrupe, true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify(grupa));
    } */
    return{
        ucitajGrupe:ucitajGrupe,
        dodajStudenteuGrupu:dodajStudenteuGrupu,
        dodajStudenta:dodajStudenta
    }
}());