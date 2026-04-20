/**
 * OdusIA Constants & Static Data
 */

export const DESTINATIONS = {
  giappone: {
    emoji: '🇯🇵', flag: 'Giappone',
    best: 'Marzo–Maggio (fiori di ciliegio) e Ottobre–Novembre (foglie autunnali)',
    avoid: 'Luglio–Agosto (caldo umido e tifoni)',
    budget: '€80–€150/giorno (media)',
    visto: 'Non richiesto per italiani (soggiorno fino a 90 giorni)',
    tips: ['Compra un IC Card (Suica) per i trasporti', 'Prenota il Pass JR in anticipo dall\'Italia', 'I ryokan (inn tradizionali) sono un\'esperienza imperdibile'],
    highlights: ['Tokyo', 'Kyoto', 'Osaka', 'Hiroshima', 'Hakone (Monte Fuji)'],
    tags: ['asia', 'cultura', 'gastronomia', 'natura']
  },
  bali: {
    emoji: '🇮🇩', flag: 'Bali, Indonesia',
    best: 'Aprile–Ottobre (stagione secca)',
    avoid: 'Novembre–Marzo (monsoni)',
    budget: '€30–€70/giorno',
    visto: 'Visa on Arrival (30 giorni, ~€30)',
    tips: ['Affitta uno scooter per muoverti', 'Rispetta i rituali locali (copri le spalle ai templi)', 'Ubud per la cultura, Seminyak per la movida'],
    highlights: ['Ubud', 'Seminyak', 'Uluwatu', 'Nusa Penida', 'Tegalalang (risaie)'],
    tags: ['asia', 'mare', 'relax', 'avventura', 'esotico']
  },
  toscana: {
    emoji: '🇮🇹', flag: 'Toscana, Italia',
    best: 'Aprile–Giugno e Settembre–Ottobre',
    avoid: 'Agosto (troppo caldo e affollato)',
    budget: '€70–€140/giorno',
    visto: 'Nessuno (zona Schengen)',
    tips: ['Noleggia un\'auto per i borghi medievali', 'Prenota in anticipo a Firenze (Uffizi)', 'Partecipa a una degustazione di Chianti'],
    highlights: ['Firenze', 'Siena', 'San Gimignano', 'Pisa', 'Volterra'],
    tags: ['europa', 'cultura', 'gastronomia', 'romantico']
  },
  maldive: {
    emoji: '🇲🇻', flag: 'Maldive',
    best: 'Novembre–Aprile (stagione secca)',
    avoid: 'Maggio–Ottobre (stagione delle piogge)',
    budget: '€150–€500+/giorno (resort esclusivi)',
    visto: 'Visto gratuito all\'arrivo (30 giorni)',
    tips: ['Prenota un resort con bungalow sull\'acqua', 'Snorkeling e diving tra le mete migliori al mondo', 'Considera i resort "all inclusive" per risparmiare'],
    highlights: ['Malé', 'Atollo di Ari', 'Rangali', 'Maafushi (budget-friendly)'],
    tags: ['mare', 'relax', 'luna di miele', 'esotico', 'lusso']
  },
  newyork: {
    emoji: '🇺🇸', flag: 'New York, USA',
    best: 'Aprile–Giugno e Settembre–Novembre',
    avoid: 'Luglio–Agosto (caldo estremo) e Gennaio–Febbraio (freddo polare)',
    budget: '€150–€300/giorno',
    visto: 'ESTA obbligatoria (€21, richiesta online prima della partenza)',
    tips: ['Compra il MetroCard settimanale', 'Prenota i musei principali online', 'I bagel e la pizza al taglio sono economici e deliziosi'],
    highlights: ['Central Park', 'Museum of Modern Art', 'Brooklyn Bridge', 'Times Square', 'Statue of Liberty'],
    tags: ['nord america', 'cultura', 'shopping', 'vita notturna']
  },
  portogallo: {
    emoji: '🇵🇹', flag: 'Portogallo',
    best: 'Aprile–Giugno e Settembre–Ottobre',
    avoid: 'Luglio–Agosto (caldo e affollato)',
    budget: '€50–€100/giorno',
    visto: 'Nessuno (zona Schengen)',
    tips: ['Lisbona è ottima per il tram 28', 'Il Pastéis de Belém è imperdibile', 'Porto + vino do Porto = combo perfetto'],
    highlights: ['Lisbona', 'Porto', 'Sintra', 'Algarve', 'Évora'],
    tags: ['europa', 'cultura', 'gastronomia', 'budget', 'romantico']
  },
  marocco: {
    emoji: '🇲🇦', flag: 'Marocco',
    best: 'Marzo–Maggio e Settembre–Novembre',
    avoid: 'Luglio–Agosto (caldo estremo nel deserto)',
    budget: '€30–€60/giorno',
    visto: 'Non richiesto per italiani (90 giorni)',
    tips: ['Contratta sempre nei souk (mercati)', 'Visita il deserto del Sahara da Merzouga', 'Assaggia il tajine e il cous cous locali'],
    highlights: ['Marrakech', 'Fes', 'Chefchaouen', 'Essaouira', 'Sahara'],
    tags: ['africa', 'cultura', 'avventura', 'esotico', 'budget']
  },
  islanda: {
    emoji: '🇮🇸', flag: 'Islanda',
    best: 'Giugno–Agosto (mezzanotte solare) o Dicembre–Febbraio (aurora boreale)',
    avoid: 'Aprile–Maggio (clima instabile)',
    budget: '€120–€200/giorno (è cara!)',
    visto: 'Non richiesto (zona Schengen)',
    tips: ['Noleggia un 4x4 per le strade F', 'Prenota il Golden Circle in anticipo', 'Le piscine geotermiche sono economiche e locali'],
    highlights: ['Reykjavik', 'Golden Circle', 'Jokulsarlon', 'Vestfirðir', 'Aurora Boreale'],
    tags: ['europa', 'natura', 'avventura', 'aurora boreale', 'unico']
  },
  thailandia: {
    emoji: '🇹🇭', flag: 'Thailandia',
    best: 'Novembre–Marzo (stagione secca e fresca)',
    avoid: 'Maggio–Ottobre (monsoni)',
    budget: '€25–€60/giorno',
    visto: 'Non richiesto per 30 giorni (dal 2024 esteso a 60 giorni)',
    tips: ['Il cibo di strada è sicuro e delizioso', 'Rispetta i templi (vesti in modo coprente)', 'Usa grab (taxi app) invece dei tuk-tuk truffa'],
    highlights: ['Bangkok', 'Chiang Mai', 'Phuket', 'Koh Samui', 'Pai'],
    tags: ['asia', 'mare', 'cultura', 'gastronomia', 'budget']
  },
  grecia: {
    emoji: '🇬🇷', flag: 'Grecia',
    best: 'Maggio–Giugno e Settembre (meno folla, prezzi ok)',
    avoid: 'Luglio–Agosto (sovraffollato e costoso)',
    budget: '€60–€120/giorno',
    visto: 'Nessuno (zona Schengen)',
    tips: ['Santorini in maggio o settembre per i prezzi migliori', 'Esplora isole meno note: Sifnos, Milos, Folegandros', 'Il vino locale e il gyros sono economici'],
    highlights: ['Santorini', 'Mykonos', 'Atene (Acropoli)', 'Creta', 'Rodi'],
    tags: ['europa', 'mare', 'storia', 'romantico']
  },
  peru: {
    emoji: '🇵🇪', flag: 'Perù',
    best: 'Maggio–Settembre (stagione secca)',
    avoid: 'Novembre–Marzo (stagione delle piogge in Amazzonia)',
    budget: '€40–€80/giorno',
    visto: 'Non richiesto (90 giorni)',
    tips: ['Prenota Machu Picchu con mesi di anticipo', 'Acclimatati a Cusco prima dei trek ad alta quota', 'I ceviche di Lima sono tra i migliori al mondo'],
    highlights: ['Machu Picchu', 'Lima', 'Cusco', 'Lago Titicaca', 'Valle Sacra'],
    tags: ['sud america', 'avventura', 'storia', 'natura', 'trekking']
  },
  dubai: {
    emoji: '🇦🇪', flag: 'Dubai, UAE',
    best: 'Ottobre–Aprile (clima mite)',
    avoid: 'Giugno–Agosto (caldo insopportabile, fino a 45°C)',
    budget: '€100–€300/giorno',
    visto: 'Non richiesto per italiani (30 giorni on arrival)',
    tips: ['Il Dubai Mall e Burj Khalifa sono imperdibili', 'Rispetta la cultura locale (dress code)', 'Visita il Dubai Frame per viste mozzafiato'],
    highlights: ['Burj Khalifa', 'Dubai Mall', 'Desert Safari', 'Palm Jumeirah', 'Old Dubai (Deira)'],
    tags: ['medio oriente', 'lusso', 'shopping', 'moderno']
  }
};

export const HOTEL_REPOSITORY = [
  {
    "zone": "VALLE D'AOSTA",
    "icon": "fa-mountain",
    "hotels": [
      {
        "name": "Auberge de la Maison",
        "focus": "Tradizione",
        "spa": "Piscina interna + esterna riscaldata vista Monte Bianco, idromassaggio",
        "distanceKm": 215,
        "distanceTime": "2h 20m",
        "price": "€380-550",
        "rating": 9.8,
        "link": "https://www.aubergemaison.it",
        "details": {
          "description": "Un rifugio d'altri tempi ai piedi del massiccio del Monte Bianco. L'Auberge incarna l'anima della montagna con legni antichi, camini accesi e una vista che toglie il fiato. Il centro 'La Maison de l'Eau' offre un'esperienza di benessere alpino autentico.",
          "spa_size": "1.000 m²",
          "pools": {
            "internal": 1,
            "external": 1,
            "desc": "Piscina riscaldata che prosegue dall'interno all'esterno con vista ghiacciaio"
          },
          "location": "Courmayeur - Entrèves (1.300m). Posizione privilegiata di fronte al Monte Bianco.",
          "highlights": [
            "Vista Iconica sul Monte Bianco",
            "Trattamenti Alpini con estratti locali",
            "Cucina Tradizionale d'eccellenza"
          ]
        }
      },
      {
        "name": "Aethos Monterosa",
        "focus": "Design/Sport",
        "spa": "Piscina interna semi-olimpionica + esterna tra i larici, saune bio",
        "distanceKm": 175,
        "distanceTime": "2h 10m",
        "price": "€280-440",
        "rating": 9.5,
        "link": "https://aethos.com/monterosa/",
        "details": {
          "description": "Il primo active-luxury resort delle Alpi. Un mix audace di architettura moderna e amore per lo sport. Ideale per chi cerca l'avventura senza rinunciare al comfort di un design d'avanguardia.",
          "spa_size": "1.500 m²",
          "pools": {
            "internal": 1,
            "external": 1,
            "desc": "Vasca interna da 25 metri (semionlimpionica) + Idromassaggio esterno panoramico"
          },
          "location": "Champoluc - Val d'Ayas (1.570m). Hub perfetto per sci e trekking ad alto livello.",
          "highlights": [
            "Piscina Indoor 25m",
            "Pareti Arrampicata (Indoor 12m + Outdoor Ghiaccio)",
            "Design Alpino Modernista"
          ]
        }
      },
      {
        "name": "Principe delle Nevi",
        "focus": "Vibe/Social",
        "spa": "Piscina esterna riscaldata on-the-slopes + interna di design",
        "distanceKm": 190,
        "distanceTime": "2h 25m",
        "price": "€340-520",
        "rating": 9.4,
        "link": "https://themlegacy.com/principe-delle-nevi",
        "details": {
          "description": "Cool, vibrante e situato direttamente sulle piste di Cervinia. Il Principe delle Nevi è il luogo dove il lusso incontra l'energia. Atmosfera cosmopolita e la miglior terrazza per l'après-ski della zona.",
          "spa_size": "1.000 m²",
          "pools": {
            "internal": 1,
            "external": 1,
            "desc": "Piscina esterna riscaldata 'on-the-slopes' + piscina interna di design"
          },
          "location": "Breuil-Cervinia (2.050m). Posizione Ski-in/Ski-out totale.",
          "highlights": [
            "Miglior Après-Ski di Cervinia",
            "Design Contemporaneo",
            "Vibe Cosmopolita"
          ]
        }
      },
      {
        "name": "Miramonti Cogne",
        "focus": "Isolamento",
        "spa": "Doppia piscina riscaldata interna/esterna fronte Gran Paradiso",
        "distanceKm": 198,
        "distanceTime": "2h 30m",
        "price": "€280-410",
        "rating": 9.6,
        "link": "https://www.miramonticogne.com",
        "details": {
          "description": "Un'oasi di pace affacciata sulla prateria di Sant'Orso. Eleganza discreta e un'ospitalità che fa sentire subito a casa, circondati dalla natura selvaggia del Parco Nazionale.",
          "spa_size": "800 m²",
          "pools": {
            "internal": 1,
            "external": 1,
            "desc": "Piscina panoramica interna ed esterna collegata con vista Gran Paradiso"
          },
          "location": "Cogne (1.534m). Adiacente alla prateria di Sant'Orso e al Parco Nazionale.",
          "highlights": [
            "Silent Luxury",
            "Vista Ghiacciaio dal Letto",
            "Cucina Gourmet Km 0"
          ]
        }
      }
    ]
  },
  {
    "zone": "TRENTINO / ALTO ADIGE",
    "icon": "fa-pines",
    "hotels": [
      {
        "name": "Sporthotel Sonne",
        "focus": "Autorità/Isolamento",
        "spa": "Infinity pool esterna panoramica + piscina interna zen, saune fieno",
        "distanceKm": 310,
        "distanceTime": "3h 45m",
        "price": "€350-500",
        "rating": 9.9,
        "link": "https://www.sporthotelsonne.com",
        "details": {
          "description": "Un'icona dell'ospitalità alpina situata nel cuore pulsante dell'Alpe di Siusi. Lo Sporthotel Sonne fonde un design contemporaneo in legno e vetro con una posizione unica che permette di sciare direttamente dalla porta.",
          "spa_size": "2.500 m²",
          "pools": {
            "internal": 1,
            "external": 1,
            "desc": "Infinity pool riscaldata vista Dolomiti + Piscina interna Zen"
          },
          "location": "Alpe di Siusi (1.800m). Accesso Ski-in/Ski-out totale in mezzo alle piste.",
          "highlights": [
            "Accesso Diretto Piste (Ski-in/out)",
            "Posizione dominante sull'Alpe",
            "Sauna al Fieno d'Alpeggio"
          ]
        }
      },
      {
        "name": "Adler Spa Resort Dolomiti",
        "focus": "Wellness",
        "spa": "Mondo delle acque con piscine riscaldate interne/esterne, laghetto salato",
        "distanceKm": 315,
        "distanceTime": "3h 50m",
        "price": "€400-600",
        "rating": 9.7,
        "link": "https://www.adler-resorts.com",
        "details": {
          "description": "Un santuario della rigenerazione nel cuore della Val Gardena. Il mondo delle acque 'Aguana' (3.500 m²) è tra i più completi dell'arco alpino, offrendo un'immersione totale nel benessere.",
          "spa_size": "3.500 m²",
          "pools": {
            "internal": 2,
            "external": 3,
            "desc": "Laghetto alpino salato, piscina salina interna-esterna, vasche idromassaggio"
          },
          "location": "Ortisei (1.236m). Cuore della Val Gardena con parco privato di 9.000 m².",
          "highlights": [
            "Mondo Aguana (3.500 m²)",
            "Medical SPA d'Eccellenza",
            "Parco Privato in Centro"
          ]
        }
      },
      {
        "name": "My Arbor",
        "focus": "Design/Bosco",
        "spa": "Piscina interna ed esterna riscaldata sospesa tra i larici, saune bio, rituali Arboris",
        "distanceKm": 310,
        "distanceTime": "3h 15m",
        "price": "€380-550",
        "rating": 9.9,
        "link": "https://www.my-arbor.com",
        "details": {
          "description": "L'hotel casa-sull'albero definitivo. My Arbor sorge su palafitte tra i larici della Plose. Un rifugio per 'adults-only' dove l'architettura si fonde letteralmente con il bosco circostante.",
          "spa_size": "2.500 m²",
          "pools": {
            "internal": 1,
            "external": 1,
            "desc": "Piscina indoor-outdoor infinity sospesa tra le chiome degli alberi"
          },
          "location": "S. Leonardo, Bressanone (1.000m). Dominante sulla valle Isarco.",
          "highlights": [
            "Architettura su Palafitte",
            "Adults Only Concept",
            "SPA Arboris Sensoriale"
          ]
        }
      },
      {
        "name": "Hotel Belvedere",
        "focus": "Panorama/Design",
        "spa": "Infinity pool esterna fronte Dolomiti + piscina interna vetrata, biosauna alle erbe",
        "distanceKm": 285,
        "distanceTime": "3h 10m",
        "price": "€280-410",
        "rating": 9.6,
        "link": "https://www.belvedere-hotel.it",
        "details": {
          "description": "Una terrazza panoramica su Bolzano. Il Belvedere offre una delle infinity pool più suggestive d'Europa, combinando linee moderne e un legame profondo con il territorio del Salto.",
          "spa_size": "1.500 m²",
          "pools": {
            "internal": 1,
            "external": 1,
            "desc": "Infinity pool panoramica mozzafiato sospesa sulle Dolomiti"
          },
          "location": "San Genesio Atesino (1.087m). Vista spettacolare sul Catinaccio e lo Sciliar.",
          "highlights": [
            "Infinity Pool Sospesa",
            "Terrazza Panoramica 360°",
            "Design Architettonico Iconico"
          ]
        }
      },
      {
        "name": "Naturhotel Lüsnerhof",
        "focus": "Bio/Natura",
        "spa": "Bagno naturale esterno, piscina interna/esterna salina, percorso kneipp nel bosco",
        "distanceKm": 325,
        "distanceTime": "3h 30m",
        "price": "€310-480",
        "rating": 9.7,
        "link": "https://www.luesnerhof.it",
        "details": {
          "description": "Pioniere della 'Naturellness'. Al Lüsnerhof si vive il benessere primordiale tra grotte di roccia e ruscelli naturali. Una rigenerazione autentica focalizzata sul contatto materico con la terra.",
          "spa_size": "2.000 m²",
          "pools": {
            "internal": 1,
            "external": 1,
            "desc": "Laghetto naturale bio esterno + piscina in pietra naturale salina"
          },
          "location": "Val Luson (1.100m). Una valle appartata e intatta vicino a Bressanone.",
          "highlights": [
            "SPA Naturellness® Integrata",
            "10 Saune nel Bosco",
            "Bagno nella Grotta di Roccia"
          ]
        }
      }
    ]
  },
  {
    "zone": "LAGO DI GARDA",
    "icon": "fa-water",
    "hotels": [
      {
        "name": "Palace Hotel Desenzano",
        "focus": "Design",
        "spa": "Piscina interna panoramica riscaldata + esterna, saune, aree relax",
        "distanceKm": 120,
        "distanceTime": "1h 30m",
        "price": "€140-180",
        "rating": 9.3,
        "link": "https://palacehoteldesenzano.it",
        "details": {
          "description": "Eleganza contemporanea a Desenzano. Un ambiente chic che vanta una delle migliori viste sul Lago di Garda dal suo piano attico vetrato.",
          "spa_size": "600 m²",
          "pools": {
            "internal": 1,
            "external": 1,
            "desc": "Rooftop Pool riscaldata collegata all'area SPA interna"
          },
          "location": "Desenzano del Garda. Posizione strategica e panoramica sul porto.",
          "highlights": [
            "Rooftop Pool Panoramica",
            "Design Minimal e Raffinato",
            "Vicino al centro storico"
          ]
        }
      },
      {
        "name": "Chervò San Vigilio",
        "focus": "Golf",
        "spa": "SPA 1.000m²: Piscina interna salata + 3 esterne bionaturali",
        "distanceKm": 125,
        "distanceTime": "1h 35m",
        "price": "€180-240",
        "rating": 8.7,
        "link": "https://www.gardahotelsanvigiliogolf.it",
        "details": {
          "description": "Un'abbazia del XII secolo trasformata in un resort di lusso. Immerso nel verde delle colline moreniche, è un paradiso per golfisti e amanti del benessere naturale.",
          "spa_size": "1.000 m²",
          "pools": {
            "internal": 1,
            "external": 1,
            "desc": "Piscina 'Bionatura' esterna bionaturale + piscina interna riscaldata salata"
          },
          "location": "Pozzolengo. Immerso in 110 ettari di parco tra i vigneti del Lugana.",
          "highlights": [
            "Laguna Bionaturale Esterna",
            "Campo da Golf 36 Buche",
            "Location Storica (XII Secolo)"
          ]
        }
      },
      {
        "name": "Aqualux Bardolino",
        "focus": "Eco",
        "spa": "8 piscine termali (4 interne + 4 esterne), saune panoramiche",
        "distanceKm": 140,
        "distanceTime": "1h 40m",
        "price": "€220-280",
        "rating": 8,
        "link": "https://aqualuxhotel.com",
        "details": {
          "description": "L'avanguardia del benessere termale. Una struttura eco-certificata che mette l'acqua (termale e salina) al centro di ogni esperienza rigenerativa.",
          "spa_size": "1.000 m²",
          "pools": {
            "internal": 4,
            "external": 4,
            "desc": "8 piscine totali incluse vasche termali, saline e idromassaggi"
          },
          "location": "Bardolino. Architettura moderna a pochi passi dal lungolago.",
          "highlights": [
            "8 Piscine Termali/Saline",
            "Certificazione Climalabel",
            "Giardino Idro-Architettonico"
          ]
        }
      }
    ]
  },
  {
    "zone": "LAGHI ISEO / FRANCIACORTA",
    "icon": "fa-wine-glass",
    "hotels": [
      {
        "name": "Iseolago Hotel",
        "focus": "Natura",
        "spa": "Piscina interna + 3 piscine esterne, sauna, bagno turco",
        "distanceKm": 80,
        "distanceTime": "1h 10m",
        "price": "€145-195",
        "rating": 9.7,
        "link": "https://iseolagohotel.it",
        "details": {
          "description": "Immerso in un parco rigoglioso tra il Lago d'Iseo e le Torbiere del Sebino. Ideale per chi cerca un'atmosfera informale ma ricercata a contatto con l'ecosistema del lago.",
          "spa_size": "400 m²",
          "pools": {
            "internal": 1,
            "external": 3,
            "desc": "Grande parco acquatico esterno con 3 piscine stagionali semi-olimpioniche"
          },
          "location": "Iseo. Tra la riva del lago e la riserva naturale delle Torbiere.",
          "highlights": [
            "Accesso Riserva Naturale",
            "Grande Parco Privato",
            "Atmosfera Lake-Side Relax"
          ]
        }
      },
      {
        "name": "Relais Franciacorta",
        "focus": "Vigneti",
        "spa": "Piscina interna + esterna vigneti, saune, idromassaggio",
        "distanceKm": 75,
        "distanceTime": "1h 05m",
        "price": "€175-225",
        "rating": 8.7,
        "link": "https://relaisfranciacorta.it",
        "details": {
          "description": "Un'antica cascina trasformata in dimora di charme. Senza piscine per preservare l'atmosfera di quiete storica, il Relais punta su un'ospitalità sartoriale e sull'eccellenza enogastronomica della Franciacorta.",
          "spa_size": "300 m²",
          "pools": {
            "internal": 0,
            "external": 0,
            "desc": "Nessuna piscina presente (Wellness Boutique focalizzata su trattamenti e quiete)"
          },
          "location": "Corte Franca. Immerso nel silenzio dei vigneti della Franciacorta.",
          "highlights": [
            "Quiete Assoluta (No Pools)",
            "Degustazioni in Cantina Storica",
            "Cucina di Territorio Raffinata"
          ]
        }
      }
    ]
  },
  {
    "zone": "prova",
    "icon": "fa-map-location-dot",
    "hotels": [
      {
        "name": "Aethos Monterosa",
        "spa": "Piscina interna semi-olimpionica + esterna tra i larici, saune bio",
        "distanceKm": 175,
        "distanceTime": "2h 10m",
        "distance": "175 KM / 2h 10m",
        "price": "€280-440",
        "rating": 9,
        "link": "https://aethos.com/monterosa/"
      },
      {
        "name": "Principe delle Nevi",
        "spa": "Piscina esterna riscaldata on-the-slopes + interna di design",
        "distanceKm": 190,
        "distanceTime": "2h 25m",
        "distance": "190 KM / 2h 25m",
        "price": "€340-520",
        "rating": 9,
        "link": "https://themlegacy.com/principe-delle-nevi"
      }
    ]
  }
];

export const INTENTS = [
  { keywords: ['giappone', 'tokyo', 'kyoto', 'osaka', 'japan'], dest: 'giappone' },
  { keywords: ['bali', 'indonesia', 'ubud', 'seminyak'], dest: 'bali' },
  { keywords: ['toscana', 'firenze', 'siena', 'toscana', 'tuscany'], dest: 'toscana' },
  { keywords: ['maldive', 'maldives', 'atollo'], dest: 'maldive' },
  { keywords: ['new york', 'nyc', 'manhattan', 'stati uniti', 'america', 'usa'], dest: 'newyork' },
  { keywords: ['portogallo', 'lisbona', 'porto', 'portugal'], dest: 'portogallo' },
  { keywords: ['marocco', 'marrakech', 'fes', 'sahara', 'morocco'], dest: 'marocco' },
  { keywords: ['islanda', 'iceland', 'aurora boreale', 'reykjavik'], dest: 'islanda' },
  { keywords: ['thailandia', 'bangkok', 'phuket', 'chiang mai', 'thailand'], dest: 'thailandia' },
  { keywords: ['grecia', 'santorini', 'mykonos', 'atene', 'creta', 'greece'], dest: 'grecia' },
  { keywords: ['peru', 'perù', 'machu picchu', 'cusco', 'lima'], dest: 'peru' },
  { keywords: ['dubai', 'emirati', 'burj', 'uae'], dest: 'dubai' },
  { keywords: ['estate', 'giugno', 'luglio', 'agosto', 'caldo', 'sole', 'estate'], intent: 'estate' },
  { keywords: ['inverno', 'dicembre', 'gennaio', 'neve', 'freddo'], intent: 'inverno' },
  { keywords: ['primavera', 'aprile', 'maggio', 'fiori'], intent: 'primavera' },
  { keywords: ['autunno', 'ottobre', 'novembre', 'settembre'], intent: 'autunno' },
  { keywords: ['visto', 'documenti', 'passaporto', 'entrada', 'burocraz'], intent: 'visti' },
  { keywords: ['low cost', 'economico', 'budget', 'risparmiare', 'poco', 'spendere meno', 'cheap'], intent: 'lowcost' },
  { keywords: ['valigia', 'bagaglio', 'portare', 'pack', 'cosa mettere'], intent: 'valigia' },
  { keywords: ['mare', 'spiaggia', 'snorkeling', 'diving', 'nuotare'], intent: 'mare' },
  { keywords: ['montagna', 'trek', 'hiking', 'escursion', 'camminat'], intent: 'montagna' },
  { keywords: ['romantico', 'luna di miele', 'coppia', 'anniversario'], intent: 'romantico' },
  { keywords: ['esotico', 'avventura', 'unico', 'insolito', 'strano', 'diverso'], intent: 'esotico' },
  { keywords: ['cibo', 'gastronomia', 'mangiare', 'cucina', 'ristorante', 'street food'], intent: 'food' },
  { keywords: ['bambini', 'famiglia', 'kids', 'figli', 'child'], intent: 'famiglia' },
  { keywords: ['ciao', 'salve', 'buongiorno', 'buonasera', 'hey', 'hello'], intent: 'greeting' },
  { keywords: ['grazie', 'perfetto', 'ottimo', 'bravo', 'great', 'bene'], intent: 'thanks' },
  { keywords: ['prenotazion', 'hotel', 'volo', 'bigliett'], intent: 'booking' },
  { keywords: ['prossimo viaggio', 'dove andare', 'consiglio', 'suggerisci', 'dove'], intent: 'suggest' },
  { keywords: ['assicurazione', 'medica', 'sanità', 'salute', 'emergenza'], intent: 'insurance' },
  { keywords: ['consulenza', 'curatore', 'curatela', 'esperto lusso', 'viaggio esclusivo', 'curator'], intent: 'curator_start' },
];
