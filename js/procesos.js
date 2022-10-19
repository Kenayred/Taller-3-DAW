//Inicializando matriz para manejar las marcas y sus respectivos modelos
var marcas = new Array(7);
marcas["Toyota"] = ["Corolla", "Echo", "Yaris", "Avensis", "Camry", "Land Cruiser", "4 Runner", "Hilux"];
marcas["Nissan"] = ["Sentra", "Platina", "Almera", "Altima", "Tiida", "Pathfinder", "Patrol", "X-Trail", "Frontier"];
marcas["Hyundai"] = ["Elantra", "Accent", "Coupé", "Santa Fe", "i30"];
marcas["Volkswagen"] = ["Golf", "Jetta", "Passat", "Phaeton", "Thunder Bunny", "Touareg", "Saveiro"];
marcas["Chevrolet"] = ["Optra", "Aveo", "Cobalt", "Malibu", "Corvette", "Chevy", "Avalanche", "Trailblazer"];
marcas["Honda"] = ["Civic", "Acura", "Accord", "Fit", "Odyssey", "CR-V", "Pilot", "RidgeLine"];
marcas["Mitsubishi"] = ["Lancer", "Galant", "Eclipse", "Montero", "Nativa", "Outlander", "L200"];


function init(){

    
    tabla=document.getElementById("Tabla");
    boton = document.getElementById("enviar");
    boton.addEventListener("click", agregarC, false);

    var select = document.getElementById("selectCarro");
    if(select.addEventListener){
        select.addEventListener("change", function(){
            addOptions(marcas[this.options[this.selectedIndex].text],
                document.fomrControl.selmod);
        }, false);
    }
    else{
        select.attachEvent("onchange", function(){
            addOptions(marcas[this.options[this.selectedIndex].text],
            document.fomrControl.selmod);
            });
    }
    

        //Creacion y apertura  de nuestra base de datos
        var request = indexedDB.open("MiBase");

        request.onsuccess = function(e){
            db = e.target.result;
        }

        request.onupgradeneeded = function(e){
            db=e.target.result;
            db.createobjectStore("Carro", {keyPath: "DUI"});
        }
        var today = new Date();
        var dia = today.getDate();
        var mes = today.getMonth()+1;
        var annio = today.getFullYear();
        var fecha = dia+"/"+mes+"/"+annio;   
        
        var sep = document.getElementById("fecha");
        sep.innerHTML = "Fecha: "+fecha;
    

}

function agregarC(){

    //DECLARACION DE VARIABLES
    var nombre = document.getElementById("nombre").value;
    var DUI = document.getElementById("dui").value;
    var NIT = document.getElementById("nit").value;
    var anio = document.getElementById("txtAnio").value;
    var Modelo = selectM();
    var Marca = selectC();
    var color = selectColor();
    var Placa = document.getElementById("placa").value;
    var Falla = document.getElementById("falla").value;
    var today = new Date();
    var dia = today.getDate();
    var mes = today.getMonth()+1;
    var annio = today.getFullYear();
    var fecha = dia+"/"+mes+"/"+annio;   

    var nom = false;
    var D = false;
    var N = false;
    var Pl = false;
    var fl = false;
    var an = false;
    var bandera = false;
   
     //VALIDACIONES
     textoNom = /^([A-Z]{1}[a-zñáéíóú]+[\s]*)+$/; //valida que las palabras despues de un espacio empiecen con mayuscula
     if(!textoNom.test(nombre)){
         alert("Revise el formato de su nombre");
         return false;
     }else{
        nom = true;
     }

     if (anio.length == 0){
        alert("Revise el año del carro");
         return false;
     } else {
        an = true;
     }
 
     textoDui = /[0-9]{8}-[0-9]{1}/; //formato ########-#
     if(!textoDui.test(DUI)){
         alert("Revise el formato de su DUI");
         return false;
     }else{
        D = true;
     }
     
     textoNit = /[0-9]{4}-[0-9]{6}-[0-9]{3}-[0-9]{1}/; //formato ####-######-###-#
     if(!textoNit.test(NIT)){
         alert("Revise el formato de su NIT");
         return false;
     }else{
        N = true;
     }
 
     textoPlaca = /[P]{1}[0-9]{3}-[0-9]{3}/; //formato P###-###
     if(!textoPlaca.test(Placa)){
         alert("Revise el formato de su placa");
         return false;
     }else{
        Pl=true;
     }
 
     if(Falla.length==0){ //valida que exista texto en el textarea
         alert("Describa las fallas de su automovil")
         return false;
     } else {
        fl=true;
     }

    if(nom == true && D == true && N == true && Pl == true && fl==true && an == true){
        bandera = true;
        
    }

    //PARTE DONDE SE GUARDA
     if(bandera == true){
        var proceso = db.transaction(["Carro"], "readwrite");
        var datos = proceso.objectStore("Carro");
        var guardar = datos.add({nombre: nombre, Fecha: fecha, Falla: Falla, Placa: Placa, DUI: DUI, Marca: Marca, Color: color, Modelo: Modelo, NIT: NIT, Anio:anio}); 

        guardar.addEventListener("success", mostrar, false);
        alert("Se guardaron los datos");
     } else {
         alert("Revise los datos ingresados");
     }
    

    

}

// MOSTRAR MODELO DE LA MARCA

//CAPTURA DE VALORES DE LOS SELECT
function selectC(){
    let marcaa = document.getElementById("selectCarro").value;
    return marcaa;
}

function selectM(){
    let modeloo = document.getElementById("selmod").value;
    return modeloo;
}

function selectColor(){
    let coloor = document.getElementById("selectColores").value;
    return coloor;
}
//FIN DE CAPTURA DE VALORES SELECT


//MUESTRA DE DATOS
function mostrar(){
    tabla.innerHTML = "";

    var operacion = db.transaction(["Carro"], "readonly");
    var datos = operacion.objectStore("Carro");
    var cursor = datos.openCursor();

    cursor.addEventListener("success", mostrarDatos, false);
}

function removeOptions(optionMenu){
    for(i=0; i<optionMenu.options.length; i++){
        optionMenu.options[i] = null;
    }
}

function addOptions(optionList, optionMenu){
    var i=0;
    removeOptions(optionMenu);
    for(i=0; i<optionList.length; i++){
        optionMenu[i] = new Option(optionList[i], optionList[i]);
    }
}

function mostrarDatos(e){
    var cursor = e.target.result;

    if(cursor){
        tabla.innerHTML += "<div class='tablaMostrar'> Nombre:" + cursor.value.nombre +"  - DUI:"+ cursor.value.DUI + " - NIT:" + cursor.value.NIT + " - Marca:" + cursor.value.Marca +" - Modelo:"+cursor.value.Modelo+" - Año:"+cursor.value.Anio+" - Color:"+cursor.value.Color+" - Placa:"+cursor.value.Placa+" - Fallas:"+cursor.value.Falla+" - "+cursor.value.Fecha+"</div>";
        // tabla.innerHTML += "<table class=\"carinfo\">\n";
        // tabla.innerHTML += "<thead>\n\t<tr>\n";
        // tabla.innerHTML += "\t\t<th colspan=\"2\">Datos del carro</th>\n";
        // tabla.innerHTML += "\t</tr>\n</thead>\n";
        // tabla.innerHTML += "<tbody>\n\t";
        // tabla.innerHTML += "\t<tr>\n\t\t<td>Nombre: </td>\n";
        // tabla.innerHTML += "\t\t<td>" + cursor.value.nombre + "</td>\n\t</tr>\n";
        // tabla.innerHTML += "\t<tr>\n\t\t<td>DUI: </td>\n";
        // tabla.innerHTML += "\t\t<td>" + cursor.value.DUI + "</td>\n\t</tr>\n";
        // tabla.innerHTML += "\t<tr>\n\t\t<td>NIT: </td>\n";
        // tabla.innerHTML += "\t\t<td>" + cursor.value.NIT + "</td>\n\t</tr>\n";
        // tabla.innerHTML += "\t<tr>\n\t\t<td>Marca: </td>\n";
        // tabla.innerHTML += "\t\t<td>" + cursor.value.Marca + "</td>\n\t</tr>\n";
        // tabla.innerHTML += "\t<tr>\n\t\t<td>Modelo: </td>\n";
        // tabla.innerHTML += "\t\t<td>" + cursor.value.Modelo + "</td>\n\t</tr>\n";
        // tabla.innerHTML += "\t<tr>\n\t\t<td>Año: </td>\n";
        // tabla.innerHTML += "\t\t<td>" + cursor.value.Anio + "</td>\n\t</tr>\n";
        // tabla.innerHTML += "\t<tr>\n\t\t<td>Color: </td>\n";
        // tabla.innerHTML += "\t\t<td>" + cursor.value.Color + "</td>\n\t</tr>\n";
        // tabla.innerHTML += "\t<tr>\n\t\t<td>Placa: </td>\n";
        // tabla.innerHTML += "\t\t<td>" + cursor.value.Placa + "</td>\n\t</tr>\n";
        // tabla.innerHTML += "\t<tr>\n\t\t<td>Falla: </td>\n";
        // tabla.innerHTML += "\t\t<td>" + cursor.value.Falla + "</td>\n\t</tr>\n";
        // tabla.innerHTML += "\t<tr>\n\t\t<td>Fecha: </td>\n";
        // tabla.innerHTML += "\t\t<td>" + cursor.value.Fecha + "</td>\n\t</tr>\n";
        // tabla.innerHTML += "\t</tbody>\n</table>\n";
        cursor.continue();
    }
}

//Inicialización  de la main function
window.addEventListener("load", init, false);