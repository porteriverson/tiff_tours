import React, { useState } from 'react'

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
    <div className="p-4">
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={() => setShowModal(true)}
      >
        Create New Itinerary
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded shadow-lg overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">New Itinerary</h2>
              <button
                onClick={() => {
                  setShowModal(false)
                  resetForm()
                }}
                className="text-gray-500 dark:text-white hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            <div className="p-4 space-y-4">
              <input
                type="text"
                placeholder="Itinerary Title"
                className="w-full border dark:border-gray-600 p-2 rounded"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="flex gap-4">
                <input
                  type="date"
                  className="w-full border dark:border-gray-600 p-2 rounded"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                  type="date"
                  className="w-full border dark:border-gray-600 p-2 rounded"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <hr />
              <h4 className="font-semibold">Add Itinerary Item</h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                <input
                  type="date"
                  className="border dark:border-gray-600 p-2 rounded"
                  value={newItem.date}
                  onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
                />
                <input
                  type="time"
                  className="border dark:border-gray-600 p-2 rounded"
                  value={newItem.time}
                  onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Activity"
                  className="border dark:border-gray-600 p-2 rounded"
                  value={newItem.activity}
                  onChange={(e) => setNewItem({ ...newItem, activity: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Location"
                  className="border dark:border-gray-600 p-2 rounded"
                  value={newItem.location}
                  onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                />
                <button
                  onClick={handleAddItem}
                  className="bg-green-500 text-black px-4 py-2 rounded hover:bg-green-600 dark:text-white dark:bg-green-600 dark:hover:bg-green-700"
                >
                  +
                </button>
              </div>

              <ul className="divide-y">
                {items.map((item, index) => (
                  <li key={index} className="flex justify-between items-center py-2">
                    <span>
                      <strong>{item.time}</strong> {item.date} – {item.activity} @ {item.location}
                    </span>
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-500 hover:bg-red-300 hover:text-black"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end gap-2 p-4 border-t">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-black dark:text-white rounded disabled:opacity-50 dark:bg-blue-600"
                disabled={!title || !startDate || items.length === 0}
              >
                Save Itinerary
              </button>
              <button
                onClick={() => {
                  setShowModal(false)
                  resetForm()
                }}
                className="px-4 py-2 dark:text-white border dark:border-gray-600 rounded text-gray-700 hover:bg-gray-100 dark:hover:text-gray-500 "
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ItineraryForm
