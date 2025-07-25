import React from "react";
function ActiveGoals({ goals, onDeposit, onEdit, onDelete }) {
  // Helper to compute status & days left
  const getGoalStatus = (goal) => {
    const daysLeft = Math.max(
      0,
      Math.floor((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24))
    );
    let status = "In Progress";
    let color = "bg-blue-100 text-blue-800";

    if (goal.savedAmount >= goal.targetAmount) {
      status = "Completed";
      color = "bg-green-100 text-green-800";
    } else if (daysLeft === 0) {
      status = "Overdue";
      color = "bg-red-100 text-red-800";
    } else if (daysLeft <= 30) {
      status = "Warning";
      color = "bg-yellow-100 text-yellow-800";
    }

    return { status, color, daysLeft };
  };

  return (
    <section className="bg-white rounded-xl shadow p-4 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Your Goals</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {[
              "Goal",
              "Target Amount",
              "Saved Amount",
              "Category",
              "Deadline",
              "Created At",
              "Time Left",
              "Status",
              "Actions",
            ].map((title) => (
              <th
                key={title}
                className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
              >
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {goals.map((goal) => {
            const { status, color, daysLeft } = getGoalStatus(goal);
            return (
              <tr key={goal.id}>
                <td className="px-4 py-2">{goal.name}</td>
                <td className="px-4 py-2">${goal.targetAmount}</td>
                <td className="px-4 py-2">${goal.savedAmount}</td>
                <td className="px-4 py-2">{goal.category}</td>
                <td className="px-4 py-2">{goal.deadline}</td>
                <td className="px-4 py-2">{goal.createdAt}</td>
                <td className="px-4 py-2">{daysLeft} days</td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${color}`}
                  >
                    {status}
                  </span>
                </td>
                <td className="px-4 py-2 space-x-1">
                  <button
                    onClick={() => {
                      const amount = parseFloat(prompt("Deposit amount:"));
                      if (!isNaN(amount) && amount > 0) {
                        onDeposit(goal.id, amount);
                      }
                    }}
                    className="bg-blue-600 text-white text-xs px-2 py-1 rounded"
                  >
                    Deposit
                  </button>
                  <button
                    onClick={() => onEdit(goal.id)}
                    className="bg-yellow-500 text-white text-xs px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(goal.id)}
                    className="bg-red-600 text-white text-xs px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

export default ActiveGoals;
