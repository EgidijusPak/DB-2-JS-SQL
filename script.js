// @post /plants
const form = document.getElementById("tree-form");

// @ POST /plants
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const plantData = {
    name: document.getElementById("create-name").value,
    height: document.getElementById("create-height").value,
    type: document.getElementById("create-type").value,
  };

  fetch("http://localhost:3000/plants", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(plantData),
  })
    .then((res) => res.json())
    .then(() => form.reset());
});

// get /plants

function fetchTrees() {
  fetch("http://localhost:3000/plants")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
}

fetchTrees();
