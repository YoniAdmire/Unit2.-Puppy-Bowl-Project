// Use the API_URL variable to make fetch requests to the API.
// Replace the placeholder with your cohort name (ex: 2109-UNF-HY-WEB-PT)
const cohortName = "2501-ftb-et-web-pt";
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;

/**
 * Fetches all players from the API.
 * @returns {Object[]} the array of player objects
 */
const fetchAllPlayers = async () => {
  // TODO
  try {const response = await fetch(API_URL);
    const data = await response.json();
    renderAllPlayers(data.data.players);
  
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

/** 
 * Fetches a single player from the API.
 * @param {number} playerId
 * @returns {Object} the player object
 */
const fetchSinglePlayer = async (playerId) => {
  try {const response = await fetch(`${API_URL}/${playerId}`);
  const data = await response.json();
  renderSinglePlayer(data.data.player);
    // TODO
  }catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};

/**
 * Adds a new player to the roster via the API.
 * @param {Object} playerObj the player to add
 * @returns {Object} the player returned by the API
 */
const addNewPlayer = async (playerObj) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(playerObj)
  });

  if (!response.ok) throw new Error("Failed to add player");

  const newPlayer = await response.json();
  fetchAllPlayers().then(renderAllPlayers);
  return newPlayer;
    // TODO
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};

/**
 * Removes a player from the roster via the API.
 * @param {number} playerId the ID of the player to remove
 */
const removePlayer = async (playerId) => {
  try {const response = await fetch(`${API_URL}/${playerId}`, {
    method: "DELETE"
});

if (!response.ok) throw new Error("Failed to remove player");


fetchAllPlayers();
    // TODO
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
  }
};

/**
 * Updates `<main>` to display a list of all players.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player is displayed in a card with the following information:
 * - name
 * - id
 * - image (with alt text of the player's name)
 *
 * Additionally, each card has two buttons:
 * - "See details" button that, when clicked, calls `renderSinglePlayer` to
 *    display more information about the player
 * - "Remove from roster" button that, when clicked, will call `removePlayer` to
 *    remove that specific player and then re-render all players
 *
 * Note: this function should replace the current contents of `<main>`, not append to it.
 * @param {Object[]} playerList - an array of player objects
 */
const renderAllPlayers = (playerList) => {
  const mainContainer = document.getElementById("main");
  mainContainer.innerHTML = ""; // Clear previous content

  if (!playerList.length) {
      mainContainer.innerHTML = "<p>No players available.</p>";
      return;
  }

  
  playerList.forEach(player => {
      const card = document.createElement("div");
      card.classList.add("player-card");

      card.innerHTML = `
          <h3>${player.name}</h3>
          <p>ID: ${player.id}</p>
          <img src="${player.imageUrl}" alt="${player.name}" width="100">
          <button onclick="fetchSinglePlayer(${player.id})">See Details</button>
          <button onclick="removePlayer(${player.id})">Remove</button>
      `;

      mainContainer.appendChild(card);
  });
};

/** 
};

/**
 * Updates `<main>` to display a single player.
 * The player is displayed in a card with the following information:
 * - name
 * - id
 * - breed
 * - image (with alt text of the player's name)
 * - team name, if the player has one, or "Unassigned"
 *
 * The card also contains a "Back to all players" button that, when clicked,
 * will call `renderAllPlayers` to re-render the full list of players.
 * @param {Object} player an object representing a single player
 */
const renderSinglePlayer = (player) => {
  const mainContainer = document.getElementById("main");
  mainContainer.innerHTML = `
      <div class="player-details">
          <h2>${player.name}</h2>
          <p>ID: ${player.id}</p>
          <p>Breed: ${player.breed}</p>
          <p>Team: ${player.teamId ? player.teamId : "Unassigned"}</p>
          <img src="${player.imageUrl}" alt="${player.name}" width="200">
          <button onclick="fetchAllPlayers()">Back to All Players</button>
      </div>
  `;
};

/**
 * Fills in `<form id="new-player-form">` with the appropriate inputs and a submit button.
 * When the form is submitted, it should call `addNewPlayer`, fetch all players,
 * and then render all players to the DOM.
 */
const renderNewPlayerForm = () => {
  try {
    const formContainer = document.getElementById("player-form-container");

    formContainer.innerHTML = `
        <form id="new-player-form">
            <label for="player-name">Name:</label>
            <input type="text" id="player-name" required>
            
            <label for="player-breed">Breed:</label>
            <input type="text" id="player-breed" required>
            
            <label for="player-image">Image URL:</label>
            <input type="url" id="player-image" required>
            
            <button type="submit">Add Player</button>
        </form>
    `;

    document.getElementById("new-player-form").addEventListener("submit", async (event) => {
        event.preventDefault();
        
      
        const playerName = document.getElementById("player-name").value;
        const playerBreed = document.getElementById("player-breed").value;
        const playerImage = document.getElementById("player-image").value;

        
        if (!playerName || !playerBreed || !playerImage) {
            alert("Please fill out all fields!");
            return;
        }

        
        await addNewPlayer({
            name: playerName,
            breed: playerBreed,
            imageUrl: playerImage
        });

        document.getElementById("new-player-form").reset();
    });
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};

/**
 * Initializes the app by fetching all players and rendering them to the DOM.
 */
const init = async () => {
  const players = fetchAllPlayers();
  renderAllPlayers(players);

  renderNewPlayerForm();
};

// This script will be run using Node when testing, so here we're doing a quick
// check to see if we're in Node or the browser, and exporting the functions
// we want to test if we're in Node.
if (typeof window === "undefined") {
  module.exports = {
    fetchAllPlayers,
    fetchSinglePlayer,
    addNewPlayer,
    removePlayer,
    renderAllPlayers,
    renderSinglePlayer,
    renderNewPlayerForm,
  };
} else {
  init();
}