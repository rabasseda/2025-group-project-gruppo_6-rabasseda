// --- 1. DATI DEL TEAM ---
const team = [
  { name: "Federica", role: "Illustratrice Programmatrice", 
    description:"Fate, boschi, animaletti, musica folk... questo sito è per lei.", image: "fede.jpg", color: "#c19e7f" },
  
  { name: "Emily", role: "Content writer Organizzazione dati", 
    description:"Fa sempre 200 mila cose ma in qualche modo è sempre sul pezzo, slay", image: "emily.jpg", color: "#7f9cb0" },

  { name: "Alessandro", role: "Organizzazione contenuti Programmatore", 
    description:"Creatore di meme del gruppo, ride sempre e a caso. È impossibile arrabbiarsi con lui.", image: "ale.jpg", color: "#b7ab5a" },

  { name: "Rebecca", role: "Ricerca database Programmatrice", 
    description:"'Ma come ti permetti?!?!' core. Super cute ma ha il cuore da dark princess.", image: "rebbi.jpg", color: "#b87e8f" },
  
  { name: "Isabella", role: "Programmatrice", 
    description:"Un po' biscotti alla cannella, un po' trap. La + swag.", image: "isi.jpg", color: "#71a568" },
  
  { name: "Aroa", role: "Prototipi Figma", 
    description:"La nostra componente spagnola. Non si sa come ma capisce sempre tutto quello che diciamo.", image: "aroa.jpg", color: "#a182a8" },
  
  { name: "Ludovica", role: "Ricerca idee grafiche Programmatrice", 
    description:"da inserire", image: "ludo.jpg", color: "#6889b1" }
];

// --- 2. CREAZIONE CARD (DOM) ---

function createCard(member, index) {
  const card = document.createElement("article");
  card.className = "card"; // Classe unica per il CSS
  card.setAttribute("role", "listitem");
  card.setAttribute("aria-label", `${member.name}, ${member.role}`);
  
  // ID fondamentale per p5.js
  card.id = `card-${index}`;

  // -- Meta (Testo) --
  const meta = document.createElement("div");
  meta.className = "meta";

  const name = document.createElement("div");
  name.className = "name";
  name.textContent = member.name;

  const role = document.createElement("div");
  role.className = "role";
  role.textContent = member.role;

  const description = document.createElement("div");
  description.className = "description";
  description.textContent = member.description;

  meta.appendChild(name);
  meta.appendChild(role);
  meta.appendChild(description);

  // -- Media (Immagine) --
  const media = document.createElement("div");
  media.className = "media";

  const img = document.createElement("img");
  img.src = member.image; 
  // Placeholder di sicurezza se l'immagine manca
  img.onerror = function() { this.src = 'https://placehold.co/300x400/png?text=' + member.name; };
  img.alt = `Ritratto di ${member.name}`;
  
  media.appendChild(img);

  // Assemblaggio
  card.appendChild(meta);
  card.appendChild(media);

  return card;
}

// Inizializzazione al caricamento della pagina
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("team-container");

    if(container) {
        // Pulisce il container per sicurezza
        container.innerHTML = "";
        
        // Crea e appende tutte le card in un unico ciclo
        team.forEach((member, index) => {
            const card = createCard(member, index);
            container.appendChild(card);
        });
    } else {
        console.error("ERRORE: Elemento #team-container non trovato nell'HTML!");
    }
});


// --- 3. P5.JS & P5.BRUSH (Generazione Texture Sfondi) ---

function setup() {
  // Canvas nascosto per generare le texture
  // Dimensioni simili a quelle di una card
  let cnv = createCanvas(300, 500, WEBGL);
  cnv.id('p5canvas');
  cnv.style('display', 'none'); 

  setAttributes('preserveDrawingBuffer', true);
  setAttributes('alpha', true);
  
  brush.load();
  noLoop();
  
  // Ritardo per assicurarsi che p5.brush sia pronto
  setTimeout(generateBackgrounds, 1000);
}

async function generateAllBackgrounds() {
  for (let i = 0; i < team.length; i++) {
    // Aspetto un attimo tra una card e l'altra per non bloccare il browser
    await new Promise(r => setTimeout(r, 100)); 
    generateSingleBackground(i);
  }
}

function generateBackgrounds() {
  for (let i = 0; i < team.length; i++) {
    let member = team[i];
    let card = document.getElementById(`card-${i}`);
    
    if (card) {
      clear();
      background("#f3f0dd"); // Colore base crema
      
      // Disegna l'acquerello col colore del membro
      drawWatercolorTexture(member.color);

      redraw();

      // Salva come immagine di sfondo CSS
      let dataURL = canvas.toDataURL();
      card.style.backgroundImage = `url(${dataURL})`;
    }
  }
}

function drawWatercolorTexture(baseColor) {
  translate(-width/2, -height/2); // Fix coordinate WEBGL
  
  brush.noStroke();
  brush.pick("watercolor");
  brush.bleed(0.6); 
  
  let passes = 12; // Aumentato un po' per più densità
  
  for(let j=0; j<passes; j++) {
    brush.fill(baseColor, random(30, 70)); // Trasparenza
    
    // Rettangoli casuali ma centrati per coprire la card
    let x = random(width * 0.1, width * 0.9);
    let y = random(height * 0.1, height * 0.9);
    let w = random(150, 300);
    let h = random(200, 400);
    
    brush.rect(x, y, w, h);
  }
}

function draw() {
  // Vuoto
}