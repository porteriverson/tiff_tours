import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'

interface Profile {
  id: string
  name: string
  role: string
}

export const UserRolesManager = () => {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, role')
      .order('name', { ascending: true })

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

  if (loading) return <p>Loading users...</p>

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Manage User Roles</h2>
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
              <tr key={user.id} className="border-t">
                <td className="p-3">{user.name}</td>
                <td className="p-3 capitalize">{user.role}</td>
                <td className="p-3 text-center">
                  <select
                    value={user.role}
                    disabled={updatingId === user.id}
                    onChange={(e) => updateRole(user.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
