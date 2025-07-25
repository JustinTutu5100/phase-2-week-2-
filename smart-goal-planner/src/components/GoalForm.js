function GoalForm({ onAddGoal }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const newGoal = {
      name: e.target.name.value,
      targetAmount: parseFloat(e.target.targetAmount.value),
      category: e.target.category.value,
      deadline: e.target.deadline.value,
      createdAt: new Date().toISOString().split("T")[0],
      savedAmount: 0
    };
    onAddGoal(newGoal);
    e.target.reset();
  };

  return (
    <section className="bg-white rounded-xl shadow p-4">
      <h2 className="text-xl font-semibold mb-2">Add New Goal</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="name" type="text" placeholder="Goal Name" required className="border rounded p-2"/>
        <input name="targetAmount" type="number" placeholder="Target Amount" required className="border rounded p-2"/>
        <input name="category" type="text" placeholder="Category" required className="border rounded p-2"/>
        <input name="deadline" type="date" required className="border rounded p-2"/>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 md:col-span-2">Add Goal</button>
      </form>
    </section>
  );
}
export default GoalForm;