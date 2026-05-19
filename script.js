const BASE = "https://openapi.programming-hero.com/api";

const categories = document.getElementById("categories");
const plants = document.getElementById("plants");
const cart = document.getElementById("cart");
const totalEl = document.getElementById("total");
const spinner = document.getElementById("spinner");

let cartData = [];
let total = 0;






async function loadCategories() {
  const res = await fetch(`${BASE}/categories`);
  const data = await res.json();

  data.categories.forEach(cat => {
    const btn = document.createElement("button");

    btn.innerText = cat.category_name;
    btn.className = "w-full p-2 bg-green-100 rounded my-1";

    btn.onclick = () => loadPlants(cat.id);

    categories.appendChild(btn);
  });

  loadPlants(1);
}





async function loadPlants(id) {
  spinner.classList.remove("hidden");
  plants.innerHTML = "";

  const res = await fetch(`${BASE}/category/${id}`);
  const data = await res.json();

  data.plants.forEach(p => {
    const div = document.createElement("div");

    div.className = "bg-white p-4 rounded shadow";

    div.innerHTML = `
      <img src="${p.image}" class="h-40 w-full object-cover rounded"/>
      <h2 onclick="show(${p.id})" class="font-bold cursor-pointer">${p.name}</h2>
      <p>${p.description.slice(0,60)}...</p>
      <p>$${p.price}</p>
      <button onclick='add(${p.id})' class="bg-green-700 text-white w-full py-2 mt-2 rounded">
        Add To Cart
      </button>
    `;

    plants.appendChild(div);
  });

  spinner.classList.add("hidden");
}






async function show(id) {
  const res = await fetch(`${BASE}/plant/${id}`);
  const data = await res.json();

  document.getElementById("mimg").src = data.plant.image;
  document.getElementById("mtitle").innerText = data.plant.name;
  document.getElementById("mdesc").innerText = data.plant.description;

  modal.showModal();
}






async function add(id) {
  const res = await fetch(`${BASE}/plant/${id}`);
  const data = await res.json();

  cartData.push(data.plant);
  total += Number(data.plant.price);

  updateCart();
}






function updateCart() {
  cart.innerHTML = "";


   cartData.forEach((p, i) => {
    cart.innerHTML += `
      <div class="flex justify-between">
        <span>${p.name}</span>
        <button onclick="remove(${i})">❌</button>
      </div>
    `;
  });

  totalEl.innerText = total;
}






function remove(i) {
  total -= cartData[i].price;
  cartData.splice(i,1);
  updateCart();
}






function clearCart() {
  cartData = [];
  total = 0;
  updateCart();
}

loadCategories();