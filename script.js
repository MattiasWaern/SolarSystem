const apiKey = 'solaris-2ngXkR6S02ijFrTP';

// Funktion för att hämta planetsdata
async function fetchBodies() {
  try {
    const response = await fetch('https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies', {
      method: 'GET',
      headers: { 'x-zocom': apiKey }  
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Response:', data);  // Logga hela API-svaret för att kolla strukturen
    renderSolarSystem(data);  // Anropa renderSolarSystem med planetsdata
  } catch (error) {
    console.error('Failed to fetch bodies:', error);
  }
}

// Funktion för att rendera solsystemet baserat på den hämtade datan
function renderSolarSystem(data) {
  const solarSystem = document.querySelector('.solar-system');
  
  // Kontrollera att 'bodies' finns i datan och är en array
  if (!data || !Array.isArray(data.bodies)) {
    console.error('Error: "bodies" data is missing or not an array');
    return;
  }

  const bodies = data.bodies;

  // Skapa solen baserat på API-responsen
  const sunData = bodies.find(body => body.name === "Solen");  // Hitta solen i API-datan
  if (sunData) {
    const sun = document.createElement('div');
    sun.classList.add('sun');
    
    // Använd data från API för att skapa solen
    sun.style.width = '100px';  
    sun.style.height = '100px';
    sun.style.background = 'radial-gradient(circle, #FFD700, #FF4500)';
    sun.style.borderRadius = '50%';
    sun.style.position = 'absolute';
    sun.style.top = '50%';
    sun.style.left = '50%';
    sun.style.transform = 'translate(-50%, -50%)';
    sun.style.boxShadow = '0 0 50px 20px rgba(255, 223, 0, 0.8)';
    solarSystem.appendChild(sun);  // Lägg till solen i solsystemet

    // Lägg till solens namn (enbart "Solen")
    const sunName = document.createElement('div');
    sunName.textContent = "Solen";  // Här hårdkodar vi "Solen" istället för att använda latinskt namn
    sunName.style.position = 'absolute';
    sunName.style.top = '50%';
    sunName.style.left = '50%';
    sunName.style.transform = 'translate(-50%, -70px)';  // Flytta namnet ovanför solen
    sunName.style.color = 'white';
    sunName.style.fontSize = '14px';
    sunName.classList.add('planet-name');  
    solarSystem.appendChild(sunName);  // Lägg till namnet på solen
  } else {
    console.error('Solen finns inte i API-datan');
  }

  // Loopa igenom varje planet och placera ut dem korrekt
  let xOffset = 150;  // Startavstånd för första planeten
  bodies.forEach((body) => {
    if (body.name === "Solen") return; // Hoppa över solen då den redan har lagts till
    
    const planet = document.createElement('div');
    planet.classList.add('planet');

    // Beräkna storleken på planeten baserat på omkretsen
    const planetSize = body.circumference / 7000;  // Här justerar jag skalan på planeterna, mindre siffra = större plant :)
    planet.style.width = `${planetSize}px`;
    planet.style.height = `${planetSize}px`;

    // Assignar en enkel färgkod för planeter baserat på deras namn
    const colors = {
      "Merkurius": "#808080",  // Grå
      "Venus": "#FFD700",      // Guld
      "Jorden": "#1E90FF",     // Blå
      "Mars": "#FF4500",       // Röd
      "Jupiter": "#FFA500",    // Orange
      "Saturnus": "#D2B48C",   // Beige
      "Uranus": "#ADD8E6",     // Ljusblå
      "Neptunus": "#00008B"    // Mörkblå
    };

    // Men om planeten inte finns i listan får den en standardfärg
    planet.style.background = colors[body.name] || 'gray';

    // Placera planeten baserat på avståndet från solen
    const distanceFromSun = body.distance * 0.00000005;  // Skala avståndet för att passa på skärmen, man får justera efter behov

    // Justera xOffset för att sprida ut planeterna och säkerställa att de inte överlappar
    planet.style.position = 'absolute';
    planet.style.left = `calc(50% + ${xOffset}px)`;  // Placera planeten horisontellt i förhållande till solen
    planet.style.top = '50%';  // Alla planeter är på samma vertikala linje för enkelhetens skull

    solarSystem.appendChild(planet);  // Lägg till planeten i solsystemet

    // Lägg till planetens namn
    const planetName = document.createElement('div');
    planetName.textContent = body.name;  // Planetens namn från API
    planetName.classList.add('planet-name');  
    planetName.style.position = 'absolute';
    planetName.style.top = '50%';
    planetName.style.left = `calc(50% + ${xOffset}px)`;  // Placera namnet nära planeten
    planetName.style.transform = 'translate(-50%, -30px)';  // Placera namnet ovanför planeten
    planetName.style.color = 'white';
    planetName.style.fontSize = '12px';
    solarSystem.appendChild(planetName);  // Lägg till namnet på planeten

    // Öka xOffset för nästa planet
    xOffset += distanceFromSun + 50;
  });
}

// Funktion för att skapa en stjärna
function createStar() {
  const star = document.createElement('div');
  star.classList.add('star');
  
 
  const x = Math.random() * window.innerWidth;
  const y = Math.random() * window.innerHeight;

  // Placerar stjärnan
  star.style.left = `${x}px`;
  star.style.top = `${y}px`;

  // Slumpmässigt värde mellan 0 och 1 för animationens fördröjning
  const randomDelay = Math.random();

  star.style.setProperty('--star-random', randomDelay);

  // Lägg till stjärnan i bodyn
  document.body.appendChild(star);
}

// Generera flera stjärnor
for (let i = 0; i < 200; i++) {
  createStar();
}

// Kör fetchBodies när sidan är redo
window.onload = fetchBodies;