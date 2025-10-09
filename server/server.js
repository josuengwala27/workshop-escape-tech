import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Structure pour stocker les parties
const games = new Map();

// Génération des données de jeu
function generateGameData() {
  // Biostat' - Génération de 3 lots avec courbes de température
  const lots = ['A', 'B', 'C'].map(name => {
    const points = [];
    let temp = 4 + Math.random() * 2; // Commence entre 4-6°C
    const minutesAbove8 = Math.floor(Math.random() * 15); // Entre 0 et 14 minutes
    
    for (let i = 0; i <= 30; i++) {
      if (i >= 10 && i < 10 + minutesAbove8) {
        temp = 8 + Math.random() * 4; // Monte au-dessus de 8°C
      } else if (i >= 10 + minutesAbove8) {
        temp = 4 + Math.random() * 2; // Redescend
      }
      points.push({ time: i, temp: parseFloat(temp.toFixed(1)) });
      temp += (Math.random() - 0.5) * 0.5;
    }
    
    return {
      name,
      points,
      minutesAbove8,
      isOk: minutesAbove8 <= 8,
      coopCode: String(Math.floor(Math.random() * 90) + 10)
    };
  });

  // Logistique - Génération de lieux et itinéraires
  const locations = [
    { id: 'depot', name: 'Dépôt', x: 50, y: 50 },
    { id: 'hopital_a', name: 'Hôpital A', x: 150, y: 100 },
    { id: 'hopital_b', name: 'Hôpital B', x: 200, y: 150 },
    { id: 'clinique', name: 'Clinique', x: 100, y: 200 },
    { id: 'centre', name: 'Centre Vaccin', x: 250, y: 100 }
  ];

  const routes = [
    { from: 'depot', to: 'hopital_a', duration: 8 },
    { from: 'depot', to: 'clinique', duration: 12 },
    { from: 'hopital_a', to: 'centre', duration: 7 },
    { from: 'hopital_a', to: 'hopital_b', duration: 6 },
    { from: 'clinique', to: 'hopital_b', duration: 9 },
    { from: 'hopital_b', to: 'centre', duration: 5 },
    { from: 'depot', to: 'hopital_b', duration: 16 }
  ];

  const coldLimit = 15;
  const coopCodeLogistics = String(Math.floor(Math.random() * 90) + 10);

  // Infirmier·e - Ordre des gestes d'hygiène
  const hygieneSteps = [
    { id: 1, text: "Friction hydro-alcoolique des mains", order: 1 },
    { id: 2, text: "Enfiler les gants stériles", order: 2 },
    { id: 3, text: "Désinfecter la surface de travail", order: 3 },
    { id: 4, text: "Préparer le matériel de vaccination", order: 4 },
    { id: 5, text: "Vérifier la date de péremption", order: 5 }
  ];

  const shuffledSteps = [...hygieneSteps].sort(() => Math.random() - 0.5);
  const coopCodeHygiene = String(Math.floor(Math.random() * 90) + 10);

  return {
    biostat: { lots, coopCode: lots.find(l => l.isOk)?.coopCode || '00' },
    logistics: { locations, routes, coldLimit, coopCode: coopCodeLogistics },
    hygiene: { steps: shuffledSteps, correctOrder: hygieneSteps, coopCode: coopCodeHygiene }
  };
}

// Création d'une nouvelle partie
function createGame(roomCode) {
  const gameData = generateGameData();
  return {
    roomCode,
    players: {},
    gameData,
    startTime: null,
    duration: 300, // 5 minutes en secondes
    results: {
      biostat: null,
      logistics: null,
      hygiene: null
    },
    finalCode: null,
    status: 'waiting', // waiting, playing, ended
    currentTurn: 'biostat', // biostat -> logistics -> hygiene
    turnOrder: ['biostat', 'logistics', 'hygiene'],
    completedTurns: []
  };
}

io.on('connection', (socket) => {
  console.log('Nouveau joueur connecté:', socket.id);

  // Créer ou rejoindre une partie
  socket.on('joinGame', ({ roomCode, playerName }) => {
    let game = games.get(roomCode);
    
    if (!game) {
      game = createGame(roomCode);
      games.set(roomCode, game);
    }

    // Assigner un rôle
    const roles = ['biostat', 'logistics', 'hygiene'];
    const assignedRoles = Object.values(game.players).map(p => p.role);
    const availableRoles = roles.filter(r => !assignedRoles.includes(r));
    
    if (availableRoles.length === 0) {
      socket.emit('error', { message: 'Partie complète - 3 joueurs maximum' });
      return;
    }

    const role = availableRoles[0];
    game.players[socket.id] = {
      id: socket.id,
      name: playerName,
      role,
      ready: false
    };

    socket.join(roomCode);
    socket.emit('roleAssigned', { role, gameData: game.gameData });
    io.to(roomCode).emit('playersUpdate', { 
      players: Object.values(game.players),
      currentTurn: game.currentTurn 
    });

    console.log(`${playerName} a rejoint la partie ${roomCode} en tant que ${role}`);
  });

  // Joueur prêt
  socket.on('playerReady', ({ roomCode }) => {
    const game = games.get(roomCode);
    if (!game || !game.players[socket.id]) return;

    game.players[socket.id].ready = true;
    io.to(roomCode).emit('playersUpdate', { 
      players: Object.values(game.players),
      currentTurn: game.currentTurn 
    });

    // Démarrer si tous les joueurs sont prêts
    const allReady = Object.values(game.players).every(p => p.ready);
    if (allReady && Object.keys(game.players).length === 3) {
      game.status = 'playing';
      game.startTime = Date.now();
      game.currentTurn = 'biostat'; // Commence avec Biostat'
      io.to(roomCode).emit('gameStarted', { 
        startTime: game.startTime, 
        duration: game.duration,
        currentTurn: game.currentTurn
      });
      
      // Timer côté serveur
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - game.startTime) / 1000);
        const remaining = game.duration - elapsed;
        
        if (remaining <= 0) {
          clearInterval(interval);
          game.status = 'ended';
          io.to(roomCode).emit('gameEnded', { reason: 'timeout', results: game.results });
        } else {
          io.to(roomCode).emit('timerUpdate', { remaining });
        }
      }, 1000);
    }
  });

  // Partage d'actions en temps réel (pour observation)
  socket.on('shareAction', ({ roomCode, action, data }) => {
    const game = games.get(roomCode);
    if (!game) {
      console.log('❌ Game not found for roomCode:', roomCode);
      return;
    }
    
    const playerRole = game.players[socket.id]?.role;
    console.log(`🔴 Serveur reçoit action de ${playerRole}:`, action, data);
    
    // Broadcaster l'action à tous les autres joueurs de la room
    socket.to(roomCode).emit('playerAction', { 
      role: playerRole,
      action, 
      data 
    });
    
    console.log(`📡 Serveur broadcast à room ${roomCode}`);
  });

  // Soumission d'un résultat
  socket.on('submitResult', ({ roomCode, role, result }) => {
    const game = games.get(roomCode);
    if (!game) return;

    game.results[role] = result;
    game.completedTurns.push(role);
    
    // Passer au tour suivant
    const currentIndex = game.turnOrder.indexOf(role);
    if (currentIndex < game.turnOrder.length - 1) {
      game.currentTurn = game.turnOrder[currentIndex + 1];
      io.to(roomCode).emit('nextTurn', { 
        currentTurn: game.currentTurn,
        completedRole: role,
        result: result
      });
    } else {
      // Tous les tours sont terminés
      game.currentTurn = 'finalCode';
      io.to(roomCode).emit('allTurnsComplete', { 
        results: game.results 
      });
    }
    
    io.to(roomCode).emit('resultSubmitted', { role, result });
    
    console.log(`Résultat soumis pour ${role}:`, result);
    console.log(`Tour suivant: ${game.currentTurn}`);
  });

  // Soumission du code final
  socket.on('submitFinalCode', ({ roomCode, code }) => {
    const game = games.get(roomCode);
    if (!game) return;

    const correctCode = 
      (game.results.biostat?.coopCode || '00') +
      (game.results.logistics?.coopCode || '00') +
      (game.results.hygiene?.coopCode || '00');

    const isCorrect = code === correctCode;
    
    // Vérifier les conditions de victoire
    const hasOkLot = game.results.biostat?.okLots?.length > 0;
    const routeOk = game.results.logistics?.duration <= game.gameData.logistics.coldLimit;
    const hygieneOk = game.results.hygiene?.errors === 0;

    const victory = isCorrect && hasOkLot && routeOk && hygieneOk;

    game.status = 'ended';
    game.finalCode = code;

    io.to(roomCode).emit('gameEnded', {
      reason: 'completed',
      victory,
      correctCode,
      submittedCode: code,
      results: game.results
    });

    console.log(`Partie ${roomCode} terminée - Victoire: ${victory}`);
  });

  // Déconnexion
  socket.on('disconnect', () => {
    console.log('Joueur déconnecté:', socket.id);
    
    // Trouver et nettoyer les parties
    for (const [roomCode, game] of games.entries()) {
      if (game.players[socket.id]) {
        delete game.players[socket.id];
        io.to(roomCode).emit('playersUpdate', { 
          players: Object.values(game.players),
          currentTurn: game.currentTurn 
        });
        
        // Supprimer la partie si vide
        if (Object.keys(game.players).length === 0) {
          games.delete(roomCode);
        }
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});

