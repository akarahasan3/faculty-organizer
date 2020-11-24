//import { iscrtajRaspored } from 'iscrtaj.js';
//import { dodajAktivnost } from 'iscrtaj.js';


let okvir = document.getElementById("okvir");
iscrtajRaspored(okvir,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],8,21);
dodajAktivnost(okvir,"WT","predavanje",9,12,"Ponedjeljak");