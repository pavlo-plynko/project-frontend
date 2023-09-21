let countOfRecords = 0;
let recordsOnPage = 3;
let pageNumber = 0;
$( document ).ready(function() {
    getRecordsCount();
    handleSelectorOptions();
    getRecords();
});

// $( document ).ready(function() {
//     $.ajax({
//         url: 'http://localhost:8090/rest/players',
//         method: 'get',
//         dataType: 'json',
//         success: function(data){
//             fillTable(data);
//         }
//     });
// });
//
// $( document ).ready(function() {
//     $.ajax({
//         url: 'http://localhost:8090/rest/players/count',
//         method: 'get',
//         dataType: 'json',
//         success: function(data){
//             countOfRecords = data;
//         }
//     });
// });

function getRecordsCount() {
    $.get('http://localhost:8090/rest/players/count', function(data) {
        countOfRecords = data;
        updatePaginationButtons();
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error('Error request:', errorThrown);
    });
}

function getRecords() {
    $.get(`http://localhost:8090/rest/players?pageSize=${recordsOnPage}&pageNumber=${pageNumber}`, function(data) {
        fillTable(data);
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error('Error request:', errorThrown);
    });
}

function updatePaginationButtons() {
    const optionSelector = document.querySelector('.records-on-page');
    recordsOnPage = optionSelector.value;
    let buttonsCount = Math.ceil(countOfRecords / recordsOnPage);
    let buttonsRow = '';
    for (let i = 1; i <= buttonsCount; i++) {
        buttonsRow += `<button class="pagination-btn" value="${i}">${i}</button>`
    }
    let recordsCounter = document.querySelector('.pagination-buttons');
    recordsCounter.innerHTML = '';
    recordsCounter.insertAdjacentHTML("beforeend", buttonsRow);

    const paginationButtons = recordsCounter.querySelectorAll('button');

    paginationButtons.forEach(button => {
        button.addEventListener("click", function() {
            pageNumber = button.value - 1;
            getRecords();
            paginationButtons.forEach(btn => {
                if (btn !== button) {
                    btn.classList.remove("pressed");
                }
            });
            button.classList.add("pressed");
        });
    });
}

function handleSelectorOptions() {
    const optionSelector = document.querySelector('.records-on-page');
    optionSelector.addEventListener("change", function() {
        updatePaginationButtons();
        getRecords();
    });
}

// function handlePaginationOptions() {
//     const paginationButtons = document.querySelector('.pagination-btn');
//     paginationButtons.addEventListener("click", function() {
//         console.log('aaaaa')
//     });
// }

function fillTable(data) {
    let newRow = '';
    data.forEach(record => {
        newRow +=
            `<tr>
                         <td>${record.id}</td>
                         <td>${record.name}</td>
                         <td>${record.title}</td>
                         <td>${record.race}</td>
                         <td>${record.profession}</td>
                         <td>${record.level}</td>
                         <td>${record.birthday}</td>
                         <td>${record.banned}</td>
                    </tr>`;
    })
    let tableBody = document.querySelector('.players-list');
    tableBody.innerHTML = '';
    tableBody.insertAdjacentHTML("beforeend", newRow);
}