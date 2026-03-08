 const database = supabase.createClient('https://tgyjtmpoyobshnjzukrz.supabase.co','sb_publishable_5aZ7f4gDqje27zLDCwCGKw_xMEEpOgi');

let graf=null;




async function vykreslGraf(typGrafu, pocetTicku) {
    const { data, error } = await database
        .from(typGrafu)
        .select('*')

    const hodnoty = data.map(d => d.hlasitost)

    
   const predchozi = { datum: null }
   const casy = data.map(d => casovyFormat(d.datum_cas, typGrafu,predchozi));



    const ctx = document.getElementById('grafDen').getContext('2d')
    if (graf) graf.destroy();

    graf=new Chart(ctx, {
        type: 'line',
        data: {
            labels: casy,
            datasets: [{
                label: 'Hlasitost za poslednich 24 hodin',
                data: hodnoty,
                borderColor: 'rgb(0, 0, 0)',
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
        min: Math.min(...hodnoty) - 5,
    max: Math.max(...hodnoty) + 5,
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




window.addEventListener('DOMContentLoaded', ()=>{
const denBtn = document.getElementById('day');
const triDenBtn = document.getElementById('threeDays');
const tydenBtn = document.getElementById('Week');
const vseBtn = document.getElementById('Everything');


denBtn.addEventListener('click', ()=>{
vykreslGraf('view_den',24);
});
triDenBtn.addEventListener('click', ()=>{
vykreslGraf("view_tri_dny",15);
});
tydenBtn.addEventListener('click', ()=>{
vykreslGraf("view_tyden",18);
});
vseBtn.addEventListener('click', ()=>{
vykreslGraf('view_vsechno',20);
});


vykreslGraf('view_den',24);
});