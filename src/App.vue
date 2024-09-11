<template>
  <div id="scoreboard">
    <!-- Temporizador grande con los logos de los equipos a los lados -->
    <div class="timer-bar">
      <!-- Logo del equipo 1 -->
      <div class="team-logo" @click="triggerFileInput('team1')">
        <input type="file" ref="team1FileInput" @change="onImageChange($event, 'team1')" accept="image/*" />
        <img v-if="team1Logo" :src="team1Logo" alt="Logo del equipo 1" />
        <span v-else>Subir Logo</span>
      </div>

      <!-- Temporizador -->
      <h1>{{ formattedTime }}</h1>

      <!-- Logo del equipo 2 -->
      <div class="team-logo" @click="triggerFileInput('team2')">
        <input type="file" ref="team2FileInput" @change="onImageChange($event, 'team2')" accept="image/*" />
        <img v-if="team2Logo" :src="team2Logo" alt="Logo del equipo 2" />
        <span v-else>Subir Logo</span>
      </div>
    </div>

    <!-- Sección del marcador -->
    <div class="main-content">
      <!-- Equipo 1 -->
      <div class="team">
        <div class="points">{{ localScore }}</div>
        <div class="fouls" @click="incrementLocalFouls">
          <div :class="{'fouls-critical': localFouls === 5}">
            {{ localFouls }}
          </div>
          <p>Faltas</p>
        </div>
        <div class="buttons">
          <button @click="incrementLocalScore(1)">+1</button>
          <button @click="incrementLocalScore(2)">+2</button>
          <button @click="incrementLocalScore(3)">+3</button>
        </div>
      </div>

      <!-- Cuarto y control del temporizador en el centro -->
      <div class="quarter-info">
        <h3>{{ quarter }}</h3>
        <button @click="startTimer" v-if="!timerRunning">Iniciar</button>
        <button @click="pauseTimer" v-if="timerRunning">Pausar</button>
        <button @click="resetTimer">Reiniciar</button>
        <button @click="nextQuarter">Next Qrt</button>
        <button @click="resetAll">Reset Total</button>
      </div>

      <!-- Equipo 2 -->
      <div class="team">
        <div class="points">{{ visitorScore }}</div>
        <div class="fouls" @click="incrementVisitorFouls">
          <div :class="{'fouls-critical': visitorFouls === 5}">
            {{ visitorFouls }}
          </div>
          <p>Faltas</p>
        </div>
        <div class="buttons">
          <button @click="incrementVisitorScore(1)">+1</button>
          <button @click="incrementVisitorScore(2)">+2</button>
          <button @click="incrementVisitorScore(3)">+3</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      localScore: 0, // Puntos del equipo local
      visitorScore: 0, // Puntos del equipo visitante
      localFouls: 0, // Faltas acumuladas del equipo local
      visitorFouls: 0, // Faltas acumuladas del equipo visitante
      minutes: 10, // Tiempo inicial en minutos
      seconds: 0, // Tiempo inicial en segundos
      quarter: 1, // Cuarto del juego
      timer: null, // Referencia del temporizador
      timerRunning: false, // Bandera para saber si el temporizador está corriendo
      team1Logo: null, // Imagen del equipo 1
      team2Logo: null // Imagen del equipo 2
    };
  },
  computed: {
    formattedTime() {
      const formattedMinutes = this.minutes < 10 ? '0' + this.minutes : this.minutes;
      const formattedSeconds = this.seconds < 10 ? '0' + this.seconds : this.seconds;
      return `${formattedMinutes}:${formattedSeconds}`;
    }
  },
  methods: {
    triggerFileInput(team) {
      if (team === 'team1') {
        this.$refs.team1FileInput.click();
      } else if (team === 'team2') {
        this.$refs.team2FileInput.click();
      }
    },
    onImageChange(event, team) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (team === 'team1') {
            this.team1Logo = e.target.result;
          } else if (team === 'team2') {
            this.team2Logo = e.target.result;
          }
        };
        reader.readAsDataURL(file);
      }
    },
    incrementLocalScore(points) {
      this.localScore += points;
    },
    incrementVisitorScore(points) {
      this.visitorScore += points;
    },
    incrementLocalFouls() {
      this.localFouls = (this.localFouls + 1) % 6; // Aumenta faltas y vuelve a 0 al llegar a 5
    },
    incrementVisitorFouls() {
      this.visitorFouls = (this.visitorFouls + 1) % 6; // Aumenta faltas y vuelve a 0 al llegar a 5
    },
    startTimer() {
      if (!this.timerRunning) {
        this.timerRunning = true;
        this.timer = setInterval(this.countdown, 1000);
      }
    },
    pauseTimer() {
      clearInterval(this.timer);
      this.timerRunning = false;
    },
    resetTimer() {
      clearInterval(this.timer);
      this.timerRunning = false;
      this.minutes = 10;
      this.seconds = 0;
    },
    countdown() {
      if (this.seconds === 0 && this.minutes > 0) {
        this.minutes--;
        this.seconds = 59;
      } else if (this.seconds > 0) {
        this.seconds--;
      } else if (this.seconds === 0 && this.minutes === 0) {
        this.pauseTimer(); // Detener el temporizador cuando llega a 0
      }
    },
    nextQuarter() {
      this.quarter++; // Permitir avanzar indefinidamente para incluir tiempos extras
      this.resetTimer(); // Reiniciar el temporizador al cambiar de cuarto
    },
    resetAll() {
      // Resetear todo a su estado inicial
      this.localScore = 0;
      this.visitorScore = 0;
      this.localFouls = 0;
      this.visitorFouls = 0;
      this.quarter = 1;
      this.resetTimer();
    }
  }
};
</script>

<style scoped>
#scoreboard {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #5c0818;
  color: white;
  overflow: hidden; /* Evita el desplazamiento */
}

/* Temporizador grande en la parte superior */
.timer-bar {
  width: 100%;
  height: 30vh; /* Ocupa el 30% de la pantalla */
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 50px;
  box-sizing: border-box;
}

.timer-bar h1 {
  font-size: 250px; /* Tamaño más grande para el tiempo */
  color: #5c0818;
  margin: 0;
}

.team-logo {
  width: 150px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f3f3f3;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid #ccc; /* Añadir borde para visualización */
  box-sizing: border-box;
}

.team-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.team-logo span {
  font-size: 16px;
  color: #555;
}

input[type="file"] {
  display: none;
}

.main-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  padding: 0 50px;
}

.team {
  text-align: center;
  flex: 1;
}

.points {
  font-size: 200px; /* Hacer los puntos más grandes */
  margin: 20px 0;
}

.buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

button {
  padding: 20px;
  font-size: 20px; /* Botones más grandes */
  background-color: #9f260c;
  color: white;
  border: none;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background-color: #bc1718;
}


/* Faltas */
.fouls {
  margin-top: 20px;
  font-size: 100px; /* Tamaño más grande para las faltas */
  cursor: pointer;
}

.fouls p {
  font-size: 40px; /* Texto "Faltas" */
  margin: 0;
}

.fouls-critical {
  color: #5c0818; /* Cambiar a rojo cuando hay 5 faltas */
}

/* Información del cuarto y controles */
.quarter-info {
  text-align: center;
  margin: 0 50px;
}

.quarter-info h3 {
  font-size: 70px; /* Tamaño más grande para el cuarto */
  margin-bottom: 20px;
}

.quarter-info button {
  display: block;
  width: 200px;
  margin: 10px auto;
  font-size: 24px;
}

.quarter-info button:hover {
  background-color: #bc1718;
}
</style>
