import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:3001/goals";

function App() {
  const [goals, setGoals] = useState([]);

 useEffect(() => {
  fetchGoals();
}, []);

async function fetchGoals() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    console.log("Fetched goals:", data); // keep this log to check what's coming back
    setGoals(data);
  } catch (err) {
    console.error("Error fetching goals:", err);
  }
}


  async function addGoal(e) {
    e.preventDefault();
    const form = e.target;
    const newGoal = {
      name: form.name.value,
      targetAmount: parseFloat(form.target.value),
      category: form.category.value,
      deadline: form.deadline.value,
      createdAt: new Date().toISOString().split("T")[0],
      savedAmount: 0,
    };
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newGoal),
    });
    form.reset();
    fetchGoals();
  }

  async function editGoal(goal) {
    const name = prompt("Update name:", goal.name);
    if (name === null) return;
    const targetAmount = parseFloat(prompt("Update target amount:", goal.targetAmount));
    if (isNaN(targetAmount)) return;
    const category = prompt("Update category:", goal.category);
    if (category === null) return;
    const deadline = prompt("Update deadline (YYYY-MM-DD):", goal.deadline);
    if (deadline === null) return;

    await fetch(`${API_URL}/${goal.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, targetAmount, category, deadline }),
    });
    fetchGoals();
  }

  async function deleteGoal(id) {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchGoals();
    }
  }

  async function deposit(goal, amount) {
    const newSaved = goal.savedAmount + amount;
    await fetch(`${API_URL}/${goal.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ savedAmount: newSaved }),
    });
    fetchGoals();
  }

  const activeGoals = goals.filter((g) => g.savedAmount < g.targetAmount);
  const completedGoals = goals.filter((g) => g.savedAmount >= g.targetAmount);
  const totalSaved = goals.reduce((sum, g) => sum + g.savedAmount, 0);

  return (
    <div className="bg-blue-800 min-h-screen text-gray-800 p-4 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-center text-white">Smart Goal Planner</h1>

      <div className="flex gap-4 bg-white p-2 rounded">
        <span>Total Goals: {goals.length}</span>
        <span>Total Saved: ${totalSaved}</span>
        <span>Completed: {completedGoals.length}</span>
      </div>

      <form onSubmit={addGoal} className="flex flex-wrap gap-2 bg-white p-2 rounded">
        <input name="name" placeholder="Goal Name" required className="border p-1" />
        <input name="target" type="number" placeholder="Target Amount" required className="border p-1" />
        <input name="category" placeholder="Category" required className="border p-1" />
        <input name="deadline" type="date" required className="border p-1" />
        <button className="bg-blue-600 text-white px-2 py-1 rounded">Add Goal</button>
      </form>

      <h2 className="font-semibold text-white">Active Goals</h2>
      <table className="w-full text-left bg-white rounded">
        <thead>
          <tr>
            <th>Name</th><th>Target</th><th>Saved</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {activeGoals.map((goal) => (
            <tr key={goal.id}>
              <td>{goal.name}</td>
              <td>${goal.targetAmount}</td>
              <td>${goal.savedAmount}</td>
              <td className="space-x-1">
                <button
                  onClick={() => {
                    const amount = parseFloat(prompt("Deposit amount:"));
                    if (!isNaN(amount) && amount > 0) deposit(goal, amount);
                  }}
                  className="bg-blue-500 text-white px-1 rounded"
                >
                  Deposit
                </button>
                <button onClick={() => editGoal(goal)} className="bg-yellow-500 text-white px-1 rounded">
                  Edit
                </button>
                <button onClick={() => deleteGoal(goal.id)} className="bg-red-500 text-white px-1 rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="font-semibold text-white">Completed Goals</h2>
      <ul className="bg-white p-2 rounded">
        {completedGoals.map((goal) => (
          <li key={goal.id}>
            {goal.name} - Target: ${goal.targetAmount} - Saved: ${goal.savedAmount}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
