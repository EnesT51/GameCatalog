let Container = document.getElementById('container');
    
let label = document.createElement('label');
label.innerHTML = 'Choose Genre:';
label.id = 'label';
Container.appendChild(label);

let DropdownList = document.createElement('select');
DropdownList.id = 'DropDownList';
DropdownList.options[0] = new Option('--Select Genre--', '');
Container.appendChild(DropdownList);

let OkButton = document.createElement('button');
OkButton.innerHTML = 'Ok';
OkButton.id = 'GenreButton';
Container.appendChild(OkButton);

let InputField = document.createElement('input');
InputField.id = 'InputField';
InputField.setAttribute('type', 'text');
Container.appendChild(InputField);

let SecondOkButton = document.createElement('button');
SecondOkButton.id = 'SecondOkButton';
SecondOkButton.innerHTML = 'Ok';
Container.appendChild(SecondOkButton);

let GameContentDiv = document.createElement('div');
GameContentDiv.id = "GameContent";

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
    const genrelist = []

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
            let ul = document.createElement('ul');
            let GameInfo = document.createElement('li');
            let GamePrice = document.createElement('li');
            GamePrice.id = 'GamePrice';
            GamePrice.innerHTML = "Price: € " + i.price +',-';
            GameInfo.innerHTML = i.title;
            ul.appendChild(GameInfo);
            ul.appendChild(GamePrice);
            GameContentDiv.appendChild(ul);
        }
    }else{
        console.log('List is empty');
    }
    Container.appendChild(GameContentDiv);
}

function s(){
    
    var text = DropdownList.options[DropdownList.selectedIndex].text;
    
    return text;
}

let Data = GetData();
DisplayDataInDropDownList(Data);
DisplayGames(Data);

OkButton.addEventListener("click", () => {

    console.log(s());

});
