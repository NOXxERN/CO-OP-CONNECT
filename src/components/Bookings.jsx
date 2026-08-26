import { useState } from 'react'

function Bookings() {
  const [customerId, setCustomerId] = useState('')
  const [workerId, setWorkerId] = useState('')
  const [service, setService] = useState('Plumbing')

  const [createdBookings, setCreatedBookings] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Search filters
  const [searchText, setSearchText] = useState('')
  const [selectedService, setSelectedService] = useState('All Services')
  const [selectedStatus, setSelectedStatus] = useState('All Status')

  // Applied search filters
  const [appliedSearch, setAppliedSearch] = useState('')
  const [appliedService, setAppliedService] = useState('All Services')
  const [appliedStatus, setAppliedStatus] = useState('All Status')

  // Create a new booking
  const handleCreateBooking = async () => {
    if (!customerId || !workerId || !service) {
      setMessage('Please fill in all booking details.')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch(
        'https://coop-connect-backend.onrender.com/api/bookings',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customer_id: Number(customerId),
            worker_id: Number(workerId),
            service: service,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail || 'Failed to create booking'
        )
      }

      setCreatedBookings((prev) => [
        ...prev,
        {
          id: data.booking_id,
          customer: customerId,
          worker: workerId,
          service: service,
          status: data.status,
          date: new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          price: '—',
          isDemo: false,
        },
      ])

      setMessage(
        `✅ Booking created successfully! Booking ID: ${data.booking_id} | Status: ${data.status}`
      )

      setCustomerId('')
      setWorkerId('')
      setService('Plumbing')

    } catch (error) {
      console.error('Booking error:', error)
      setMessage(`❌ ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Update booking status
  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const response = await fetch(
        `https://coop-connect-backend.onrender.com/api/bookings/${bookingId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail || 'Failed to update booking status'
        )
      }

      setCreatedBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? {
                ...booking,
                status: newStatus,
              }
            : booking
        )
      )

      setMessage(
        `✅ Booking ${bookingId} status updated to ${newStatus}.`
      )

    } catch (error) {
      console.error('Status update error:', error)
      setMessage(`❌ ${error.message}`)
    }
  }

  // Demo bookings
  const demoBookings = [
    {
      id: 'BK001',
      customer: 'Ananya Sharma',
      worker: 'Rahul Das',
      service: 'Plumbing',
      date: '23 Aug 2026',
      status: 'Completed',
      price: '₹800',
      isDemo: true,
    },
    {
      id: 'BK002',
      customer: 'Priya Singh',
      worker: 'Amit Kumar',
      service: 'Electrical',
      date: '23 Aug 2026',
      status: 'In Progress',
      price: '₹600',
      isDemo: true,
    },
    {
      id: 'BK003',
      customer: 'Arjun Roy',
      worker: 'Sneha Das',
      service: 'Cleaning',
      date: '24 Aug 2026',
      status: 'Accepted',
      price: '₹500',
      isDemo: true,
    },
    {
      id: 'BK004',
      customer: 'Rahul Sen',
      worker: 'Arjun Roy',
      service: 'Painting',
      date: '25 Aug 2026',
      status: 'Pending',
      price: '₹1200',
      isDemo: true,
    },
  ]

  const allBookings = [
    ...demoBookings,
    ...createdBookings,
  ]

  // Search button
  const handleSearch = () => {
    setAppliedSearch(searchText.trim().toLowerCase())
    setAppliedService(selectedService)
    setAppliedStatus(selectedStatus)
  }

  // Reset button
  const handleReset = () => {
    setSearchText('')
    setSelectedService('All Services')
    setSelectedStatus('All Status')

    setAppliedSearch('')
    setAppliedService('All Services')
    setAppliedStatus('All Status')
  }

  // Filter bookings
  const filteredBookings = allBookings.filter((booking) => {
    const searchMatch =
      !appliedSearch ||
      String(booking.id)
        .toLowerCase()
        .includes(appliedSearch) ||
      String(booking.customer)
        .toLowerCase()
        .includes(appliedSearch) ||
      String(booking.worker)
        .toLowerCase()
        .includes(appliedSearch)

    const serviceMatch =
      appliedService === 'All Services' ||
      booking.service === appliedService

    const statusMatch =
      appliedStatus === 'All Status' ||
      booking.status.toLowerCase() ===
        appliedStatus.toLowerCase()

    return searchMatch && serviceMatch && statusMatch
  })

  return (
    <div className="page">

      <div className="page-header">
        <div>
          <h1>Bookings</h1>
          <p>Monitor and manage all service bookings.</p>
        </div>
      </div>

      {/* CREATE BOOKING */}

      <div className="analytics-section">

        <h2>Create New Booking</h2>

        <div className="filter-bar">

          <input
            type="number"
            placeholder="Customer ID"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          />

          <input
            type="number"
            placeholder="Worker ID"
            value={workerId}
            onChange={(e) => setWorkerId(e.target.value)}
          />

          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            <option>Plumbing</option>
            <option>Electrical</option>
            <option>Cleaning</option>
            <option>Painting</option>
          </select>

          <button
            className="primary-button"
            onClick={handleCreateBooking}
            disabled={loading}
          >
            {loading ? 'Creating...' : '+ Create Booking'}
          </button>

        </div>

        {message && (
          <p>{message}</p>
        )}

      </div>

      {/* SEARCH AND FILTERS */}

      <div className="filter-bar">

        <input
          type="text"
          placeholder="Search by booking ID, customer or worker..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
        >
          <option>All Services</option>
          <option>Plumbing</option>
          <option>Electrical</option>
          <option>Cleaning</option>
          <option>Painting</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option>All Status</option>
          <option>Pending</option>
          <option>Accepted</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <button
  className="search-button"
  onClick={handleSearch}
>
  🔍 Search
</button>
        <button
          className="secondary-button"
          onClick={handleReset}
        >
          ↻ Reset
        </button>

      </div>

      {/* BOOKINGS TABLE */}

      <div className="table-card">

        <table>

          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Customer</th>
              <th>Worker</th>
              <th>Service</th>
              <th>Date</th>
              <th>Status</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredBookings.length > 0 ? (

              filteredBookings.map((booking) => (

                <tr key={booking.id}>

                  <td>{booking.id}</td>

                  <td>{booking.customer}</td>

                  <td>{booking.worker}</td>

                  <td>{booking.service}</td>

                  <td>{booking.date}</td>

                  <td>
                    <span
                      className={
                        booking.status.toLowerCase() === 'completed'
                          ? 'status verified'
                          : 'status pending'
                      }
                    >
                      {booking.status}
                    </span>
                  </td>

                  <td>{booking.price}</td>

                  <td>
                    {!booking.isDemo && (
                      <button
                        className="primary-button"
                        onClick={() =>
                          handleUpdateStatus(
                            booking.id,
                            'accepted'
                          )
                        }
                      >
                        Accept
                      </button>
                    )}
                  </td>

                </tr>

              ))

            ) : (

              <tr>
                <td
                  colSpan="8"
                  style={{
                    textAlign: 'center',
                    padding: '30px',
                    color: '#64748b',
                  }}
                >
                  No bookings found.
                </td>
              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  )
}

export default Bookings