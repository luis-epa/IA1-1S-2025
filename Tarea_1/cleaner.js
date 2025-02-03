const logElement = document.querySelector("#log");

/**
 * Estado actual del sistema
 */
let states = [];

/**
 * Lista de los 8 posibles estados.
 */
const allStates = [
  ["A", "CLEAN", "CLEAN"],
  ["A", "CLEAN", "DIRTY"],
  ["A", "DIRTY", "CLEAN"],
  ["A", "DIRTY", "DIRTY"],
  ["B", "CLEAN", "CLEAN"],
  ["B", "CLEAN", "DIRTY"],
  ["B", "DIRTY", "CLEAN"],
  ["B", "DIRTY", "DIRTY"],
];

/**
 * Añade la acción a la página HTML.
 * @param {string} location
 * @param {string} action
 */
const writeHTMLAction = (prevState, location, action) => {
  logElement.innerHTML += `
  <br>Loc: ${prevState[0]}, StatusA: ${prevState[1]}, StatusB: ${prevState[2]}
  <br>&emsp;<strong>Location: ${location} | Action: ${action}</strong>
  `;
};

/**
 * Retorna el estado inicial del sistema.
 * [loc, estadoA, estadoB]
 * @returns {string[]}
 */
const getRandomState = () => {
  const states = ["DIRTY", "CLEAN"];
  const stateA = states[Math.floor(Math.random() * 2)];
  const stateB = states[Math.floor(Math.random() * 2)];
  const location = Math.random() < 0.5 ? "A" : "B";

  return [location, stateA, stateB];
};

/**
 * Verifica si un estado ya ha sido alcanzado.
 * @param {string[]} state
 * @param {string[]} visitedStates
 * @returns
 */
const hasBeenVisited = (state, visitedStates) => {
  console.log(visitedStates);
  return visitedStates.some(
    (visitedState) =>
      visitedState[0] === state[0] &&
      visitedState[1] == state[1] &&
      visitedState[2] == state[2]
  );
};

/**
 * Determina si las habitaciones se ensucian.
 */
const dirtyRoom = () => {
  let dirtyRooms = "";
  // Ensuciar la ubicación A
  if (Math.random() < 0.5) {
    states[1] = "DIRTY";
    dirtyRooms += `<br><em>&emsp;Se ensucia ubicación A</em>`;
  }

  // Ensuciar la ubicación B
  if (Math.random() < 0.5) {
    states[2] = "DIRTY";
    dirtyRooms += `<br><em>&emsp;Se ensucia ubicación B</em>`;
  }

  logElement.innerHTML += dirtyRooms;
};

/**
 * Determina la acción a tomar dependiendo del estado y la ubicación.
 * @param {string} location
 * @param {string} state
 * @returns
 */
function reflexAgent(location, state) {
  if (state == "DIRTY") return "CLEAN";
  else if (location == "A") return "RIGHT";
  else if (location == "B") return "LEFT";
}

const simulate = () => {
  // Obtiene el estado inicial
  const curState = getRandomState();

  console.log(curState);

  // Inicializa la lista de estados faltantes, quitando el estado inicial
  let remainingStates = allStates.filter(
    (remState) =>
      !(
        remState[0] === curState[0] &&
        remState[1] === curState[1] &&
        remState[2] === curState[2]
      )
  );

  states = [...curState];

  console.log(states);

  // Crear y agrega el estado inicial a la lista de estados visitados
  let visitedStates = [curState];

  // Repite hasta visitar los 8 estados
  while (visitedStates.length < 8) {
    // Obtiene la ubicación actual y los estados de las ubicaciones
    const [loc, statusA, statusB] = states;

    console.log(loc);

    const action = reflexAgent(loc, loc === "A" ? statusA : statusB);

    const prevState = [...states];

    writeHTMLAction(prevState, loc, action);

    if (action === "CLEAN") {
      if (loc === "A") states[1] = "CLEAN";
      else if (loc === "B") states[2] = "CLEAN";
    } else if (action === "LEFT") {
      states[0] = "A";
    } else if (action === "RIGHT") {
      states[0] = "B";
    }

    // Simular que las ubicaciones se ensucien
    dirtyRoom();

    // Marcar el estado como visitado
    if (!hasBeenVisited(prevState, visitedStates)) {
      visitedStates.push([...prevState]);

      remainingStates = remainingStates.filter(
        (remState) =>
          !(
            remState[0] === prevState[0] &&
            remState[1] === prevState[1] &&
            remState[2] === prevState[2]
          )
      );
    }
  }
};

simulate();
