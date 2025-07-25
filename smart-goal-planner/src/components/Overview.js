function Overview({ totalGoals, totalSaved, completedGoals }) {
  return (
    <section className="bg-white rounded-xl shadow p-4">
      <h2 className="text-xl font-semibold mb-2">Overview</h2>
      <div className="flex flex-wrap gap-4">
        <p className="bg-blue-100 text-blue-800 px-3 py-1 rounded">Total Goals: <span>{totalGoals}</span></p>
        <p className="bg-green-100 text-green-800 px-3 py-1 rounded">Total Saved: ${totalSaved}</p>
        <p className="bg-purple-100 text-purple-800 px-3 py-1 rounded">Goals Completed: <span>{completedGoals}</span></p>
      </div>
    </section>
  );
}
export default Overview;