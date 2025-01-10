import { createStore } from "redux";
import profileReducer from "./profileReducer";
import { addProfile, removeProfile, calculateAverageAge } from "./actions";

const store = createStore(profileReducer);

const profiles = [
  { id: 1, name: "Alice", age: 25 },
  { id: 2, name: "Bob", age: 30 },
  { id: 3, name: "Charlie", age: 35 },
];

for (let i = 0; i < profiles.length; i++) {
  store.dispatch(addProfile(profiles[i]));
}
store.dispatch(calculateAverageAge());

const renderProfiles = () => {
  const state = store.getState();
  const profilesList = document.getElementById("profiles-list");

  profilesList.innerHTML =
    state.profiles.length === 0
      ? ""
      : state.profiles
          .map(
            (profile) =>
              `<li>${profile.id}. ${profile.name} (${profile.age} years old)</li>`
          )
          .join("");
};

function updateAverageAge() {
  const state = store.getState();
  const averageAgeElement = document.getElementById("average-age");

  if (state.profiles.length > 0) {
    averageAgeElement.style.display = "block";
    averageAgeElement.textContent = `Average Age: ${state.averageAge}`;
  } else {
    averageAgeElement.style.display = "none";
  }
}

function handleAddProfile(event) {
  event.preventDefault();

  const id = parseInt(document.getElementById("add-id").value);
  const name = document.getElementById("add-name").value.trim();
  const age = parseInt(document.getElementById("add-age").value);

  // Just check if values are positive
  if (id > 0 && name && age > 0) {
    const state = store.getState();
    let idExists = false;

    for (let i = 0; i < state.profiles.length; i++) {
      if (state.profiles[i].id === id) {
        idExists = true;
        break;
      }
    }

    if (idExists) {
      alert("A profile with this ID already exists!");
      return;
    }

    store.dispatch(addProfile({ id, name, age }));
    store.dispatch(calculateAverageAge());
    event.target.reset();
  } else {
    alert(
      "Please fill in all fields correctly. ID and age must be positive numbers."
    );
  }
}

function handleRemoveProfile(event) {
  event.preventDefault();

  const id = parseInt(document.getElementById("remove-id").value);

  // Just check if ID is positive
  if (id > 0) {
    const state = store.getState();
    let idFound = false;

    for (let i = 0; i < state.profiles.length; i++) {
      if (state.profiles[i].id === id) {
        idFound = true;
        break;
      }
    }

    if (!idFound) {
      alert("No profile found with this ID!");
      return;
    }

    store.dispatch(removeProfile(id));
    store.dispatch(calculateAverageAge());
    event.target.reset();
  } else {
    alert("Please enter a valid positive ID number.");
  }
}

// Add event listeners when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("add-profile-form")
    .addEventListener("submit", handleAddProfile);

  document
    .getElementById("remove-profile-form")
    .addEventListener("submit", handleRemoveProfile);

  // Initial render
  renderProfiles();
  updateAverageAge();
});

// Subscribe to store changes
store.subscribe(() => {
  renderProfiles();
  updateAverageAge();
});