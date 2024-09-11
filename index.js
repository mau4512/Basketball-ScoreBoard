function capitalizar (cadena){
    let s = cadena[0] - 32;
    console.log(cadena.charAt(0));
    console.log(cadena.slice(4));
}
console.log(capitalizar("pedro")) // "Pedro"
console.log(capitalizar("hola mundo")) // "Hola mundo"
console.log(capitalizar("")) // ""