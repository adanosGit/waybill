
// const pathh = require('path');
// const url = require('url');
// const {app, BrowserWindow} = require('electron');

// let win;

// function createWindow(){
//   win = new BrowserWindow({
//     width: 1400,
//     height: 600,
//     icon: __dirname + ""
//   });

//   win.loadURL(url.format({
//     pathname: pathh.join(__dirname, 'index.html'),
//     protocol: 'file:',
//     slashes: true
//   }));

//   // win.webContents.openDevTools();

//   win.on('closed', () => {
//     win = null;
//   });
// }

// app.on('ready', createWindow);

// app.on('window-all-closed', () => {
//   app.quit();
// });


import arrTableDataID, { createElem, isAN } from "./Module.js";

let id = 0;
let sumScore = 0;
let startSpeedometerScore = 0;
let typeCar = {};
let arrSelectedTypeCargo = [];
let arrPath = [];

class Path {
  id = 0;
  namePath = "";
  kmWithCargo = 0;
  kmWithoutCargo = 0;
  kmTotal = 0;
  kmWithTrailer = 0;
  nameCargo = "ПУСТИЙ";
  weightCargo = 0;
  finishSpeedometerScore = 0;
}

const arrTypeAndWeightCargo = [
  { name: "ПУСТИЙ", weight: 0 },
  { name: "МТЛБ", weight: 9.7 },
  { name: "БМП", weight: 14 },
  { name: "Т-64", weight: 40 },
];

const arrCar = [
  { type: "КРАЗ-63221", fuelOn_100: 50.0, fuelOn_1: 0.5 },
  { type: "КРАЗ-6444", fuelOn_100: 50.0, fuelOn_1: 0.5 },
  { type: "КРАЗ-6446", fuelOn_100: 50.0, fuelOn_1: 0.5 },
  { type: "МАЗ-537", fuelOn_100: 125.0, fuelOn_1: 1.25 },
  { type: "УРАЛ-4320", fuelOn_100: 44.5, fuelOn_1: 0.445 },
];

typeCar = arrCar[0];

const btnAddPath = document.querySelector("#btn-add-path");

// событие select выбора машины
const selectedTypeCar = document.getElementById("type-car");
selectedTypeCar.onchange = () => {
  let selectedCar = selectedTypeCar.options[selectedTypeCar.selectedIndex].text;
  typeCar = arrCar.find((car) => car.type === selectedCar);
  // console.log(typeCar);
  spanFuelOn100km.innerText = "100 км ---- " + typeCar.fuelOn_100 + "л        ";
  spanFuelOn1km.innerText = "   1 км ---- " + typeCar.fuelOn_1 + "л";
  resultByCategoryCargo();
  і
};

const inputKMWithCargoTotal = document.querySelector("#km-with-cargo-total");
const inputKMWithoutCargoTotal = document.querySelector(
  "#km-without-cargo-total"
);
const inputKMTotal = document.querySelector("#km-total");
const inputKMWithTrailerTotal = document.querySelector(
  "#km-with-trailer-total"
);

const spanFuelOn100km = document.getElementById("fuelOn100km");
const spanFuelOn1km = document.getElementById("fuelON1km");
spanFuelOn100km.innerText = "100 км ---- " + typeCar.fuelOn_100 + "л        ";
spanFuelOn1km.innerText = "   1 км ---- " + typeCar.fuelOn_1 + "л";
const spanTotalKM = document.getElementById("spanTotalKM");
const spanTotalFuel = document.getElementById("spanTotalFuel");
const divResult = document.getElementById("divResult");

// события инпута начальных данных спидометра
const inputSpeedometerStartScore = document.getElementById(
  "speedometerStartScore"
);
inputSpeedometerStartScore.oninput = () => {
  let temp = parseInt(inputSpeedometerStartScore.value);

  if (isAN(temp)) {
    inputSpeedometerStartScore.value = temp;
  } else {
    inputSpeedometerStartScore.value = "";
  }
  startSpeedometerScore = temp;

  // подсветка инпута начальных показаний спидометра
  if (
    !inputSpeedometerStartScore.value &&
    inputSpeedometerStartScore.value !== "0"
  ) {
    inputSpeedometerStartScore.classList.add("alertBorder");
  } else {
    inputSpeedometerStartScore.classList.remove("alertBorder");
  }

  calculateSpeedometerScore();
  resultByCategoryCargo();
};

// событие кнопки добавления маршрута
btnAddPath.onclick = () => {
  let path = new Path();
  path.id = id;
  arrPath.push(path);

  createElem("tr", tbodyData, (tr) => {
    createElem("th", tr, (th) => {
      th.className += "truckPath";
      createElem("input", th, (input) => {
        input.setAttribute(`id`, `name-path` + id);
        input.placeholder = "Маршрут";
      });
    });

    createElem("td", tr, (td) => {
      td.className += "pathScore";

      createElem("input", td, (input) => {
        input.setAttribute(`id`, "km-with-cargo" + id);
        input.className += "textRight";
        input.placeholder = 0;
      });
    });

    createElem("td", tr, (td) => {
      td.className += "pathScore";
      createElem("input", td, (input) => {
        input.setAttribute(`id`, "km-without-cargo" + id);
        input.className += "textRight";
        input.placeholder = 0;
      });
    });

    createElem("td", tr, (td) => {
      td.className += "pathScore";
      createElem("input", td, (input) => {
        input.setAttribute(`id`, "km-total" + id);
        input.setAttribute("readonly", "readonly");
        input.className += "textRight readonly";
        input.placeholder = 0;
      });
    });

    createElem("td", tr, (td) => {
      td.className += "pathScore";
      createElem("input", td, (input) => {
        input.setAttribute(`id`, "km-with-trailer" + id);
        input.className += "textRight";
        input.placeholder = 0;
      });
    });

    createElem("td", tr, (td) => {
      td.className += "pathScore";
      createElem("select", td, (select) => {
        select.setAttribute(`id`, "name-cargo" + id);
        for (let i = 0; i < arrTypeAndWeightCargo.length; i++) {
          createElem("option", select, (option) => {
            option.text = arrTypeAndWeightCargo[i].name;
          });
        }
      });
    });

    createElem("td", tr, (td) => {
      td.className += "pathScore";
      createElem("span", td, (span) => {
        span.setAttribute(`id`, "weight-cargo" + id);
        span.innerText = 0;
      });
    });

    createElem("td", tr, (td) => {
      td.className += "pathScore";
      createElem("input", td, (input) => {
        input.setAttribute(`id`, "speedometer-score" + id);
        input.setAttribute("readonly", "readonly");
        input.className += "readonly textRight";
        input.placeholder = 0;
      });
    });
  });

  // события
  const inputKMPathTotal = document.getElementById("km-total" + id);

  // события инпута км с грузом
  const inputKMWithCargo = document.getElementById("km-with-cargo" + id);
  inputKMWithCargo.oninput = () => {
    let temp = parseInt(inputKMWithCargo.value);
    let index = parseInt(inputKMWithCargo.id.slice(-1));

    if (isAN(temp)) {
      inputKMWithCargo.value = temp;
    } else {
      inputKMWithCargo.value = "";
    }

    const path = arrPath.find((path) => path.id === index);
    path.kmWithCargo = temp;
    if (inputKMWithCargo.value === "") {
      path.kmWithCargo = 0;
    }

    // сума км по колонке
    inputKMWithCargoTotal.value = totalSumColumn("kmWithCargo");

    // сума км по строке
    path.kmTotal = path.kmWithCargo + path.kmWithoutCargo;
    inputKMPathTotal.value = path.kmTotal;

    // подсветка select////////////////////////////////////////////////////
    // ////////////////////////////////////////////////////////////////////
    const select = document.getElementById("name-cargo" + index);
    if (path.kmWithCargo) {
      if (!select.selectedIndex) {
        select.classList.add("alertBorder");
      } else {
        select.classList.remove("alertBorder");
      }
    } else {
      if (select.selectedIndex) {
        select.classList.add("alertBorder");
      } else {
        select.classList.remove("alertBorder");
      }
    }

    // сума всего км по колонке
    let sum = 0;
    for (let i = 0; i < arrPath.length; i++) {
      sum += arrPath[i].kmTotal;
    }
    inputKMTotal.value = sum;

    resultByCategoryCargo();
    calculateSpeedometerScore();
  };

  // события инпута км без груза

  const inputKMWithoutCargo = document.getElementById("km-without-cargo" + id);
  inputKMWithoutCargo.oninput = () => {
    let temp = parseInt(inputKMWithoutCargo.value);
    let index = parseInt(inputKMWithoutCargo.id.slice(-1));

    if (isAN(temp)) {
      inputKMWithoutCargo.value = temp;
    } else {
      inputKMWithoutCargo.value = "";
    }

    const path = arrPath.find((path) => path.id === index);
    path.kmWithoutCargo = temp;
    if (inputKMWithoutCargo.value === "") {
      path.kmWithoutCargo = 0;
    }

    // сума км по колонке
    inputKMWithoutCargoTotal.value = totalSumColumn("kmWithoutCargo");

    // сума км по строке
    path.kmTotal = path.kmWithCargo + path.kmWithoutCargo;
    inputKMPathTotal.value = path.kmTotal;

    // сума всего км по колонке
    let sum = 0;
    for (let i = 0; i < arrPath.length; i++) {
      sum += arrPath[i].kmTotal;
    }
    inputKMTotal.value = sum;

    resultByCategoryCargo();
    calculateSpeedometerScore();
  };

  // события инпута км с тралом
  const inputKMWithTrailer = document.getElementById("km-with-trailer" + id);
  inputKMWithTrailer.oninput = () => {
    let temp = parseInt(inputKMWithTrailer.value);
    let index = parseInt(inputKMWithTrailer.id.slice(-1));

    if (isAN(temp)) {
      inputKMWithTrailer.value = temp;
    } else {
      inputKMWithTrailer.value = "";
    }

    const path = arrPath.find((path) => path.id === index);
    path.kmWithTrailer = temp;
    if (inputKMWithTrailer.value === "") {
      path.kmWithTrailer = 0;
    }

    // сума км по колонке
    inputKMWithTrailerTotal.value = totalSumColumn("kmWithTrailer");

    resultByCategoryCargo();
  };

  // события select груза
  const select = document.getElementById("name-cargo" + id);
  const span = document.getElementById("weight-cargo" + id);

  select.onchange = () => {
    span.innerText = arrTypeAndWeightCargo[select.selectedIndex].weight;

    let index = parseInt(select.id.slice(-1));

    // добавляем данные о грузе в обьект маршрута
    const path = arrPath.find((path) => path.id === index);
    path.nameCargo = arrTypeAndWeightCargo[select.selectedIndex].name;
    path.weightCargo = arrTypeAndWeightCargo[select.selectedIndex].weight;

    // подсветка select //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    if (select.classList.contains("alertBorder") && path.kmWithCargo) {
      select.classList.remove("alertBorder");
    }
    if (path.kmWithCargo) {
      if (!select.selectedIndex) {
        select.classList.add("alertBorder");
        console.log("hi");
      } else {
        select.classList.remove("alertBorder");
      }
    } else {
      if (select.selectedIndex) {
        select.classList.add("alertBorder");
        console.log("hi");
      } else {
        select.classList.remove("alertBorder");
      }
    }

    updateArrSelecteTypeCargo();
    resultByCategoryCargo();
  };

  id++;
};

function totalSumColumn(prop) {
  let sum = 0;
  for (let i = 0; i < arrPath.length; i++) {
    sum += arrPath[i][prop];
  }
  return sum;
}

function calculateSpeedometerScore() {
  if (startSpeedometerScore) {
    let flag = true;
    for (let i = 0; i < arrPath.length; i++) {
      const path = arrPath.find((path) => path.id === i);
      if (!path.kmTotal) {
        flag = false;
      }
    }
    if (flag) {
      for (let i = 0; i < arrPath.length; i++) {
        const path = arrPath.find((path) => path.id === i);

        if (i) {
          sumScore += path.kmTotal;
        } else {
          sumScore = path.kmTotal + startSpeedometerScore;
        }
        path.finishSpeedometerScore = sumScore;

        const inputPathFinishSpeedometerScore = document.getElementById(
          "speedometer-score" + i
        );
        inputPathFinishSpeedometerScore.value = path.finishSpeedometerScore;
      }
    } else {
      for (let i = 0; i < arrPath.length; i++) {
        const inputPathFinishSpeedometerScore = document.getElementById(
          "speedometer-score" + i
        );
        inputPathFinishSpeedometerScore.value = "";
      }
    }
  }
  sumScore = 0;
}

function resultByCategoryCargo() {
  let totalFuel = 0;

  let kmWithoutCargo = 0;
  let kmTotal = 0;

  // let kmWithTrailer = 0;

  for (let i = 0; i < id; i++) {
    kmWithoutCargo += arrPath[i].kmWithoutCargo;
    kmTotal += arrPath[i].kmTotal;
  }

  spanTotalKM.innerText = "Загальний пробіг - " + kmTotal + "км";

  divResult.innerHTML = "";

  // расчет расхода топлива при движении без груза
  if (kmWithoutCargo) {
    let road_78_perc = goodRoad(kmWithoutCargo);
    let road_22_perc = kmWithoutCargo - road_78_perc;
    let result_78 = parseFloat(
      (road_78_perc * typeCar.fuelOn_1 * 0.85).toFixed(2)
    );
    let result_22 = parseFloat((road_22_perc * typeCar.fuelOn_1).toFixed(2));

    totalFuel += result_78;
    totalFuel += result_22;

    createElem("h3", divResult, (h3) => {
      createElem("span", h3, (span) => {
        span.innerText = `${
          road_78_perc +
          " * " +
          typeCar.fuelOn_1 +
          " - 15% " +
          " = " +
          result_78
        }`;
        // span.setAttribute(`id`, "fuel-calc" + arrSelectedTypeCargo[i]);
      });
    });
    createElem("h3", divResult, (h3) => {
      createElem("span", h3, (span) => {
        span.innerText = `${
          road_22_perc + " * " + typeCar.fuelOn_1 + " = " + result_22
        }`;
        // span.setAttribute(`id`, "fuel-calc" + arrSelectedTypeCargo[i]);
      });
    });
  }

  // расчет расхода топлива при движении по видам груза
  if (arrSelectedTypeCargo.length !== 0) {
    for (let i = 0; i < arrSelectedTypeCargo.length; i++) {
      let kmWithCargo = 0;
      let weightCargo = 0;
      for (let y = 0; y < id; y++) {
        if (arrSelectedTypeCargo[i] === arrPath[y].nameCargo) {
          kmWithCargo += arrPath[y].kmWithCargo;
          weightCargo = arrPath[y].weightCargo;
        }
      }

      if (kmWithCargo) {
        let fuelConsumption = 0;
        fuelConsumption = parseFloat(
          (typeCar.fuelOn_1 + (weightCargo * 1.3) / 100).toFixed(3)
        );

        let road_78_perc = goodRoad(kmWithCargo);
        let road_22_perc = kmWithCargo - road_78_perc;
        let result_78 = parseFloat(
          (road_78_perc * fuelConsumption * 0.85).toFixed(2)
        );
        let result_22 = parseFloat((road_22_perc * fuelConsumption).toFixed(2));

        totalFuel += result_78;
        totalFuel += result_22;

        createElem("h3", divResult, (h3) => {
          createElem("span", h3, (span) => {
            span.innerText = `${
              road_78_perc +
              " * " +
              fuelConsumption +
              " - 15% " +
              " = " +
              result_78
            }`;
            // span.setAttribute(`id`, "fuel-calc" + arrSelectedTypeCargo[i]);
          });
        });
        createElem("h3", divResult, (h3) => {
          createElem("span", h3, (span) => {
            span.innerText = `${
              road_22_perc + " * " + fuelConsumption + " = " + result_22
            }`;
            // span.setAttribute(`id`, "fuel-calc" + arrSelectedTypeCargo[i]);
          });
        });
      }
    }
  }

  spanTotalFuel.innerText = "Всього ДП - " + Math.ceil(totalFuel) + "  л";
}

function goodRoad(value) {
  return Math.round(value * 0.78);
}

function updateArrSelecteTypeCargo() {
  arrSelectedTypeCargo = [];
  for (let i = 0; i < id; i++) {
    if (
      arrSelectedTypeCargo.indexOf(arrPath[i].nameCargo) === -1 &&
      arrPath[i].nameCargo !== "ПУСТИЙ"
    ) {
      arrSelectedTypeCargo.push(arrPath[i].nameCargo);
    }
  }

  const divListFuel = document.getElementById("listFuel");
  divListFuel.innerHTML = "";

  for (let i = 0; i < arrSelectedTypeCargo.length; i++) {
    createElem("h3", listFuel, (h3) => {
      createElem("span", h3, (span) => {
        let weightCargo = arrTypeAndWeightCargo.find(
          (el) => el.name === arrSelectedTypeCargo[i]
        ).weight;

        let provide = typeCar.fuelOn_100 + 1.3 * weightCargo;
        span.innerText = `Рух з  ${
          arrSelectedTypeCargo[i] +
          " " +
          typeCar.fuelOn_100 +
          " + (1.3 * " +
          weightCargo +
          ") = " +
          provide +
          ";   1km = " +
          (provide / 100).toFixed(3)
        }`;
        span.setAttribute(`id`, "fuel-calc" + arrSelectedTypeCargo[i]);
      });
    });
  }
}

// function isThere() {
//   let flag = false;
//   for (let i = 0; i < id; i++) {
//     // y = 1
//     for (let y = 0; y < arrTypeAndWeightCargo.length; y++) {
//       if (arrTypeAndWeightCargo[y].name === arrPathObj[i].nameCargo) {
//         flag = true;
//       }
//     }
//   }
//   return flag;
// }
