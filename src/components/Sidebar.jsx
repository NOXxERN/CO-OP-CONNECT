function Sidebar({ setActivePage })  {
  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <h2>CO-OP CONNECT</h2>
        <p>Admin Panel</p>
      </div>

      <nav>

        <button onClick={() => setActivePage('dashboard')}>
  📊 Dashboard
</button>

        <button onClick={() => setActivePage('workers')}>
  👷 Workers
</button>

       <button onClick={() => setActivePage('customers')}>
  👥 Customers
</button>

        <button onClick={() => setActivePage('bookings')}>
  📋 Bookings
</button>

        <button onClick={() => setActivePage('analytics')}>
  📈 Service Analytics
</button>
       <button onClick={() => setActivePage('ai')}>
  🤖 AI Demand Prediction
</button>

      </nav>

    </aside>
  )
}

export default Sidebar