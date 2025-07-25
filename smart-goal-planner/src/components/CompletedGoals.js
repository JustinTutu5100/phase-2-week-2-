function CompletedGoals({ goals, onDeposit, onEdit, onDelete }) {
  return (
    <section className="bg-white rounded-xl shadow p-4 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Your Goals</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {["Goal","Target Amount","Saved Amount","Category","Deadline","Created At","Time Left","Status","Actions"]
              .map((title) => (
                <th key={title} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{title}</th>
              ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {goals.map(goal => (
            <tr key={goal.id}>
              <td className="px-4 py-2">{goal.name}</td>
              <td className="px-4 py-2">${goal.targetAmount}</td>
              <td className="px-4 py-2">${goal.savedAmount}</td>
              <td className="px-4 py-2">{goal.category}</td>
              <td className="px-4 py-2">{goal.deadline}</td>
              <td className="px-4 py-2">{goal.createdAt}</td>
              <td className="px-4 py-2">{/* calculate days left */}</td>
              <td className="px-4 py-2">{/* show status */}</td>
              <td className="px-4 py-2 space-x-1">
                <input type="number" className="border rounded w-16 p-1 text-xs" placeholder="Deposit" />
                <button className="bg-blue-600 text-white text-xs px-2 py-1 rounded">Deposit</button>
                <button className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">Edit</button>
                <button className="bg-red-600 text-white text-xs px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
export default CompletedGoals;