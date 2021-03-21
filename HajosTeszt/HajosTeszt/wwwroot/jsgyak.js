window.onload = function () {

let sorhely = document.getElementById("pascal")
    sorhely.innerHTML = ""

    var faktoriális = function (n) {
        let er = 1;
        for (let i = 2; i <= n; i++) {
            er = er * i;
        }
        return er;
    }

for (var s = 0; s < 10; s++) {

    let sor = document.createElement("div");
    sorhely.appendChild(sor)
    sor.classList.add("egymás_mellé") 

    for (var o = 0; o <= s; o++) {
        let szám = document.createElement("div")
        sor.appendChild(szám)
        szám.innerText = faktoriális(s)  / (faktoriális(o) * faktoriális(s-o) )
        szám.classList.add("doboz")
        szám.style.color = `rgb(${255 / 10 * s}, 0 , ${255 / 10 * o} )`
    }
}







}