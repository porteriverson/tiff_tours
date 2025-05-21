import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabaseClient'

interface Profile {
  id: string
  name: string
  role: string
}

export const UserRolesManager = () => {
  const [users, setUsers] = useState<Profile[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchUsers = async (searchTerm = '') => {
    setLoading(true)

    const query = supabase.from('profiles').select('id, name, role')

    if (searchTerm.trim() === '') {
      query.eq('role', 'admin').order('name')
    } else {
      query.ilike('name', `%${searchTerm}%`).order('name')
    }

    const { data, error } = await query

    if (error) console.error('Error fetching users:', error)
    else setUsers(data || [])

    setLoading(false)
  }

  const updateRole = async (id: string, newRole: string) => {
    setUpdatingId(id)
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', id)

    if (error) console.error('Error updating role:', error)
    else {
      setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, role: newRole } : user)))
    }

    setUpdatingId(null)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearch(term)
    fetchUsers(term)
  }

  return (
    <div className="mt- min-w-[90%]">
      <h2 className="text-xl font-bold mb-4">Manage User Roles</h2>
      <input
        type="text"
        value={search}
        onChange={handleSearchChange}
        placeholder="Search users by name..."
        className="mb-4 p-2 border rounded w-full max-w-md"
      />
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3">Change Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t text-start">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3 capitalize">{user.role}</td>
                  <td className="p-3 text-center">
                    <select
                      value={user.role}
                      disabled={updatingId === user.id}
                      onChange={(e) => updateRole(user.id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="traveler">Traveler</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
