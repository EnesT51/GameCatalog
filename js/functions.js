let Container = document.getElementById('container');
let WinkelMandje = document.getElementById('winkelmandje');
WinkelMandje.style.display = 'none';

let label = document.createElement('label');
label.innerHTML = 'Choose Genre:';
label.id = 'label';
Container.appendChild(label);

let DropdownList = document.createElement('select');
DropdownList.id = 'DropDownList';
DropdownList.options[0] = new Option('-All Genre-', '');
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

let CalcPrice = document.createElement('p');
CalcPrice.className = 'CalcPrice';

let cartlist = [];

function AppendData(content, item, data) {

    const Removebtn = RemoveBtn(item);
    const Addbtn = AddBtn(item);
    Addbtn.addEventListener('click', () => {
       AddToCartList(Addbtn, data);
    });
    let ul = document.createElement('ul');
    let GameName = document.createElement('li');
    let GamePrice = document.createElement('li');
    GamePrice.id = 'GamePrice';
    const Price = item.price == 0 ? "Price: FREE" : "Price: € " + item.price +',-';
    GamePrice.innerHTML = Price;
    GameName.innerHTML = item.title;
    ul.appendChild(GameName);
    ul.appendChild(GamePrice);
    ul.className = item.title;
    content.appendChild(ul);
    const currentDisplay = Container.style.display != 'none' ? Addbtn : Removebtn;
    Removebtn.addEventListener('click', () => {
        RemoveItem(Removebtn, data);
        console.log(cartlist);
    });
    content.appendChild(currentDisplay);
}

function AddBtn(item){

    let button = document.createElement('button');
    button.className = item.title;
    button.style.width = 'auto';
    button.style.height = 'auto';
    button.textContent = 'Add Cart';

    return button;
}
function RemoveBtn(item){

    let button = document.createElement('button');
    button.className = item.title;
    button.style.width = 'auto';
    button.style.height = 'auto';
    button.textContent = 'Remove';

    return button;
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
        alert(error);
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
            AppendData(GameContentDiv, i, data);
        }
    }else{
        alert('List is empty');
    }
    Container.appendChild(GameContentDiv);
    Container.appendChild(CalculateBtn);

    return json;
}

function CheckIfInputIsDigit(input){

    return /^[0-9]+$/.test(input.value);
}

async function FilterGenre(data){

    const json = await data;
    const dropDownV = DropdownList.options[DropdownList.selectedIndex].text;
    var result = dropDownV === '-All Genre-' ? json : json.filter(obj => obj.genre == dropDownV);
    return result;
}

async function DisplayGamesByGenre(data){

    const d = FilterGenre(data);
    const json = await d;
    GameContentDiv.innerHTML = '';

    for(const i of json){
        if(!json.length == 0){
            AppendData(GameContentDiv, i, data);
        }
    }
    return json;
}

async function filterPrice(data){

    var json;
    json = await FilterGenre(data);
    const result = json.filter(obj => obj.price <= InputField.value);
    GameContentDiv.innerHTML = '';
    for(const i of result){
        if(!result.length == 0){
            AppendData(GameContentDiv, i, data);
        }
    }
}

async function AddToCartList(btn, data){
    
    const d = FilterGenre(data);
    const json = await d;
    for(const i of json){
        if(btn.className == i.title){
            cartlist.push(i);
            alert(`${i.title}: which is €${i.price} Added to your cart!`);
        }    
    }
}

function DisplayCart(data){

    GameContentDiv.innerHTML = '';
    Container.style.display = 'none';
    WinkelMandje.style.display = '';
    for(const i of cartlist){
        AppendData(GameContentDiv, i, data);
    }
    WinkelMandje.appendChild(GameContentDiv);
    CalculatePrice(CalcPrice);
}

function CalculatePrice(price){

    var x = 0;
    for(const i of cartlist){
        x += i.price
    }
    price.innerHTML = `Total: € ${x.toFixed(2)},-`;
    WinkelMandje.appendChild(price);
}

function RemoveItem(Rbtn){

    for(let i = 0; i < cartlist.length; i++){
        if(Rbtn.className == cartlist[i].title){
            Rbtn.remove();
            const x = cartlist.indexOf(cartlist[i]);
            const elm = document.getElementsByClassName(cartlist[i].title);
            console.log(elm);
            if(x > -1){
                cartlist.splice(x, 1);
                elm[0].parentElement.removeChild(elm[0]);
            }
        }
    }
    CalculatePrice(CalcPrice);
}

OkButton.addEventListener("click", () => {

    try{DisplayGamesByGenre(Data);}
    catch(error){alert(error)}
});

SecondOkButton.addEventListener("click", () => {
    try{
        if(CheckIfInputIsDigit(InputField) === true){
            filterPrice(Data);
        }
    }catch(error){alert(error)}
    
});

CalculateBtn.addEventListener('click', () => {

    try{DisplayCart(Data);}
    catch(error){alert(error);}
    
});

let Data = GetData();
DisplayDataInDropDownList(Data);
DisplayGames(Data);
