let countOfRecords = 0;
let recordsOnPage = 3;
let pageNumber = 0;
$( document ).ready(function() {
    getRecordsCount();
    handleSelectorOptions();
    getRecords();
});

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

function deleteRecord(id) {
    $.ajax({
        url: `http://localhost:8090/rest/players/${id}`,
        type: 'DELETE',
        success: function(data) {
            getRecords();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error request:', errorThrown);
        }
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
    markActivePage(recordsCounter);
}

function handleSelectorOptions() {
    const optionSelector = document.querySelector('.records-on-page');
    optionSelector.addEventListener("change", function() {
        updatePaginationButtons();
        getRecords();
    });
}

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
                         <td><img class="edit" src="/img/edit.png" alt="Edit"></td>
                         <td><img class="delete" id=${record.id} src="/img/delete.png" alt="Delete"></td>
                    </tr>`;
    })

    let tableBody = document.querySelector('.players-list');
    tableBody.innerHTML = '';
    tableBody.insertAdjacentHTML("beforeend", newRow);

    handleDeleteActions();
}

function handleDeleteActions() {
    const deleteButtons = document.querySelectorAll('.delete');
    deleteButtons.forEach(deleteButton => {
        deleteButton.addEventListener("click", function () {
            deleteRecord(deleteButton.id);
        });
    });
}

function markActivePage(recordsCounter) {
    const paginationButtons = recordsCounter.querySelectorAll('button');

    paginationButtons.forEach(button => {
        button.addEventListener("click", function () {
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

