 const database = supabase.createClient('https://tgyjtmpoyobshnjzukrz.supabase.co','sb_publishable_5aZ7f4gDqje27zLDCwCGKw_xMEEpOgi');

let graf=null;


const kanal = database.channel('live')

kanal.on('broadcast', { event: 'hlasitost' }, (payload) => {
     document.getElementById('live').innerHTML=`Live loudness: ${payload.payload.value} dB`
}).subscribe()





async function vykreslGraf(typGrafu, pocetTicku) {
    const { data, error } = await database
        .from(typGrafu)
        .select('*')


    const hodnoty = data.map(d => d.hlasitost)

    
   const predchozi = { datum: null }
   const casy = data.map(d => casovyFormat(d.datum_cas, typGrafu,predchozi));
    const ctx = document.getElementById('graf').getContext('2d')
    if (graf) graf.destroy();


   console.log(error)
   console.log(data)

    graf=new Chart(ctx, {
        type: 'line',
        data: {
            labels: casy,
            datasets: [{
                label: 'Hlasitost za poslednich 24 hodin',
                data: hodnoty,
                borderColor: 'black',
                pointRadius: 0,
               
            }]
        },
        options: {
    scales: {
        x: {
            ticks: {
                maxTicksLimit: pocetTicku,
                
                font: {
                 
                    size: 14,
                },
                color: 'black',

                callback: function(index) {
            const label = this.getLabelForValue(index)
            if (label !== '') {
    return label   
} else {
    return null   
}
        }
            
            }
              
        },
        y: {
            ticks: {
            
                
                font: {
                 
                    size: 14,
                },
                color: 'black'
            
            },
       min: Math.floor((Math.min(...hodnoty)) / 5) * 5,
    max: Math.ceil((Math.max(...hodnoty)) / 5) * 5,
        }
    },
        responsive: true,
  maintainAspectRatio: false ,
  
  plugins: {
    legend: {
        display: false
    },
   
}  

}
    });
}

function casovyFormat(datum_cas,typGrafu,predchozi){
    const datum = new Date(datum_cas)


    const hh = String(datum.getHours())
    const mm = String(datum.getMinutes()).padStart(2, '0')
const dd = String(datum.getDate());
    const mes = String(datum.getMonth() + 1).padStart(2, '0');

    if(typGrafu=="view_den"){
    return `${hh}:${mm} `
    }
    if(typGrafu=="view_tyden"||typGrafu=="view_tri_dny"){
    return `${dd}/${mes} ${hh}:${mm}`;
    }
     if(typGrafu=="view_vsechno"){

        const aktualniDatum = `${dd}/${mes}`
        if (aktualniDatum == predchozi.datum) {
            return ''
        }
        
         predchozi.datum = aktualniDatum
            return aktualniDatum
    
    }
    return "zadneDatum"
}


function setActive(btn) {
    document.querySelectorAll('.chartPicking').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
}

async function nactiZajimavosti() {
    const { data: max }  = await database.from('view_max').select('*')
    const { data: hodina }  = await database.from('view_nejhlasitejsi_hodina').select('*')
    const { data: prumer }  = await database.from('view_prumer').select('*')
    const { data: nejhlasitejsiDen }  = await database.from('view_nejhlasitejsi_den').select('*')
    const { data: nejtissi }  = await database.from('view_nejtissi_den').select('*')

    document.getElementById('max').innerHTML = `${max[0].max} dB`
    document.getElementById('avg').innerHTML = `${prumer[0].prumer} dB`
    document.getElementById('hour').innerHTML = `${hodina[0].hodina}:00`
    document.getElementById('loudDay').innerHTML = `${nejhlasitejsiDen[0].den}`
    document.getElementById('quietDay').innerHTML = `${nejtissi[0].den}`
}


window.addEventListener('DOMContentLoaded', ()=>{
const denBtn = document.getElementById('day');
const triDenBtn = document.getElementById('threeDays');
const tydenBtn = document.getElementById('Week');
const vseBtn = document.getElementById('Everything');
const zajimavosti = document.getElementById('funFacts');

const nadpis = document.getElementById('chartHeader');


denBtn.addEventListener('click', ()=>{
vykreslGraf('view_den',24);
nadpis.innerHTML='Loudnes for the past 24 hours';
document.getElementById('graf').style.display = 'block'
    document.getElementById('funFactsDiv').style.display = 'none'
        document.getElementById('funFactsDiv').style.display = 'none'
 document.getElementById('wrapper').style.display = 'block'
    setActive(denBtn)
});


triDenBtn.addEventListener('click', ()=>{
vykreslGraf("view_tri_dny",15);
nadpis.innerHTML='Loudnes for the past 3 days';
  document.getElementById('graf').style.display = 'block'
    document.getElementById('funFactsDiv').style.display = 'none'
     document.getElementById('wrapper').style.display = 'block'
    setActive(triDenBtn)
});


tydenBtn.addEventListener('click', ()=>{
vykreslGraf("view_tyden",18);
nadpis.innerHTML='Loudnes for the past week';
  document.getElementById('graf').style.display = 'block'
    document.getElementById('funFactsDiv').style.display = 'none'
     document.getElementById('wrapper').style.display = 'block'
    setActive(tydenBtn)
});


vseBtn.addEventListener('click', ()=>{
vykreslGraf('view_vsechno',20);
nadpis.innerHTML='Loudnes since the begining';
  document.getElementById('graf').style.display = 'block'
    document.getElementById('funFactsDiv').style.display = 'none'
     document.getElementById('wrapper').style.display = 'block'
    setActive(vseBtn)
});


zajimavosti.addEventListener('click', ()=>{
nadpis.innerHTML='Fun facts';
document.getElementById('graf').style.display = 'none'
document.getElementById('funFactsDiv').style.display = 'flex'
 document.getElementById('wrapper').style.display = 'none'
setActive(zajimavosti)
nactiZajimavosti()
});

vykreslGraf('view_den',24);
setActive(denBtn)
});