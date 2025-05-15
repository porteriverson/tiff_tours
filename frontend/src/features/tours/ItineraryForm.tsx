import React, { useState } from 'react'
// import 'bootstrap/dist/css/bootstrap.min.css';

interface ItineraryItem {
  date: string
  time: string
  activity: string
  location: string
}

interface Itinerary {
  title: string
  startDate: string
  endDate: string
  items: ItineraryItem[]
}

const ItineraryForm: React.FC = () => {
  const [showModal, setShowModal] = useState(false)
  const [title, setTitle] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [items, setItems] = useState<ItineraryItem[]>([])
  const [newItem, setNewItem] = useState<ItineraryItem>({
    date: '',
    time: '',
    activity: '',
    location: '',
  })

  const resetForm = () => {
    setTitle('')
    setStartDate('')
    setEndDate('')
    setItems([])
    setNewItem({ date: '', time: '', activity: '', location: '' })
  }

  const handleAddItem = () => {
    if (newItem.date && newItem.activity && newItem.location) {
      setItems([...items, newItem])
      setNewItem({ date: '', time: '', activity: '', location: '' })
    }
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    const itinerary: Itinerary = { title, startDate, endDate, items }
    console.log('Itinerary submitted:', itinerary)
    resetForm()
    setShowModal(false)
  }

  return (
    <div>
      <button className="btn btn-primary" onClick={() => setShowModal(true)}>
        Create New Itinerary
      </button>

      {showModal && (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title">New Itinerary</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Itinerary Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Trip Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Trip End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>

                <hr />
                <h6>Add Itinerary Item</h6>
                <div className="row g-2 mb-3">
                  <div className="col-md-3">
                    <input
                      type="date"
                      className="form-control"
                      value={newItem.date}
                      onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="time"
                      className="form-control"
                      value={newItem.time}
                      onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Activity"
                      value={newItem.activity}
                      onChange={(e) => setNewItem({ ...newItem, activity: e.target.value })}
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Location"
                      value={newItem.location}
                      onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                    />
                  </div>
                  <div className="col-md-1 d-grid">
                    <button className="btn btn-success" onClick={handleAddItem}>
                      +
                    </button>
                  </div>
                </div>

                <ul className="list-group mb-3">
                  {items.map((item, index) => (
                    <li
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <span>
                        <strong>{item.time}</strong> {item.date} – {item.activity} @ {item.location}
                      </span>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleRemoveItem(index)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={!title || !startDate || items.length === 0}
                >
                  Save Itinerary
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal backdrop */}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </div>
  )
}

export default ItineraryForm
