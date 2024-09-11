<template>
  <div id="scoreboard">
    <!-- Temporizador grande con los logos de los equipos a los lados -->
    <div class="timer-bar">
      <!-- Columna del equipo 1 -->
      <div class="team-container">
        <input
          v-model="team1Name"
          type="text"
          class="team-name"
          placeholder="HOME"
        />
        <div class="team-logo" @click="triggerFileInput('team1')">
          <input
            type="file"
            ref="team1FileInput"
            @change="onImageChange($event, 'team1')"
            accept="image/*"
          />
          <img v-if="team1Logo" :src="team1Logo" alt="Logo del equipo 1" />
          <span v-if="!team1Logo" class="plus-symbol">+</span>
        </div>
      </div>

      <!-- Temporizador en el centro -->
      <h1>{{ formattedTime }}</h1>

      <!-- Columna del equipo 2 -->
      <div class="team-container">
        <input
          v-model="team2Name"
          type="text"
          class="team-name"
          placeholder="VISITOR"
        />
        <div class="team-logo" @click="triggerFileInput('team2')">
          <input
            type="file"
            ref="team2FileInput"
            @change="onImageChange($event, 'team2')"
            accept="image/*"
          />
          <img v-if="team2Logo" :src="team2Logo" alt="Logo del equipo 2" />
          <span v-if="!team2Logo" class="plus-symbol">+</span>
        </div>
      </div>
    </div>

    <!-- Sección del marcador en tres columnas -->
    <div class="main-content">
      <!-- Columna del equipo 1 -->
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
          <button @click="incrementLocalScore(-1)">-1</button>
        </div>
      </div>

      <!-- Columna central del temporizador y controles -->
      <div class="quarter-info">
        <h3>{{ quarter }}</h3>
        <button @click="startTimer" v-if="!timerRunning">Iniciar</button>
        <button @click="pauseTimer" v-if="timerRunning">Pausar</button>
        <button @click="nextQuarter">Next Qrt</button>
        <button @click="resetAll">Reset Total</button>
      </div>

      <!-- Columna del equipo 2 -->
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
          <button @click="incrementVisitorScore(-1)">-1</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      localScore: 0,
      visitorScore: 0,
      localFouls: 0,
      visitorFouls: 0,
      minutes: 10,
      seconds: 0,
      quarter: 1,
      timer: null,
      timerRunning: false,
      team1Logo: null,
      team2Logo: null
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
      this.localFouls = (this.localFouls + 1) % 6;
    },
    incrementVisitorFouls() {
      this.visitorFouls = (this.visitorFouls + 1) % 6;
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
        this.nextQuarter(); // Aumentar el cuarto cuando el tiempo llega a 0
      }
    },
    nextQuarter() {
      this.quarter++; // Incrementa el cuarto cuando el temporizador llega a 0
      this.resetTimer(); // Reiniciar el temporizador para el nuevo cuarto
    },
    resetAll() {
      this.localScore = 0;
      this.visitorScore = 0;
      this.localFouls = 0;
      this.visitorFouls = 0;
      this.quarter = 1;
      this.resetTimer(); // Reinicia el juego completo
    }
  }
};
</script>


<style scoped>
/* Estilos generales */
#scoreboard {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #5c0818;
  color: white;
  overflow: hidden;
}

/* Temporizador en la parte superior */
.timer-bar {
  width: 100%;
  height: 30vh;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 50px;
  box-sizing: border-box;
}

.timer-bar h1 {
  font-size: 10vw;
  color: #5c0818;
  margin: 0;
}

.team-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.team-name {
  font-size: 1.5vw;
  margin-bottom: 10px;
  text-align: center;
  color: #333;
  background-color: #fff;
  padding: 5px;
  border-radius: 5px;
  width: 100%;
  max-width: 200px;
  box-sizing: border-box;
}

.team-logo {
  width: 20vw;
  height: 20vw;
  max-width: 150px;
  max-height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f3f3f3;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid #ccc;
  position: relative;
}

.plus-symbol {
  font-size: 50px;
  color: #ccc;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
}

.team-logo img ~ .plus-symbol {
  display: none;
}

.team-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

input[type="file"] {
  display: none;
}

/* Mantener tres columnas principales */
.main-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  padding: 0 50px;
  box-sizing: border-box;
  width: 100%;
}

/* Columnas de los equipos */
.team {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.points {
  font-size: 12vw;
  margin: 10px 0;
}

.fouls {
  margin-top: 10px;
  font-size: 8vw;
  cursor: pointer;
}

.fouls p {
  font-size: 2vw;
  margin: 0;
}

.fouls-critical {
  color: #ce0529;
}

/* Ajuste de los botones de +1 y -1 */
.buttons {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 10px;
  flex-wrap: nowrap;
  width: 100%;
  max-width: 300px;
}

button {
  padding: 15px;
  font-size: 5vw;
  background-color: #9f260c;
  color: white;
  border: none;
  cursor: pointer;
  flex: 1;
  min-width: 60px;
  box-sizing: border-box;
  margin: 0 10px;
}

button:hover {
  background-color: #bc1718;
}

/* Controles de la columna del medio */
.quarter-info {
  flex:0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: auto;
}

.quarter-info h3 {
  font-size: 6vw;
  margin-bottom: 20px;
}

/* Botones en pantallas grandes */
.quarter-info button {
  width: 150px;
  aspect-ratio: 1 / 1; /* Mantener relación cuadrada */
  margin: 10px auto;
  font-size: 24px;
  padding: 10px;
  background-color: #9f260c;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 10px;
}

.quarter-info button:hover {
  background-color: #bc1718;
}

/* Media Queries para pantallas móviles */
@media (max-width: 768px) {

   /* Ajustes para pantallas móviles */

   .timer-bar {
    height: 15vh; /* Reducir la altura del bloque del temporizador */
    padding: 0 20px; /* Reducir el padding para que sea más estrecho */
    justify-content: center; /* Centrar el temporizador en pantallas pequeñas */
  }

  .timer-bar h1 {
    font-size: 18vw; /* Escalar el tamaño del texto en móviles */
  }

  /* Ocultar los nombres de los equipos y mostrar los logos en pantallas pequeñas */
  .team-name {
    display: none; /* Ocultar nombres de los equipos */
  }

  .team-logo {
    display: flex; /* Mostrar los logos */
    width: 25vw;
    height: 25vw;
    max-width: 100px;
    max-height: 100px;
  }

  /* Mantener las 3 columnas, pero ajustar tamaños */
  .main-content {
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 0 20%;
  }

  /* Ajuste de la columna del equipo */
  .team {
    flex: 1;
    justify-content: center;
  }

  /* Estilo responsivo para los puntos */
  .points {
    font-size: 18vw;
  }

  /* Estilo responsivo para las faltas */
  .fouls {
    font-size: 12vw;
  }

  .fouls p {
    font-size: 4vw;
  }

  /* Estilo responsivo para los botones de +1 y -1 */
  .buttons {
    flex-direction: column; /* Cambiar disposición de botones uno sobre otro */
    gap: 10px;
    max-width: 150px; /* Reducir el ancho máximo para pantallas pequeñas */
  }

  button {
    font-size: 6vw;
    padding: 10px;
    min-width: 50px;
  }

   /* Ajustar tamaño de los botones de la columna del medio en pantallas pequeñas */
   .quarter-info button {
    width: 80px;
    aspect-ratio: 1 / 1;
    font-size: 3.5vw; /* Ajuste del tamaño del texto */
    padding: 8px;
  }

  /* Otros ajustes de la columna del medio en pantallas pequeñas */
  .quarter-info h3 {
    font-size: 8vw;
  }
}


</style>
