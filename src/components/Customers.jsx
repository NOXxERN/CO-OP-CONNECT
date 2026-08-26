import { useState } from 'react'

function Customers() {
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: 'Ananya Sharma',
      phone: '9876543210',
      bookings: 8,
      status: 'Active',
    },
    {
      id: 2,
      name: 'Rahul Das',
      phone: '9830123456',
      bookings: 5,
      status: 'Active',
    },
    {
      id: 3,
      name: 'Priya Singh',
      phone: '9123456780',
      bookings: 12,
      status: 'Active',
    },
    {
      id: 4,
      name: 'Arjun Roy',
      phone: '9007123456',
      bookings: 2,
      status: 'Inactive',
    },
  ])

  const [filteredCustomers, setFilteredCustomers] =
    useState(customers)

  // Add customer form
  const [showForm, setShowForm] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [registering, setRegistering] = useState(false)
  const [message, setMessage] = useState('')

  // Search
  const [searchName, setSearchName] = useState('')
  const [searchStatus, setSearchStatus] =
    useState('All Customers')

  // Search customers
  const handleSearch = () => {
    const results = customers.filter((customer) => {

      const nameMatch =
        customer.name
          .toLowerCase()
          .includes(searchName.toLowerCase())

      const statusMatch =
        searchStatus === 'All Customers' ||
        customer.status === searchStatus

      return nameMatch && statusMatch
    })

    setFilteredCustomers(results)
  }

  // Reset search
  const handleResetSearch = () => {
    setSearchName('')
    setSearchStatus('All Customers')
    setFilteredCustomers(customers)
  }

  // Register customer
  const handleAddCustomer = async () => {
    if (!customerName || !customerEmail) {
      setMessage(
        'Please enter the customer name and email.'
      )
      return
    }

    setRegistering(true)
    setMessage('')

    try {
      const response = await fetch(
        'https://coop-connect-backend.onrender.com/api/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: customerName,
            email: customerEmail,
            role: 'customer',
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail || 'Failed to register customer'
        )
      }

      setMessage(
        `✅ Customer registered successfully! User ID: ${data.user_id}`
      )

      setCustomerName('')
      setCustomerEmail('')
      setShowForm(false)

    } catch (error) {
      console.error('Customer registration error:', error)
      setMessage(`❌ ${error.message}`)
    } finally {
      setRegistering(false)
    }
  }

  return (
    <div className="page">

      {/* PAGE HEADER */}

      <div className="page-header">

        <div>
          <h1>Customers</h1>

          <p>
            Manage customers using the Co-Op Connect platform.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => {
            setShowForm(!showForm)
            setMessage('')
          }}
        >
          {showForm
            ? '✕ Cancel'
            : '+ Add Customer'}
        </button>

      </div>


      {/* ADD CUSTOMER FORM */}

      {showForm && (

        <div className="analytics-section">

          <h2>Add New Customer</h2>

          <div className="filter-bar">

            <input
              type="text"
              placeholder="Customer name"
              value={customerName}
              onChange={(e) =>
                setCustomerName(e.target.value)
              }
            />

            <input
              type="email"
              placeholder="Customer email"
              value={customerEmail}
              onChange={(e) =>
                setCustomerEmail(e.target.value)
              }
            />

            <button
              className="primary-button"
              onClick={handleAddCustomer}
              disabled={registering}
            >
              {registering
                ? 'Registering...'
                : 'Register Customer'}
            </button>

          </div>

          {message && (
            <p>{message}</p>
          )}

        </div>

      )}

      {!showForm && message && (
        <p>{message}</p>
      )}


      {/* SEARCH */}

      <div className="filter-bar">

        <input
          type="text"
          placeholder="Search by customer name..."
          value={searchName}
          onChange={(e) =>
            setSearchName(e.target.value)
          }
        />

        <select
          value={searchStatus}
          onChange={(e) =>
            setSearchStatus(e.target.value)
          }
        >
          <option>All Customers</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>

        <button
  className="search-button"
  onClick={handleSearch}
>
  🔍 Search
</button>
        <button
          className="secondary-button"
          onClick={handleResetSearch}
        >
           ↻ Reset
        </button>

      </div>


      {/* CUSTOMER TABLE */}

      <div className="table-card">

        <table>

          <thead>

            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Total Bookings</th>
              <th>Status</th>
            </tr>

          </thead>

          <tbody>

            {filteredCustomers.length > 0 ? (

              filteredCustomers.map((customer) => (

                <tr key={customer.id}>

                  <td>
                    <strong>
                      {customer.name}
                    </strong>
                  </td>

                  <td>
                    {customer.phone}
                  </td>

                  <td>
                    {customer.bookings}
                  </td>

                  <td>

                    <span
                      className={`status ${
                        customer.status === 'Active'
                          ? 'verified'
                          : 'pending'
                      }`}
                    >
                      {customer.status}
                    </span>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="4"
                  style={{
                    textAlign: 'center',
                    padding: '30px',
                  }}
                >
                  No customers found.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  )
}

export default Customers