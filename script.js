const fc = document.getElementById('filter-container');
const frame = document.getElementById('frame');
const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
const style = document.querySelector('style');
const loading = document.getElementById('loading');
const searcher = document.querySelector('#search-bar input');
const detail = document.getElementById('country-detail');
const borderlist = document.getElementById('borderlist');
var data;

document.getElementById('filter-bar').addEventListener('click', (event) => {
    let cur = fc.getAttribute('stat');
    fc.setAttribute('stat', 1 - cur);
});

function get(x) {
    // console.log(x[0]);
    return Object.values(x)[0].common;
}

async function query(name, iscode) {
    frame.style.display = 'none';
    detail.style.display = 'none';
    loading.style.display = 'block';
    let link = `https://restcountries.com/v3.1/name/${name}`;
    if (iscode === 1) {
        link = `https://restcountries.com/v3.1/alpha/${name}`;
    }
    data = await fetch(link);
    data = (await data.json())[0];
    document.querySelector('#img-container img').setAttribute('src', data.flags.png);
    document.getElementById('name').innerHTML = data.name.common;
    document.getElementById('nativename').innerHTML = get(data.name.nativeName);
    document.getElementById('population').innerHTML = data.population.toLocaleString();
    document.getElementById('region').innerHTML = data.region;
    var cap = "";
    if (data.capital) {
        for (i = 0; i < data.capital.length; i++) {
            if (cap.length != 0)
                cap += ', ';
            cap += data.capital[i];
        }
    }
    document.getElementById('Capital').innerHTML = cap;
    cap = "";
    if (data.tld) {
        for (i = 0; i < data.tld.length; i++) {
            if (cap.length != 0)
                cap += ', ';
            cap += data.tld[i];
        }
    }
    document.getElementById('Domains').innerHTML = cap;
    document.getElementById('Sub-region').innerHTML = data.subregion;
    cap = "";
    Object.keys(data.currencies).forEach((x) => {
        if (cap.length != 0)
            cap += ', ';
        cap += x;
    });
    document.getElementById('currencies').innerHTML = cap;
    cap = "";
    Object.values(data.languages).forEach((x) => {
        if (cap.length != 0)
            cap += ', ';
        cap += x;
    });
    document.getElementById('Languages').innerHTML = cap;
    borderlist.innerHTML = "";
    if (data.borders) {
        data.borders.forEach((x) => {
            borderlist.innerHTML += `<label id="${x}" onclick="query(id, 1)">${x}</label>`;
        });
    }
    detail.style.display = 'block';
    loading.style.display = 'none';
}

function printdata() {
    data.forEach((cur) => {
        var cap = "";
        if (cur.capital) {
            for (i = 0; i < cur.capital.length; i++) {
                if (cap.length != 0)
                    cap += ', ';
                cap += cur.capital[i];
            }
        }
        frame.innerHTML += `
            <div class="country" id="${cur.name.common}" region="${cur.region}" onclick="query(id, 0)">
                <img src="${cur.flags.png}" alt="${cur.flags.alt}">
                <div class="info">
                    <h1>${cur.name.common}</h1>
                    <p>Population: ${cur.population.toLocaleString()}</p>
                    <p>Region: ${cur.region}</p>
                    <p>Capital: ${cap}</p>
                </div>
            </div>
        `;
    });
}

async function prepare() {
    loading.style.display = 'block';
    frame.style.display = 'none';
    data = await fetch('https://restcountries.com/v3.1/all');
    data = await data.json();
    printdata();
    loading.style.display = 'none';
    frame.style.display = 'flex';
}

for (i of regions) {
    style.innerHTML += `
        :has(#${i}:checked) :not([region="${i}"]).country{
            display: none;
        } 
    `
}

searcher.addEventListener('keypress', async function(event){
    if (event.key === 'Enter') {
        if (searcher.value.length === 0) {
            prepare();
            return;
        }
        loading.style.display = 'block';
        frame.style.display = 'none';
        data = await fetch(`https://restcountries.com/v3.1/name/${searcher.value}`);
        data = await data.json();
        frame.innerHTML = "";
        if (data.status) {
        } else {
            printdata();
        }
        loading.style.display = 'none';
        frame.style.display = 'flex';
    }
});

document.getElementById('back').addEventListener('click', () => {
    detail.style.display = 'none';
    frame.style.display = 'flex';
});

prepare();