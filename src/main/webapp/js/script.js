const BASE_URL = "http://localhost:8080";
let RACE = [
    "HUMAN",
    "DWARF",
    "ELF",
    "GIANT",
    "ORC",
    "TROLL",
    "HOBBIT"
]
let PROFESSION = [
    "WARRIOR",
    "ROGUE",
    "SORCERER",
    "CLERIC",
    "PALADIN",
    "NAZGUL",
    "WARLOCK",
    "DRUID"]

let BANNED = [
    true,
    false
]
let playersPerPage = 3;
let pageNumber = 0;
let buttons = [];
let buttonIndex = 0;

window.addEventListener("DOMContentLoaded", async function () {
    initValues();
    let playersAmount = await getPlayersAmount();
    buttons = generateButtons(playersAmount);

    getPlayers(0, playersPerPage).then(players => {
        console.log("Players data:", players);
        updateTable(players);
    });

    document.getElementById("players-per-page-select").addEventListener("change", async function (event) {
        playersPerPage = event.target.value;
        buttonIndex = 0;
        getPlayers(0, playersPerPage).then(players => {
            console.log("Players data after select change:", players);
            updateTable(players);
        });
        playersAmount = await getPlayersAmount();
        buttons = generateButtons(playersAmount);
    });

    document.getElementById("player-form").addEventListener("submit", async function (event) {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);
        const player = {};

        formData.forEach((value, key) => {
            if (key === "birthday") {
                player[key] = new Date(value).getTime();
                console.log("birthday value:", player[key]);
            } else player[key] = value;
        });

        await createPlayer(player);
        event.target.reset();
    })

    document.getElementById("next-page-button").addEventListener("click", async function () {
        console.log("buttonIndex", buttonIndex);
        let nextIndex = buttonIndex + 1;
        if (nextIndex < buttons.length) {
            buttons[nextIndex].click();
        }
    })

    document.getElementById("previous-page-button").addEventListener("click", async function () {
        console.log("buttonIndex", buttonIndex);
        let previousIndex = buttonIndex - 1;
        if (previousIndex >= 0) {
            buttons[previousIndex].click();
        }
    })
});

function initValues() {
    playersPerPage = document.getElementById("players-per-page-select").value;
}

function generateButtons(playersAmount) {
    let buttonsContainer = document.getElementById("page-buttons-container");
    let pagesCount = Math.ceil(playersAmount / playersPerPage);
    let buttonsArray = [];
    buttonsContainer.innerHTML = "";

    for (let i = 1; i <= pagesCount; i++) {
        let button = document.createElement("button");
        buttonsArray.push(button);
        button.textContent = i;
        button.type = "button";
        button.classList.add("btn");
        button.classList.add("btn-secondary");
        button.addEventListener("click", () => {
            pageNumber = i - 1;
            getPlayers(pageNumber, playersPerPage).then(players => {
                console.log("Players data on button click:", players);
                updateTable(players);
            });
            let allButtons = buttonsContainer.querySelectorAll("button");
            allButtons.forEach(btn => {
                btn.classList.remove("active");
                btn.style.fontSize = "1rem";
                btn.style.color = "white";
            });

            button.classList.add("active");
            button.style.fontSize = "1.25rem";
            button.style.color = "orange";

            sessionStorage.setItem("activeButton", i - 1);
            buttonIndex = parseInt(sessionStorage.getItem("activeButton"), 10);
        });
        buttonsContainer.appendChild(button);
    }

    if (buttonsContainer.firstChild) {
        buttonsContainer.firstChild.classList.add("active");
    }
    return buttonsArray;
}

function getPlayersAmount() {
    const requestOptions = {
        method: "GET"
    };
    const requestUrl = BASE_URL + "/rest/players/count";

    return fetch(requestUrl, requestOptions)
        .then(response => response.text())
        .then(data => {
            console.log("Players amount:", data);
            return parseInt(data, 10); // Приводимо до числа
        });
}

function getPlayers(pageNumber = 0, pageSize = playersPerPage) {
    const requestOptions = {
        method: "GET"
    };
    const params = new URLSearchParams({
        pageNumber: pageNumber,
        pageSize: pageSize
    });
    const requestUrl = BASE_URL + "/rest/players?" + params;

    return fetch(requestUrl, requestOptions)
        .then((response) => {
            console.log("Get players response:", response);
            return response.json();
        })
        .catch((error) => console.error(error));
}

function deletePlayer(playerID) {
    const requestOptions = {
        method: "DELETE"
    };
    const requestUrl = BASE_URL + "/rest/players/" + playerID;

    console.log("Delete player with id:", playerID);

    fetch(requestUrl, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Http error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            console.log("Response data:", data);
        })
        .then(() => getPlayers(pageNumber, playersPerPage).then(players => {
            console.log("Players data:", players);
            updateTable(players);
        }))
        .catch(error => {
            console.error("Fetch error", error);
        });
}

function createPlayer(playerInfo) {
    let playerInfoJson = JSON.stringify(playerInfo);
    const requestOptions = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: playerInfoJson
    };

    const requestUrl = BASE_URL + "/rest/players/";

    console.log(requestUrl);
    console.log(playerInfoJson);

    fetch(requestUrl, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Http error! status: ${response.status}`)
            }
            return response.text();
        })
        .then(data => {
            console.log("Response data:", data);
        })
        .then(() => {
            return getPlayersAmount()
        })
        .then(amount => buttons = generateButtons(amount))
        .then(() => {
            return getPlayers(pageNumber, playersPerPage)
        })
        .then(players => {
            updateTable(players);
        })
        .catch(error => {
            console.error("Fetch error", error)
        })
}

async function savePlayer(playerInfo) {
    let playerInfoJson = JSON.stringify(playerInfo);
    console.log(playerInfoJson);
    const requestOptions = {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: playerInfoJson
    };

    const requestUrl = BASE_URL + "/rest/players/" + playerInfo.id;

    console.log(requestUrl);
    console.log("Update player with id:", playerInfo.id);

    await fetch(requestUrl, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Http error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            console.log("Response data:", data);
            getPlayers(pageNumber, playersPerPage).then(players => {
                console.log("Players data:", players);
                updateTable(players);
            });
        })
        .catch(error => {
            console.error("Fetch error", error);
        })
}

function updateTable(players) {
    let tableBody = document.getElementById("players-table-body");
    tableBody.innerHTML = "";

    players.forEach(player => {
        let row = document.createElement("tr");

        row.appendChild(createCell(player.id));
        row.appendChild(createCell(player.name));
        row.appendChild(createCell(player.title));
        row.appendChild(createCell(player.race));
        row.appendChild(createCell(player.profession));
        row.appendChild(createCell(player.level));
        row.appendChild(createCell(new Intl.DateTimeFormat('uk-UA').format(player.birthday)));
        row.appendChild(createCell(player.banned));

        row.appendChild(createEditCell(player));
        row.appendChild(createDeleteCell(player.id));

        tableBody.appendChild(row);
    });
}

function createCell(textContent) {
    let cell = document.createElement("td");
    cell.textContent = textContent;
    return cell;
}

function createEditCell(player) {
    let editCell = document.createElement("td");
    let editImg = document.createElement("img");

    editImg.src = "img/edit.png";
    editImg.alt = "Edit";
    editImg.addEventListener("click", () => {
        handleEditPlayer(player, editImg);
    });

    editCell.classList.add("image-cell");
    editCell.appendChild(editImg);
    return editCell;
}

function createDeleteCell(playerId) {
    let deleteCell = document.createElement("td");
    let deleteImg = document.createElement("img");

    deleteImg.src = "img/delete.png";
    deleteImg.alt = "Delete";
    deleteImg.addEventListener("click", () => {
        handleDeletePlayer(playerId);
    });

    deleteCell.classList.add("image-cell");
    deleteCell.appendChild(deleteImg);
    return deleteCell;
}

function handleEditPlayer(player, editImg) {
    editImg.src = "img/save.png";
    let deleteImg = editImg.closest("tr").querySelector("td:nth-child(10) img");
    deleteImg.style.visibility = "hidden";

    function substitudeElements(n, element, selectOption) {
        let nameCell = editImg.closest("tr").querySelector(`td:nth-child(${n})`);
        let nameInput = document.createElement(element);
        if (element === "input") {
            nameInput.type = "text";
            nameInput.placeholder = nameCell.textContent;
        } else if (element === "select") {
            nameInput.className = "form-select";
            nameInput = addOption(selectOption, nameInput);
            nameInput.value = nameCell.textContent;
        }
        nameCell.textContent = '';
        nameCell.appendChild(nameInput);
        return [nameInput, nameCell]
    }


    let name = substitudeElements(2, "input");
    let title = substitudeElements(3, "input");
    let race = substitudeElements(4, "select", RACE);
    let profession = substitudeElements(5, "select", PROFESSION);
    let banned = substitudeElements(8, "select", BANNED);

    let nameInput = name[0];
    console.log("nameInput", nameInput);
    let titleInput = title[0];
    let raceSelect = race[0];
    let professionSelect = profession[0];
    let bannedSelect = banned[0];

    editImg.addEventListener("click", () => {
        let newName = nameInput.value || nameInput.placeholder;
        let newTitle = titleInput.value || titleInput.placeholder;
        let newRace = raceSelect.value;
        let newProfession = professionSelect.value;
        let newBanned = bannedSelect.value;

        player.name = newName;
        player.title = newTitle;
        player.race = newRace;
        player.profession = newProfession;
        player.banned = newBanned;
        console.log(newName, newTitle, newRace, player.profession, player.level, player.birthday, player.banned);

        savePlayer(player);

        name[1].textContent = newName;
        title[1].textContent = newTitle;
        race[1].textContent = newRace;
        profession[1].textContent = newProfession;
        banned[1].textContent = newBanned;

        editImg.src = "img/edit.png";
        deleteImg.style.visibility = "visible";
    })
}

function handleDeletePlayer(playerId) {
    deletePlayer(playerId);
}

function addOption(optionArr, raceSelect) {
    optionArr.forEach(race => {
        let raceSelectOption = document.createElement("option");
        raceSelectOption.value = race;
        raceSelectOption.textContent = race;
        raceSelect.appendChild(raceSelectOption);
    })
    return raceSelect;
}




