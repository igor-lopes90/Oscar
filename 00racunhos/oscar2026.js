// ===============================
// LISTA OFICIAL OSCAR 2026
// ===============================

const indicacoesOscar2026 = {
    "Melhor Filme": [
        "Bugonia",
        "F1",
        "Frankenstein",
        "Hamnet: A vida antes de Hamlet",
        "Marty Supreme",
        "Uma batalha após a outra",
        "O agente secreto",
        "Valor sentimental",
        "Pecadores",
        "Sonhos de trem"
    ],

    "Fotografia": [
        "Pecadores",
        "Uma batalha após a outra",
        "Sonhos de trem",
        "Frankenstein",
        "Marty Supreme"
    ],

    "Direção": [
        { nome: "Chloé Zhao", filme: "Hamnet: A vida antes de Hamlet" },
        { nome: "Josh Safdie", filme: "Marty Supreme" },
        { nome: "Paul Thomas Anderson", filme: "Uma batalha após a outra" },
        { nome: "Joachim Trier", filme: "Valor sentimental" },
        { nome: "Ryan Coogler", filme: "Pecadores" }
    ],

    "Atriz": [
        { nome: "Jessie Buckley", filme: "Hamnet: A vida antes de Hamlet" },
        { nome: "Rose Byrne", filme: "Se eu tivesse pernas, eu te chutaria" },
        { nome: "Kate Hudson", filme: "Song Sung Blue - Um sonho a dois" },
        { nome: "Renate Reinsve", filme: "Valor sentimental" },
        { nome: "Emma Stone", filme: "Bugonia" }
    ],

    "Ator": [
        { nome: "Timothée Chalamet", filme: "Marty Supreme" },
        { nome: "Leonardo DiCaprio", filme: "Uma batalha após a outra" },
        { nome: "Ethan Hawke", filme: "Blue Moon" },
        { nome: "Michael B. Jordan", filme: "Pecadores" },
        { nome: "Wagner Moura", filme: "O agente secreto" }
    ],

    "Efeitos Visuais": [
        "Avatar: Fire and Ash",
        "F1",
        "Jurassic World: Recomeço",
        "O Ônibus Perdido",
        "Pecadores"
    ],

    "Animação": [
        "Guerreiras do K-Pop",
        "Zootopia 2",
        "Arco",
        "Elio",
        "A Pequena Amélie"
    ],

    "Som": [
        "F1",
        "Frankenstein",
        "Uma batalha após a outra",
        "Pecadores",
        "Sirât"
    ],

    "Montagem": [
        "F1",
        "Marty Supreme",
        "Uma batalha após a outra",
        "Valor sentimental",
        "Pecadores"
    ],

    "Documentário": [
        "The Alabama Solution",
        "Come See Me in the Good Light",
        "Cutting Through Rocks",
        "Mr. Nobody Against Putin",
        "The Perfect Neighbor"
    ],

    "Direção de Arte": [
        "Frankenstein",
        "Hamnet: A vida antes de Hamlet",
        "Marty Supreme",
        "Uma batalha após a outra",
        "Pecadores"
    ],

    "Canção Original": [
        { nome: "Dear Me", filme: "Diane Warren: Relentless" },
        { nome: "Golden", filme: "Guerreiras do K-Pop" },
        { nome: "I Lied to You", filme: "Pecadores" },
        { nome: "Sweet Dreams of Joy", filme: "Viva Verdi!" },
        { nome: "Train Dreams", filme: "Sonhos de trem" }
    ],

    "Filme Internacional": [
        "Foi apenas um acidente",
        "O agente secreto",
        "Valor sentimental",
        "A voz de Hind Rajab",
        "Sirât"
    ],

    "Figurino": [
        "Avatar: Fogo e cinzas",
        "Frankenstein",
        "Hamnet: A vida antes de Hamlet",
        "Marty Supreme",
        "Pecadores"
    ],

    "Seleção de Elenco": [
        "Hamnet: A vida antes de Hamlet",
        "Marty Supreme",
        "Uma batalha após a outra",
        "O agente secreto",
        "Pecadores"
    ],

    "Ator Coadjuvante": [
        { nome: "Benicio Del Toro", filme: "Uma batalha após a outra" },
        { nome: "Jacob Elordi", filme: "Frankenstein" },
        { nome: "Delroy Lindo", filme: "Pecadores" },
        { nome: "Sean Penn", filme: "Uma batalha após a outra" },
        { nome: "Stellan Skarsgård", filme: "Valor sentimental" }
    ],

    "Roteiro Original": [
        "Blue Moon",
        "Foi apenas um acidente",
        "Marty Supreme",
        "Valor sentimental",
        "Pecadores"
    ],

    "Roteiro Adaptado": [
        "Uma batalha após a outra",
        "Hamnet: A vida antes de Hamlet",
        "Bugonia",
        "Sonhos de trem",
        "Frankenstein"
    ],

    "Trilha Sonora Original": [
        "Bugonia",
        "Frankenstein",
        "Hamnet: A vida antes de Hamlet",
        "Uma batalha após a outra",
        "Pecadores"
    ],

    "Atriz Coadjuvante": [
        { nome: "Elle Fanning", filme: "Valor sentimental" },
        { nome: "Inga Ibsdotter Lilleaas", filme: "Valor sentimental" },
        { nome: "Amy Madigan", filme: "A hora do mal" },
        { nome: "Wunmi Mosaku", filme: "Pecadores" },
        { nome: "Teyana Taylor", filme: "Uma batalha após a outra" }
    ],

    "Maquiagem e Cabelo": [
        "Frankenstein",
        "Kokuho",
        "Pecadores",
        "Coração de lutador: The Smashing Machine",
        "A Meia-Irmã Feia"
    ],

    "Curta-metragem com Atores": [
        "Butcher's Stain",
        "A Friend of Dorothy",
        "Jane Austen's Period Drama",
        "The Singers",
        "Two People Exchanging Saliva"
    ],

    "Animação de curta-metragem": [
        "Butterfly",
        "Forevergreen",
        "The Girl Who Cried Pearls",
        "Retirement Plan",
        "The Three Sisters"
    ]

};

// ===============================
// TRANSFORMA EM FILMES ÚNICOS
// ===============================

const filmesMap = {};

for (const categoria in indicacoesOscar2026) {
    indicacoesOscar2026[categoria].forEach(item => {
        const filme = typeof item === "string" ? item : item.filme;

        if (!filmesMap[filme]) {
            filmesMap[filme] = {
                titulo: filme,
                ano: 2026,
                categorias: []
            };
        }

        if (!filmesMap[filme].categorias.includes(categoria)) {
            filmesMap[filme].categorias.push(categoria);
        }
    });
}

const filmesFinal = Object.values(filmesMap);

// ===============================
// RESULTADO FINAL (para Firebase)
// ===============================

console.log(filmesFinal);
