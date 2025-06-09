import {Banned, Profession, Race} from "./constants.js";

let totalCount = 0;
let pageSize = 3;
let pageNumber = 0;

$(document).ready(function () {
    $("#page-size-select-id").on("change", function () {
        setPageSize(parseInt($(this).val()));
    });

    $("#pagination-buttons-id").on("click", "button", function () {
        const page = parseInt($(this).data("page"));
        if (!isNaN(page)) {
            loadPage(page);
        }
    });

    Object.keys(Race).forEach(key => {
        $('#race-id').append(`<option value="${key}">${key}</option>`);
    });

    Object.keys(Profession).forEach(key => {
        $('#profession-id').append(`<option value="${key}">${key}</option>`);
    });

    Object.keys(Banned).forEach(key => {
        $('#banned-id').append(`<option value="${key}">${key}</option>`);
    });

    $(document).on("click", ".clickable-edit", function () {
        const row = $(this).closest("tr");
        row.find("td").each(function (index) {
            const cell = $(this);
            if (index === 1 || index === 2) {
                const currentValue = cell.text();
                const inputValue = generateInput("text", currentValue);
                cell.html(inputValue);
            } else if (index === 3) {
                const currentRace = cell.text();
                const selectRace = generateSelect(Race, currentRace);
                cell.html(selectRace);
            } else if (index === 4) {
                const currentProfession = cell.text();
                const selectProfession = generateSelect(Profession, currentProfession);
                cell.html(selectProfession);
            } else if (index === 7) {
                const currentBanned = cell.text().toUpperCase();
                const selectBanned = generateSelect(Banned, currentBanned);
                cell.html(selectBanned);
            }
        });

        row.find("td").eq(8).html(`<img src="/img/save.png" alt="Save" width="40" height="40" class="clickable-save shaded-image">`);
        row.find("td").eq(9).empty();
    });

    $(document).on("click", ".clickable-save", function () {
        const row = $(this).closest("tr");
        const id = row.data("id");

        let updatedPlayer= getPlayerFromTable(row);

        $.ajax({
            url: `/rest/players/${id}`,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(updatedPlayer)
        })
            .done(function () {
                fetchTotalCount();
            })
            .fail(handleAjaxFail);
    });

    $(document).on("click", ".clickable-delete", function () {
        const row = $(this).closest("tr");
        const id = row.data("id");

        $.ajax({
            url: `/rest/players/${id}`,
            type: "DELETE"
        })
            .done(function () {
                row.remove();
                fetchTotalCount();
            })
            .fail(handleAjaxFail);
    });

    $("#new-account-form").on("submit", function (event) {
        event.preventDefault();

        if (!isValidFields()) {
            alert("All fields must be filled in!");
            return;
        }

        let newPlayer = createNewPlayer();

        $.ajax({
            url: 'rest/players',
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(newPlayer)
        })
            .done(function () {
                clearPlayerFormFields();
                fetchTotalCount();
            })
            .fail(handleAjaxFail);
    });

    fetchTotalCount();
})

function setPageSize(newSize) {
    pageSize = newSize;
    pageNumber = 0;
    fetchTotalCount();
}

function isValidFields() {
    const name = $("#name-id").val();
    const title = $("#title-id").val();
    const level = $("#level-id").val();
    const birthday = $("#birthdate-id").val();

    return name.trim() !== "" &&
        title.trim() !== "" &&
        !isNaN(parseInt(level)) &&
        !isNaN(new Date(birthday).getTime());
}

function generateSelect(type, value) {
    const select = $('<select>');
    Object.keys(type).forEach(key => {
        const option = $('<option>', {
            value: key,
            text: key,
            selected: key === value
        });
        select.append(option);
    });
    return select;
}

function generateInput(type, value) {
    return $('<input>', {
        type: type,
        value: value
    });
}

function fetchTotalCount() {
    $.get("/rest/players/count")
        .done(function (count) {
            totalCount = count;
            renderPagination();
            loadPage(pageNumber);
        })
        .fail(handleAjaxFail);
}

function loadPage(page) {
    const totalPages = Math.ceil(totalCount / pageSize);
    if (page < 0) page = 0;
    if (page >= totalPages) page = totalPages - 1;

    pageNumber = page;
    renderPagination();
    fillTable();
}

function renderPagination() {
    const totalPages = Math.ceil(totalCount / pageSize);
    const buttonsContainer = $("#pagination-buttons-container-id");

    buttonsContainer.empty();

    for (let i = 0; i < totalPages; i++) {
        const button = $(`<button data-page="${i}">${i + 1}</button>`);
        if (i === pageNumber) {
            button.prop("disabled", true);
        }
        buttonsContainer.append(button);
    }
}

function fillTable() {
    $.get("/rest/players", { pageNumber: pageNumber, pageSize: pageSize })
        .done(function (data) {
            const tbody = $("#players-table-id tbody");
            tbody.empty();
            data.forEach((player, index) => {
                tbody.append(`
                    <tr data-id="${player.id}">
                        <td>${index + 1 + pageNumber * pageSize}</td>
                        <td>${player.name}</td>
                        <td>${player.title}</td>
                        <td>${player.race}</td>
                        <td>${player.profession}</td>
                        <td>${player.level}</td>
                        <td>${new Date(player.birthday).toLocaleDateString()}</td>
                        <td>${player.banned}</td>

                        <td><img src="/img/edit.png" alt="Edit" width="45" height="45" class="clickable-edit shaded-image"></td>
                        <td><img src="/img/delete.png" alt="Delete" width="45" height="45" class="clickable-delete shaded-image"></td>
                    </tr>
                `);
            });
        })
        .fail(handleAjaxFail);
}

function getPlayerFromTable(row) {
    return {
        name: row.find("td:eq(1) input").val(),
        title: row.find("td:eq(2) input").val(),
        race: row.find("td:eq(3) select").val().toUpperCase(),
        profession: row.find("td:eq(4) select").val().toUpperCase(),
        banned: row.find("td:eq(7) select").val().toLowerCase() === "true",
    };
}

function createNewPlayer() {
    return {
        name: $("#name-id").val(),
        title: $("#title-id").val(),
        race: $("#race-id").val().toUpperCase(),
        profession: $("#profession-id").val().toUpperCase(),
        level: $("#level-id").val(),
        birthday: new Date($("#birthdate-id").val()).getTime(),
        banned: $("#banned-id").val().toLowerCase() === "true"
    };
}

function clearPlayerFormFields() {
    $("#name-id").val('');
    $("#title-id").val('');
    $("#race-id").prop('selectedIndex', 0);
    $("#profession-id").prop('selectedIndex', 0);
    $("#level-id").val('');
    $("#birthdate-id").val('');
    $("#banned-id").prop('selectedIndex', 0);
}

function handleAjaxFail(jqXHR, exception) {
    console.error('AJAX Error', {
        status: jqXHR.status,
        response: jqXHR.responseText,
        exception: exception
    });

    alert('An error occurred. Please try again later.');
}

