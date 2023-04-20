let Container = document.getElementById('container');
let WinkelMandje = document.getElementById('winkelmandje');

let label = document.createElement('label');
label.innerHTML = 'Choose Genre:';
label.id = 'label';
Container.appendChild(label);

let DropdownList = document.createElement('select');
DropdownList.id = 'DropDownList';
DropdownList.options[0] = new Option('--Select Genre--', '');
DropdownList.options[1] = new Option('-Show All-', '');
DropdownList.options[0].disabled = true;
DropdownList.options[0].style.display = 'none';
Container.appendChild(DropdownList);

let OkButton = document.createElement('button');
OkButton.innerHTML = 'Filter';
OkButton.id = 'GenreButton';
Container.appendChild(OkButton);

let InputField = document.createElement('input');
InputField.id = 'InputField';
InputField.placeholder = 'Price';
InputField.setAttribute('type', 'number');
Container.appendChild(InputField);

let SecondOkButton = document.createElement('button');
SecondOkButton.id = 'SecondOkButton';
SecondOkButton.innerHTML = 'Filter';
Container.appendChild(SecondOkButton);

let CalculateBtn = document.createElement('button');
CalculateBtn.innerHTML = 'Bereken';
CalculateBtn.id = 'CalculateBtn';

let GameContentDiv = document.createElement('div');
GameContentDiv.id = "GameContent";

function AppendData(content, item) {

    let ul = document.createElement('ul');
    let GameName = document.createElement('li');
    let GamePrice = document.createElement('li');
    GamePrice.id = 'GamePrice';
    GamePrice.innerHTML = "Price: € " + item.price +',-';
    GameName.innerHTML = item.title;
    ul.appendChild(GameName);
    ul.appendChild(GamePrice);
    content.appendChild(ul);
}

async function GetData(){
    let GameList = [];
    await fetch('json/games.json')
    .then(response => response.json())
    .then(data =>{
        data.forEach(element => {
            GameList.push(element);
        });
    })
    .catch(error => {
        console.log(error);
    });
    return GameList;
}

async function DisplayDataInDropDownList(data){

    const json = await data;
    const genrelist = [];

    for(const x of json){
        if(!genrelist.includes(x.genre)){
            genrelist.push(x.genre);
        }
    }
    for(const i of genrelist){
        let option = document.createElement('option');
        option.text = i;
        DropdownList.add(option);
    }
}
async function DisplayGames(data){

    const json = await data;

    if(!json.length == 0){
        for(const i of json){
            AppendData(GameContentDiv, i);
        }
    }else{
        console.log('List is empty');
    }
    Container.appendChild(GameContentDiv);
    Container.appendChild(CalculateBtn);

    return json;
}

function CheckIfInputIsDigit(input){

    return /^[0-9+$]/.test(input.value);
}

async function Filter(data){

    const json = await data;
    const dropDownV = DropdownList.options[DropdownList.selectedIndex].text;
    console.log(dropDownV);
    const result = json.filter(obj => obj.genre == dropDownV);

    return result;
}
async function FilterGamesByGenre(data){

    const d = Filter(data);
    const json = await d;
    GameContentDiv.innerHTML = '';

    for(const i of json){
        if(!json.length == 0){
            AppendData(GameContentDiv, i);
        }
    console.log();
    }if(DropdownList.options[DropdownList.selectedIndex].text === '-Show All-'){
        DisplayGames(data);
    }

    return json;
}
async function CheckIf(data){

    if(DropdownList.options[DropdownList.selectedIndex].text === '-Show All-'){
        const json = await DisplayGames(data);
        const result = json.filter(obj => obj.price < InputField.value);
        GameContentDiv.innerHTML = '';
        for(const i of result){
            if(!json.length == 0){
                AppendData(GameContentDiv, i);
                console.log('2');
            }
        }
    }else{
        const json = await Filter(Data);
        const result = json.filter(obj => obj.price < InputField.value);
        GameContentDiv.innerHTML = '';
        for(const i of result){
            if(!json.length == 0){
                AppendData(GameContentDiv, i);
                console.log('2');
            }
        }
    }
    
}

OkButton.addEventListener("click", () => {

    FilterGamesByGenre(Data);
});

SecondOkButton.addEventListener("click", async () => {
    if(CheckIfInputIsDigit(InputField) === true){

        CheckIf(Data);
    }
});


let Data = GetData();
DisplayDataInDropDownList(Data);
DisplayGames(Data);