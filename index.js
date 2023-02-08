Date.prototype.getWeek = function() {
    let date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
// Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
// January 4 is always in week 1.
    let week1 = new Date(date.getFullYear(), 0, 4);
// Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                - 3 + (week1.getDay() + 6) % 7) / 7);
}

// Returns the four-digit year corresponding to the ISO week of the date.
Date.prototype.getWeekYear = function() {
    const date = new Date(this.getTime());
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    return date.getFullYear();
}

const calInput = document.querySelector('#calendar');
const table = document.querySelector('#table').tBodies[0];
const month = document.querySelector('#month');
const year = document.querySelector('#year');
const months = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];
function fillCalendar(y, m, d) {
    let date = new Date();
    if (y !== undefined && m !== undefined){
        date=new Date(y*1, m*1, d?d:1);
    }
    let currentDate = date.getDate();
    date.setDate(1);
    let offset = date.getDay(); // 0 = ВС; 1 = ПН и тд.
    offset = offset ? offset - 1 : 6;
    let lastDate = (new Date(date.getFullYear(), date.getMonth() + 1, 0)).getDate();

    let day = 1;
    table.innerHTML = '';
    do {
        let r = table.insertRow();
        date.setDate(day);
        r.insertCell().innerText= date.getWeek();
        
        for (let i = 0; i < 7; i++) {
            let c = r.insertCell();
            if (offset) {
                offset--;
            } else {
                if (d && d==day){
                    c.className='current'
                }
                if (day <= lastDate) {
                    c.innerText = day++;
                }
            }
        }
    } while (day <= lastDate);

    year.value = date.getFullYear();
    month.value = date.getMonth();
    if(d)
    calInput.value = d + "/" + (date.getMonth()+1)+"/"+ date.getFullYear();
}
month.parentElement.addEventListener("change", function(evt){
    if (month.value && year.value){
        fillCalendar(year.value, month.value);
    }
})
calendar.addEventListener("change", function(){
    let calSplit = calendar.value.split("/");
    if (calSplit.length==3 
        && calSplit[0]*1>0 && calSplit[0]*1<32 
        && calSplit[1]*1>0 && calSplit[1]*1<13
        && calSplit[2]*1>999 && calSplit[1]*1<9999
       ){
        fillCalendar(calSplit[2], calSplit[1]*1 - 1, calSplit[0]);
    } else {
        fillCalendar();
    }
})
table.addEventListener("click", function (evt) {
    const clickedEl = evt.target;
    if (clickedEl.textContent!=="" && clickedEl.parentElement.firstElementChild!==clickedEl){
        fillCalendar(year.value, month.value, clickedEl.textContent);
    }
})
fillCalendar();
calendar.addEventListener("click", evt => {
    document.querySelector('#table').style.display="table";
})
document.body.addEventListener("click", evt => {
    if (evt.target==document.body)
       setTimeout(()=> document.querySelector('#table').style.display="", 2000);
})
setInterval(function (evt) {
    const dateTime = document.querySelector('#dateTime');
    const nowDateTime = new Date();
    dateTime.textContent = `сейчас ${nowDateTime.toLocaleDateString()} ${nowDateTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}, 1000)
dateTime.addEventListener("click", function(){
    const now = new Date();
    fillCalendar(now.getFullYear(), now.getMonth(), now.getDate());
})