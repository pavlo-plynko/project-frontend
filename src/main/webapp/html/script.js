let accountsCount = null;
let accountsPerPage = 3;
let accountsAmount = null;
let currentPageNumber = 0;

const RACE_ARRAY = ['HUMAN', 'DWARF', 'ELF', 'GIANT', 'ORC', 'TROLL', 'HOBBIT'];
const PROFESSION_ARRAY = ['WARRIOR', 'ROGUE', 'SORCERER', 'CLERIC', 'PALADIN', 'NAZGUL', 'WARLOCK', 'DRUID'];
const BANNED_ARRAY = ['true', 'false'];

initCreateForm()
createAccountsPerPageDropDown()
fillTable(currentPageNumber, accountsPerPage)
updatePlayersCount()


function initCreateForm(){
    const $raceSelect = document.querySelector('[data-create-race]');
    const $professionSelect = document.querySelector('[data-create-profession]');

    $raceSelect.insertAdjacentHTML('afterbegin', createSelectOptions(RACE_ARRAY, 'HUMAN'));
    $professionSelect.insertAdjacentHTML('afterbegin', createSelectOptions(PROFESSION_ARRAY, 'WARRIOR'));
}


function fillTable(pageNumber, pageSize) {
    $.get(`http://localhost:8080/rest/players?pageNumber=${pageNumber}&pageSize=${pageSize}`, (players) => {
            console.log(players);
            const $playersTableBody = $('.players-table-body')[0];
            let htmlRows = '';

            players.forEach((player) => {
                htmlRows +=
                    `<tr class="row" data-accounr-id="${player.id}">

                    <td class="cell cell_small">${player.id}</td>
                    <td class="cell" data-accounr-name>${player.name}</td>
                    <td class="cell" data-accounr-title>${player.title}</td>
                    <td class="cell" data-accounr-race>${player.race}</td>
                    <td class="cell" data-accounr-profession>${player.profession}</td>
                    <td class="cell" data-accounr-level>${player.level}</td>
                    <td class="cell" data-accounr-birthday>${formatDate(player.birthday)}</td>
                    <td class="cell" data-accounr-banned>${player.banned}</td>
                    
                    <td class="cell cell-auto">
                        <button class="edit-button" value="${player.id}">
                        <img class="edit-img" src="../img/edit.png" alt="edit">
                        </button>
                    </td>
                    
                    <td class="cell cell-auto">
                        <button class="delete-button" value="${player.id}">
                        <img class="delete-img" src="../img/delete.png" alt="delete">
                        </button>
                    </td>
                    
              </tr>`
            });

            Array.from($playersTableBody.children).forEach(row => row.remove());

            $playersTableBody.insertAdjacentHTML("beforeend", htmlRows)

            const $deleteButtons = document.querySelectorAll('.delete-button')

            $deleteButtons.forEach(button => button.addEventListener('click', removeAccountHandler))

            const $editButtons = document.querySelectorAll('.edit-button')

            $editButtons.forEach(button => button.addEventListener('click', editAccountHandler))
        })

}

function updatePlayersCount() {
    $.get(`/rest/players/count`, (count) => {
            accountsCount = count;
            updatePaginationButtons();
        }
    )
}

function updatePaginationButtons(){
    accountsAmount = accountsCount ? Math.ceil(accountsCount / accountsPerPage) : 0;
    const $buttonsContainer = document.querySelector('.pagination-buttons');
    const childButtonsCount = $buttonsContainer.children.length;
    let paginationButtonsHtml = '';

    for (let i = 1; i <= accountsAmount; i++) {
        paginationButtonsHtml += `<button value="${i - 1}">${i}</button>`
    }

    if (childButtonsCount !== 0){
        Array.from($buttonsContainer.children).forEach(node => node.remove());
    }

    $buttonsContainer.insertAdjacentHTML("beforeend", paginationButtonsHtml);
    Array.from($buttonsContainer.children).forEach(button => button.addEventListener('click', onPageChange));

    setActiveButton(currentPageNumber);
}

function createAccountsPerPageDropDown(){
    const $dropDown = document.querySelector(`.accounts-per-page`);
    const options = createSelectOptions([3, 5, 10, 20], 3);

    $dropDown.addEventListener('change', onAccountsPerPageChangeHandler);
    $dropDown.insertAdjacentHTML("afterbegin", options);
}


function onAccountsPerPageChangeHandler(e) {
    accountsPerPage = Number(e.currentTarget.value);
    accountsAmount = Math.ceil(accountsCount / accountsPerPage);

    if (currentPageNumber >= accountsAmount) {
        currentPageNumber = accountsAmount - 1;
    }

    fillTable(currentPageNumber, accountsPerPage);
    updatePaginationButtons();
}

function onPageChange(e) {
    const targetPageIndex = e.currentTarget.value;
    setActiveButton(targetPageIndex);
    currentPageNumber = targetPageIndex;
    fillTable(currentPageNumber, accountsPerPage);
    setActiveButton(currentPageNumber);


}

function setActiveButton(buttonIndex = 0) {
    const $buttonsContainer = document.querySelector('.pagination-buttons');
    const $targetButton = Array.from($buttonsContainer.children)[buttonIndex];
    const $currentActiveButton = Array.from($buttonsContainer.children)[currentPageNumber];

    $currentActiveButton.classList.remove('active-pagination-button');
    $targetButton.classList.add('active-pagination-button');
}

function createAccount(){

  const data = {
      name: $('[data-create-name]').val(),
      title: $('[data-create-title]').val(),
      race: $('[data-create-race]').val(),
      profession: $('[data-create-profession]').val(),
      birthday: new Date($('[data-create-birthday]').val()).getTime(),
      level: $('[data-create-level]').val(),
      banned: $('[data-create-banned]').val() === 'on',
  }

    $.ajax({
        url:`/rest/players/`,
        type: 'POST',
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json",
        success: () => {
            updatePlayersCount();
            fillTable(currentPageNumber, accountsPerPage);
        }
    })
}

function removeAccountHandler(e){
    const accountId = e.currentTarget.value;

    $.ajax({
        url: `/rest/players/${accountId}`,
        type: 'DELETE',
        success: () => {
            updatePlayersCount();
            fillTable(currentPageNumber, accountsPerPage);
        }
    })

}

function updateAccount({accountId, data}){
     $.ajax({
         url:`/rest/players/${accountId}`,
         type: 'POST',
         data: JSON.stringify(data),
         dataType: "json",
         contentType: "application/json",
         success: () => {
             updatePlayersCount();
             fillTable(currentPageNumber, accountsPerPage);
         }
     })
}

function editAccountHandler(e){
    const accountId = e.currentTarget.value;

    const $currentRow = document.querySelector(`.row[data-accounr-id='${accountId}']`);
    const $currentRemoveButton = $currentRow.querySelector('.delete-button');
    const $currentImage = $currentRow.querySelector('.edit-button img');

    const $currentName = $currentRow.querySelector('[data-accounr-name]');
    const $currentTitle = $currentRow.querySelector('[data-accounr-title]');
    const $currentRace = $currentRow.querySelector('[data-accounr-race]');
    const $currentProfession = $currentRow.querySelector('[data-accounr-profession]');
    const $currentBanned = $currentRow.querySelector('[data-accounr-banned]');

    $currentImage.src = '../img/save.png';

    $currentImage.addEventListener('click', () => {
    const params = {
        accountId: accountId,
        data: {
            name: $currentName.childNodes[0].getAttribute('data-value'),
            title: $currentTitle.childNodes[0].getAttribute('data-value'),
            race: $currentRace.childNodes[0].getAttribute('data-value'),
            profession: $currentProfession.childNodes[0].getAttribute('data-value'),
            banned: $currentBanned.childNodes[0].getAttribute('data-value')
        }
    }

    updateAccount(params);
    })
    $currentRemoveButton.classList.add('hidden');

    $currentName.childNodes[0].replaceWith(createInput($currentName.innerHTML))
    $currentTitle.childNodes[0].replaceWith(createInput($currentTitle.innerHTML))
    $currentRace.childNodes[0].replaceWith(createSelect( RACE_ARRAY, $currentRace.innerHTML))
    $currentProfession.childNodes[0].replaceWith(createSelect( PROFESSION_ARRAY, $currentProfession.innerHTML))
    $currentBanned.childNodes[0].replaceWith(createSelect( BANNED_ARRAY, $currentBanned.innerHTML))
}


function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString().split('T')[0];
}

function createInput(vale) {
    const $htmlInputElement = document.createElement('input');

    $htmlInputElement.setAttribute('type', 'text');
    $htmlInputElement.setAttribute('value', vale);
    $htmlInputElement.setAttribute('data-value', vale);

    $htmlInputElement.addEventListener('input', e => {
        $htmlInputElement.setAttribute('data-value', `${e.currentTarget.value}`)
    })

    return $htmlInputElement;
}

function createSelect(optionsArray, defaultValue){

    const $options = createSelectOptions(optionsArray, defaultValue);
    const $htmlSelectElement = document.createElement('select');

    $htmlSelectElement.insertAdjacentHTML("afterbegin", $options);
    $htmlSelectElement.setAttribute('data-value', defaultValue);

    $htmlSelectElement.addEventListener('change', e => {
        $htmlSelectElement.setAttribute('data-value', `${e.currentTarget.value}`)
    })

    return $htmlSelectElement;
}

function createSelectOptions(optionsArray, defaultValue) {
    let optionsHtml = '';
    optionsArray.forEach(option => optionsHtml +=
        `<option ${defaultValue === option && 'selected'} value="${option}">
            ${option} 
        </option>`)

    return optionsHtml;
}


