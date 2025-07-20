const API_URL = "http://localhost:3000/goals";

document.addEventListener("DOMContentLoaded", () => {
  fetchAndRenderGoals();
});

async function fetchAndRenderGoals() {
  try {
    const res = await fetch(API_URL);
    const goals = await res.json();

    const activeGoals = goals.filter(g => g.savedAmount < g.targetAmount);
    const completedGoals = goals.filter(g => g.savedAmount >= g.targetAmount);

    renderActiveGoals(activeGoals);
    renderCompletedGoals(completedGoals);
    updateOverview(goals);
  } catch (error) {
    console.error("Error fetching goals:", error);
  }
}

function renderActiveGoals(goals) {
  const container = document.getElementById("goals-container");
  container.innerHTML = "";

  goals.forEach(goal => {
    const tr = document.createElement("tr");
    const daysLeft = calculateDaysLeft(goal.deadline);
    const status = getStatus(goal, daysLeft);

    tr.innerHTML = `
      <td class="px-4 py-2">${goal.name}</td>
      <td class="px-4 py-2">$${goal.targetAmount}</td>
      <td class="px-4 py-2">$${goal.savedAmount}</td>
      <td class="px-4 py-2">${goal.category}</td>
      <td class="px-4 py-2">${goal.deadline}</td>
      <td class="px-4 py-2">${goal.createdAt}</td>
      <td class="px-4 py-2">${daysLeft} days</td>
      <td class="px-4 py-2">
        <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium ${status.color}">
          ${status.text}
        </span>
      </td>
      <td class="px-4 py-2 space-x-1">
        <input type="number" class="deposit-input border rounded w-16 p-1 text-xs" placeholder="Deposit">
        <button class="deposit-btn bg-blue-600 text-white text-xs px-2 py-1 rounded">Deposit</button>
        <button class="edit-btn bg-yellow-500 text-white text-xs px-2 py-1 rounded">Edit</button>
        <button class="delete-btn bg-red-600 text-white text-xs px-2 py-1 rounded">Delete</button>
      </td>
    `;

    addRowEventListeners(tr, goal);
    container.appendChild(tr);
  });
}

function renderCompletedGoals(goals) {
  const container = document.getElementById("completed-goals-container");
  container.innerHTML = "";

  goals.forEach(goal => {
    const daysLeft = calculateDaysLeft(goal.deadline);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="px-4 py-2">${goal.name}</td>
      <td class="px-4 py-2">$${goal.targetAmount}</td>
      <td class="px-4 py-2">$${goal.savedAmount}</td>
      <td class="px-4 py-2">${goal.category}</td>
      <td class="px-4 py-2">${goal.deadline}</td>
      <td class="px-4 py-2">${goal.createdAt}</td>
      <td class="px-4 py-2">${daysLeft} days</td>
      <td class="px-4 py-2">
        <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
          Completed
        </span>
      </td>
    `;
    container.appendChild(tr);
  });
}

function calculateDaysLeft(deadline) {
  const diff = new Date(deadline) - new Date();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

function getStatus(goal, daysLeft) {
  if (goal.savedAmount >= goal.targetAmount) {
    return { text: "Completed", color: "bg-green-100 text-green-800" };
  }
  if (daysLeft === 0) {
    return { text: "Overdue", color: "bg-red-100 text-red-800" };
  }
  if (daysLeft <= 30) {
    return { text: "Warning", color: "bg-yellow-100 text-yellow-800" };
  }
  return { text: "In Progress", color: "bg-blue-100 text-blue-800" };
}

function addRowEventListeners(tr, goal) {
  const depositBtn = tr.querySelector(".deposit-btn");
  const depositInput = tr.querySelector(".deposit-input");
  const editBtn = tr.querySelector(".edit-btn");
  const deleteBtn = tr.querySelector(".delete-btn");

  depositBtn.addEventListener("click", () => {
    const amount = parseFloat(depositInput.value);
    if (isNaN(amount) || amount <= 0) return;
    makeDeposit(goal.id, goal.savedAmount, amount);
  });

  editBtn.addEventListener("click", () => {
    editGoal(goal);
  });

 deleteBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete this goal?")) {
    deleteGoal(goal.id);
  }
});
}

async function editGoal(goal) {
  const newName = prompt("Update name:", goal.name);
  if (newName === null) return;

  const newTarget = parseFloat(prompt("Update target amount:", goal.targetAmount));
  if (isNaN(newTarget)) return;

  const newCategory = prompt("Update category:", goal.category);
  if (newCategory === null) return;

  const newDeadline = prompt("Update deadline (YYYY-MM-DD):", goal.deadline);
  if (newDeadline === null) return;

  await fetch(`${API_URL}/${goal.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: newName,
      targetAmount: newTarget,
      category: newCategory,
      deadline: newDeadline
    })
  });

  fetchAndRenderGoals();
}

async function makeDeposit(goalId, currentSaved, amount) {
  const newSaved = currentSaved + amount;
  await fetch(`${API_URL}/${goalId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ savedAmount: newSaved })
  });
  fetchAndRenderGoals();
}

async function deleteGoal(goalId) {
  await fetch(`${API_URL}/${goalId}`, { method: "DELETE" });
  fetchAndRenderGoals();
}

document.getElementById("goal-form").addEventListener("submit", async e => {
  e.preventDefault();
  const name = document.getElementById("goal-name").value;
  const targetAmount = parseFloat(document.getElementById("goal-target").value);
  const category = document.getElementById("goal-category").value;
  const deadline = document.getElementById("goal-deadline").value;
  const createdAt = new Date().toISOString().split("T")[0];

  const newGoal = { name, targetAmount, category, deadline, savedAmount: 0, createdAt };
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newGoal)
  });
  e.target.reset();
  fetchAndRenderGoals();
});

function updateOverview(goals) {
  document.getElementById("total-goals").textContent = goals.length;
  const totalSaved = goals.reduce((sum, g) => sum + g.savedAmount, 0);
  document.getElementById("total-saved").textContent = totalSaved;
  const completed = goals.filter(g => g.savedAmount >= g.targetAmount).length;
  document.getElementById("completed-goals").textContent = completed;
}
