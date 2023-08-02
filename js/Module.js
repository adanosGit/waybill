const arrTableDataID = [
    "km-with-cargo",
    "km-without-cargo",
    "km-total",
    "km-with-trailer",
    "name-cargo",
    "weight-cargo",
    "speedometer-score"
];


// create dinamic elements
const createElem = (tagname, appendTo, fn) => {
    const element = document.createElement(tagname);
    if(appendTo) appendTo.appendChild(element);
    if(fn) fn(element);
}

// проверка на число
function isAN(value) {
    if(value instanceof Number)
      value = value.valueOf(); // Если это объект числа, то берём значение, которое и будет числом
    
    return  isFinite(value) && value === parseInt(value, 10);
}

export default arrTableDataID;
export {
    createElem,
    isAN,
}