const dailyPlans = {
    lun: {
        title: "Lunedì: Forza & Integrità Articolare",
        kcal: "1900",
        training: [
            { name: "Glute Bridge Pro", videoId: "u6ZelKyUM6g", note: "Protezione ginocchio via gluteo.", breathing: "💨 ESPIRA IN SALITA", sets: "4", reps: "15", rest: "60s" },
            { name: "Wall Sit Clinical", videoId: "X7u687k1WlE", note: "Isometria per stabilità rotulea.", breathing: "💨 DIAFRAMMATICA CONTINUA", sets: "3", reps: "45s", rest: "60s" }
        ],
        meals: [
            { type: "batch", time: "Colazione", name: "Oatmeal Anti-Reflusso con Banana", rationale: "L'avena crea una barriera mucosa; la banana è alcalina." },
            { type: "batch", time: "Pranzo", name: "Pollo al Vapore & Riso Basmati", rationale: "Zero grassi aggiunti per prevenire il rilascio del LES." },
            { type: "fresh", time: "Cena", name: "Orata al Cartoccio con Zucchine", rationale: "Estremamente digeribile prima del sonno." }
        ],
        science: [
            { head: "Mucosa Gastrica", body: "L'avena contiene beta-glucani che proteggono l'esofago durante lo sforzo fisico." },
            { head: "Vasto Mediale", body: "L'allineamento ginocchio-caviglia previene lo stress valgo durante il Wall Sit." }
        ]
    },
    mar: {
        title: "Martedì: Metabolic Power Walk",
        kcal: "1850",
        training: [
            { name: "Incline Power Walk", videoId: "zH0EonG9uDI", note: "Inclinazione 5-8% per catena posteriore.", breathing: "💨 RITMO 3:3", sets: "1", reps: "30 min", rest: "-" }
        ],
        meals: [
            { type: "batch", time: "Colazione", name: "Pancake Albumi & Farina d'Avena", rationale: "Proteine ad assorbimento lento per la camminata post-work." },
            { type: "batch", time: "Pranzo", name: "Tacchino & Patate Dolci", rationale: "Vitamina A per la sintesi del collagene tendineo." },
            { type: "fresh", time: "Cena", name: "Tofu Piastrato & Carote al vapore", rationale: "Isoflavoni per supportare la densità minerale ossea." }
        ],
        science: [
            { head: "Glute Drive", body: "Camminare in pendenza sposta il carico dalle ginocchia ai glutei (Posterior Chain)." },
            { head: "Sintesi Proteica", body: "Il Tofu fornisce amminoacidi essenziali con impegno digestivo minimo." }
        ]
    },
    mer: {
        title: "Mercoledì: Posterior Chain Focus",
        kcal: "1950",
        training: [
            { name: "Dumbbell RDL Pro", videoId: "_oyxCn2iSno", note: "Hip hinge puro per glutei e femorali.", breathing: "💨 INSPIRA GIÙ, ESPIRA SU", sets: "4", reps: "12", rest: "90s" }
        ],
        meals: [
            { type: "fresh", time: "Colazione", name: "Biscotti d'Avena Homemade & Yogurt (Low Fat)", rationale: "Snack denso ma senza grassi idrogenati irritanti." },
            { type: "fresh", time: "Pranzo", name: "Pasta Integrale con Salmone al vapore", rationale: "Omega-3 per ridurre l'infiammazione articolare (Knee Support)." },
            { type: "fresh", time: "Cena", name: "Maiale Lean (Arista) & Spinaci", rationale: "Zinco per il recupero cellulare e la salute dello stomaco." }
        ],
        science: [
            { head: "Valvola LES", body: "Il grasso del salmone è sano, ma va limitato a pranzo per evitare reflusso pomeridiano." },
            { head: "Respirazione Valsalva", body: "Trattenere il fiato nel RDL stabilizza la colonna, ma attenzione alla pressione esofagea." }
        ]
    },
    gio: {
        title: "Giovedì: Hip & Knee Mobility",
        kcal: "1800",
        training: [
            { name: "Mobilità Anca Isometria", videoId: "X7u687k1WlE", note: "Sessione di scarico per rigenerare i tessuti.", breathing: "💨 RESPIRAZIONE PROFONDA", sets: "3", reps: "10 min", rest: "-" }
        ],
        meals: [
            { type: "batch", time: "Colazione", name: "Bowl di Avena, Pere e Mandorle", rationale: "La pera è meno acida della mela; le mandorle offrono magnesio." },
            { type: "fresh", time: "Pranzo", name: "Ricciola Erbe Aromatiche & Quinoa", rationale: "Proteine nobili ad altissima digeribilità." },
            { type: "fresh", time: "Cena", name: "Manzo Lean (Tagliata) & Patate", rationale: "Ferro biodisponibile per il trasporto di ossigeno muscolare." }
        ],
        science: [
            { head: "Ferro Eme", body: "Il manzo magro è tollerato se cotto a puntino, evitando croste bruciate (acide)." }
        ]
    },
    ven: {
        title: "Venerdì: Total Body Resilience",
        kcal: "1900",
        training: [
            { name: "Banded Glute Bridge", videoId: "u6ZelKyUM6g", note: "Aggiungi elastico sopra le ginocchia.", breathing: "💨 ESPIRA IN SFORZO", sets: "4", reps: "20", rest: "60s" }
        ],
        meals: [
            { type: "batch", time: "Colazione", name: "Omelette di Albumi e Banana", rationale: "Mix glucidico-proteico ottimale per il pre-workout serale." },
            { type: "fresh", time: "Pranzo", name: "Spada alla griglia & Melanzane (Sbucciate)", rationale: "Lo spada è denso di proteine, la melanzana sbucciata è sicura per GERD." },
            { type: "fresh", time: "Cena", name: "Uova in camicia & Pane Tostato", rationale: "L'uovo in camicia è la forma più digeribile di assunzione proteica." }
        ],
        science: [
            { head: "Bioavaliauilità", body: "L'uovo fornisce colina, essenziale per la funzione muscolare." }
        ]
    },
    sab: {
        title: "Sabato: Weekend Performance",
        kcal: "2000",
        training: [
            { name: "Full Body Dumbbells", videoId: "_oyxCn2iSno", note: "Integra movimenti d'anca con pesi da 12.5kg.", breathing: "💨 GESTIONE PRESSIONE", sets: "4", reps: "10", rest: "90s" }
        ],
        meals: [
            { type: "fresh", time: "Colazione Calma", name: "Toast Integrale, Uovo & Tofu", rationale: "Colazione rituale per stabilità glicemica nel weekend." },
            { type: "fresh", time: "Pranzo", name: "Pasta con Tonno Fresco & Zucchine", rationale: "Tonno ricco di taurina per il recupero cardiaco." },
            { type: "fresh", time: "Cena", name: "Spezzatino di Tacchino & Patate dolci", rationale: "Mix ideale per il recupero post-intensivo." }
        ],
        science: [
            { head: "Ricarica Glicogenica", body: "Le patate dolci offrono energia stabile senza picchi insulinici." }
        ]
    },
    dom: {
        title: "Domenica: Deep Rest & Prep",
        kcal: "1750",
        training: [
            { name: "Scarico Totale", videoId: "", note: "Focus su respirazione e preparazione pasti.", breathing: "💨 RITMO PARASIMPATICO", sets: "-", reps: "-", rest: "-" }
        ],
        meals: [
            { type: "batch", time: "Colazione", name: "Smoothie di Banana e Mandorle", rationale: "Digeribilità istantanea per il giorno di riposo." },
            { type: "batch", time: "Pranzo", name: "Risotto allo Zafferano (Light) & Bresaola", rationale: "Piatto comfort ma tecnicamente controllato." },
            { type: "fresh", time: "Cena", name: "Zuppa di Orzo & Zucca", rationale: "Piatto ultra-lenitivo per resettare il sistema." }
        ],
        science: [
            { head: "Rigenerazione Vago", body: "Il riposo favorisce il tono vagale, migliorando lo stomaco." }
        ]
    }
};

document.querySelectorAll('.week-nav li').forEach(li => {
    li.addEventListener('click', () => {
        const day = li.getAttribute('data-day');
        if (dailyPlans[day]) {
            updateDashboard(day);
            document.querySelector('.week-nav li.active').classList.remove('active');
            li.classList.add('active');
        }
    });
});

function updateDashboard(day) {
    const plan = dailyPlans[day];
    document.getElementById('current-day-title').innerText = plan.title;
    document.querySelector('.main-header .stat:nth-child(1)').innerHTML = `<span>Target</span> ${plan.kcal} kcal`;

    const exerciseGrid = document.querySelector('.exercise-grid');
    exerciseGrid.innerHTML = plan.training.map(ex => `
        <div class="exercise-card">
            <div class="exercise-visual professional-video">
                ${ex.videoId ? `<iframe width="100%" height="240" src="https://www.youtube.com/embed/${ex.videoId}" title="${ex.name}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>` : '<div class="rest-visual">REST DAY</div>'}
                <div class="breathing-overlay">
                    <span class="b-text">${ex.breathing}</span>
                </div>
            </div>
            <div class="exercise-details">
                <h3>${ex.name}</h3>
                <p class="anatomical-note">${ex.note}</p>
                <ul class="sets">
                    <li><span>Set</span> ${ex.sets}</li>
                    <li><span>${ex.reps.includes('s') || ex.reps.includes('min') ? 'Time' : 'Reps'}</span> ${ex.reps}</li>
                    <li><span>Rest</span> ${ex.rest}</li>
                </ul>
            </div>
        </div>
    `).join('');

    const mealList = document.querySelector('.meal-list');
    mealList.innerHTML = plan.meals.map(meal => `
        <div class="meal-item">
            <div class="meal-time"><span class="dot ${meal.type}"></span> ${meal.time}</div>
            <div class="meal-desc">
                <h4>${meal.name}</h4>
                <p class="biochemical-note"><strong>Rationale</strong>: ${meal.rationale}</p>
            </div>
        </div>
    `).join('');

    const scienceContent = document.getElementById('science-content');
    scienceContent.innerHTML = plan.science ? plan.science.map(s => `
        <div class="science-item">
            <h5>${s.head}</h5>
            <p>${s.body}</p>
        </div>
    `).join('') : '<div class="science-item"><h5>Protocollo Generale</h5><p>Focus rigenerazione.</p></div>';
}

updateDashboard('lun');
