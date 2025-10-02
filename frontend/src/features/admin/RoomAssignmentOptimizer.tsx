import React, { useState, useMemo, useEffect } from 'react'
import { supabase } from '../../services/supabaseClient'
// ----------------------------------------

// --- Interfaces and Types ---

interface Student {
  id: number
  name: string
  preferences: string[] // IDs of preferred roommates
}

interface RoomConfig {
  size: 2 | 3 | 4 | 5
  count: number
}

interface Room {
  id: number
  capacity: number
  studentIds: string[]
  satisfactionScore: number
}

interface Metrics {
  totalStudents: number
  totalRooms: number
  unassignedStudents: number
  totalPreferencesSatisfied: number
  totalMutualPreferencesSatisfied: number
  rooms: Room[]
}

// --- Component Props ---

interface RoomAssignmentOptimizerProps {
  tourId: string // The Tour ID is now passed as a prop
}

// --- Data Fetching Logic (Supabase Integration) ---

/**
 * Fetches students associated with a given tour ID from Supabase.
 * ASSUMPTIONS:
 * 1. There is a 'students' table.
 * 2. The 'students' table has columns: 'id', 'name', 'tour_id'.
 * 3. There is a 'student_preferences' table to link student IDs.
 * (e.g., 'student_id', 'preferred_student_id')
 */
const fetchStudents = async (tourId: number): Promise<Student[]> => {
  // 1. Fetch all students for the given tour
  const { data: studentData, error: studentError } = await supabase
    .from('students') // Replace with your actual table name
    .select('id, name')
    .eq('tour_id', tourId) // Filter by the Tour ID

  if (studentError) {
    console.error('Error fetching students:', studentError)
    throw studentError
  }

  if (!studentData || studentData.length === 0) {
    return []
  }

  const studentIds = studentData.map((s) => s.id)

  // 2. Fetch all preferences for these students
  // NOTE: This assumes a simple preference table where each row is a (studentId, preferredStudentId) pair
  const { data: preferenceData, error: preferenceError } = await supabase
    .from('student_preferences') // Replace with your actual preferences table name
    .select('student_id, preferred_student_id')
    .in('student_id', studentIds)

  if (preferenceError) {
    console.error('Error fetching preferences:', preferenceError)
    throw preferenceError
  }

  // 3. Map preferences to the student objects
  const studentPreferences = new Map<number, string[]>()
  preferenceData?.forEach((pref) => {
    const currentPrefs = studentPreferences.get(pref.student_id) || []
    // Ensure only valid, fetched student IDs are added as preferences
    if (studentIds.includes(pref.preferred_student_id)) {
      currentPrefs.push(pref.preferred_student_id)
      studentPreferences.set(pref.student_id, currentPrefs)
    }
  })

  // NOTE: The original component assumed each student has a maximum of 3 preferences.
  // The database fetch will provide all preferences, which is a more robust approach.

  const students: Student[] = studentData.map((s) => ({
    id: s.id,
    name: s.name,
    // The original logic had a fixed array size (e.g., [2, 3, 4]).
    // We will now include the actual preferences, or an empty array if none exist.
    preferences: studentPreferences.get(s.id) || [],
  }))

  return students
}

// --- Optimization Logic (Remains the same) ---

// Helper to map student IDs to names will be created dynamically after fetching.

/**
 * Calculates a weighted pairwise score between two students.
 * Score: 2 for mutual preference, 1 for one-way preference, 0 otherwise.
 */
const calculatePairwiseScore = (s1: Student, s2: Student): number => {
  const s1WantsS2 = s1.preferences.includes(s2.id) ? 1 : 0
  const s2WantsS1 = s2.preferences.includes(s1.id) ? 1 : 0

  // Mutual preference (1+1=2) gets higher weight than one-way (1)
  return s1WantsS2 + s2WantsS1
}

/**
 * Calculates the total cohesion score for a group of students.
 * This is the sum of all pairwise scores within the group.
 */
const calculateGroupCohesion = (
  studentIds: string[],
  scoreMatrix: Map<number, Map<number, number>>
): number => {
  let cohesionScore = 0
  for (let i = 0; i < studentIds.length; i++) {
    for (let j = i + 1; j < studentIds.length; j++) {
      const id1 = studentIds[i]
      const id2 = studentIds[j]
      // Since the matrix is symmetric, we can check id1 -> id2
      cohesionScore += scoreMatrix.get(id1)?.get(id2) ?? 0
    }
  }
  return cohesionScore
}

/**
 * Core optimization function using a greedy heuristic.
 */
const calculateAssignment = (roomConfigs: RoomConfig[], students: Student[]): Metrics => {
  // 1. Pre-calculate the pairwise score matrix (symmetric)
  const scoreMatrix = new Map<number, Map<number, number>>()
  for (const s1 of students) {
    const s1Scores = new Map<number, number>()
    for (const s2 of students) {
      if (s1.id === s2.id) continue
      // We only need to calculate the score once (i->j) as the matrix is symmetric
      // by nature of the score calculation (s1WantsS2 + s2WantsS1).
      const score = calculatePairwiseScore(s1, s2)
      s1Scores.set(s2.id, score)
    }
    scoreMatrix.set(s1.id, s1Scores)
  }

  // 2. Setup initial state
  let availableRoomCounts = new Map(roomConfigs.map((c) => [c.size, c.count]))
  let unassignedIds = new Set(students.map((s) => s.id))
  const assignedRooms: Room[] = []
  let roomId = 1
  const sortedRoomSizes = roomConfigs.map((c) => c.size).sort((a, b) => b - a) as (2 | 3 | 4 | 5)[]

  // 3. Greedy Assignment Loop (Prioritize largest rooms first)
  for (const roomSize of sortedRoomSizes) {
    let remainingCount = availableRoomCounts.get(roomSize) || 0

    while (remainingCount > 0 && unassignedIds.size >= roomSize) {
      let bestRoom: { group: string[]; score: number } | null = null

      // Convert Set to Array for iteration
      const currentUnassigned = Array.from(unassignedIds)

      // Iteratively search for the best room of the current size
      // We check all possible starting students as 'seeds'
      for (const seedId of currentUnassigned) {
        // Find the best k-1 roommates for the seed (based on maximizing cohesion score)
        const candidates = currentUnassigned.filter((id) => id !== seedId)

        // Simple Heuristic: Choose k-1 students that have the highest pairwise score with the seed
        const bestRoommates = candidates
          .map((id) => ({ id, score: scoreMatrix.get(seedId)?.get(id) ?? 0 }))
          .sort((a, b) => b.score - a.score)
          .slice(0, roomSize - 1)
          .map((c) => c.id)

        const currentGroup = [seedId, ...bestRoommates]
        const currentScore = calculateGroupCohesion(currentGroup, scoreMatrix)

        if (!bestRoom || currentScore > bestRoom.score) {
          bestRoom = { group: currentGroup, score: currentScore }
        }
      }

      // If a room was successfully found
      if (bestRoom) {
        assignedRooms.push({
          id: roomId++,
          capacity: roomSize,
          studentIds: bestRoom.group,
          satisfactionScore: bestRoom.score,
        })

        // Remove assigned students from the unassigned pool
        bestRoom.group.forEach((id) => unassignedIds.delete(id))
        remainingCount--
        availableRoomCounts.set(roomSize, remainingCount)
      } else {
        // If we break here, it means no valid group of size 'roomSize' could be formed
        // among the remaining students based on the current greedy heuristic.
        break
      }
    }
  }

  // 4. Calculate Final Metrics
  let totalPreferencesSatisfied = 0
  let totalMutualPreferencesSatisfied = 0
  const allStudents = new Map(students.map((s) => [s.id, s]))

  // Create a map to quickly check which room a student is in
  const studentToRoomMap = new Map<number, number>() // studentId -> roomId
  for (const room of assignedRooms) {
    room.studentIds.forEach((id) => studentToRoomMap.set(id, room.id))
  }

  for (const student of students) {
    const studentRoomId = studentToRoomMap.get(student.id)
    if (!studentRoomId) continue // Unassigned

    const room = assignedRooms.find((r) => r.id === studentRoomId)
    if (!room) continue

    for (const prefId of student.preferences) {
      // Check if the preferred student is in the same room
      if (room.studentIds.includes(prefId)) {
        totalPreferencesSatisfied++

        // Check for mutual satisfaction
        const preferredStudent = allStudents.get(prefId)
        if (preferredStudent && preferredStudent.preferences.includes(student.id)) {
          // Ensures we only count the mutual link once (e.g., when A sees B, not B sees A)
          if (student.id < prefId) {
            totalMutualPreferencesSatisfied++
          }
        }
      }
    }
  }

  // The original component used a max of 3 preferences.
  // We'll update the max possible to be the largest number of preferences any student has, or 3 if that's the hard limit you want.
  // For now, let's keep the original logic for simplicity, but a more accurate max would be better.
  const maxIndividualPrefs = students.reduce((max, s) => Math.max(max, s.preferences.length), 0)
  const maxTotalPreferences = students.length * maxIndividualPrefs

  return {
    totalStudents: students.length,
    totalRooms: assignedRooms.length,
    unassignedStudents: unassignedIds.size,
    totalPreferencesSatisfied: totalPreferencesSatisfied,
    // Use the max based on the total number of preferences each student listed
    totalMutualPreferencesSatisfied: totalMutualPreferencesSatisfied,
    rooms: assignedRooms,
  }
}

// --- React Component ---

const RoomAssignmentOptimizer: React.FC<RoomAssignmentOptimizerProps> = ({ tourId }) => {
  const [roomCounts, setRoomCounts] = useState<{ [key: number]: number }>({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
  })
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [metrics, setMetrics] = useState<Metrics | null>(null)

  // Helper to map student IDs to names
  const studentMap = useMemo(() => new Map(students.map((s) => [s.id, s])), [students])
  const getStudentName = (id: number): string => studentMap.get(id)?.name ?? `ID ${id}`

  // Data Fetching Effect
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      try {
        const fetchedStudents = await fetchStudents(tourId)
        setStudents(fetchedStudents)
      } catch (err) {
        console.error(err)
        setError('Failed to load student data. Check Supabase connection and table names.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
    // Re-run if tourId changes
  }, [tourId])

  const totalAvailableSpots = useMemo(() => {
    return Object.entries(roomCounts).reduce((total, [size, count]) => {
      return total + parseInt(size) * count
    }, 0)
  }, [roomCounts])

  const maxTotalPreferences = useMemo(() => {
    // Calculate the maximum possible individual preferences (based on the data, not a hardcoded 3)
    const maxIndividualPrefs = students.reduce((max, s) => Math.max(max, s.preferences.length), 0)
    return students.length * maxIndividualPrefs
  }, [students])

  const handleRoomCountChange = (size: number, count: number) => {
    setRoomCounts((prev) => ({
      ...prev,
      [size]: Math.max(0, count), // Ensure count is not negative
    }))
  }

  const runOptimization = () => {
    if (students.length === 0) return

    const roomConfigs: RoomConfig[] = Object.entries(roomCounts)
      .filter(([, count]) => count > 0)
      .map(([size, count]) => ({
        size: parseInt(size) as 2 | 3 | 4 | 5,
        count: count,
      }))

    const result = calculateAssignment(roomConfigs, students)
    setMetrics(result)
  }

  const studentsReady = !loading && students.length > 0
  const optimizationDisabled = !studentsReady || totalAvailableSpots < students.length

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-50 font-sans">
      <style>{`
        .scroll-hidden::-webkit-scrollbar {
            display: none;
        }
        .scroll-hidden {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-2">
          Tour Group Room Assignment Optimizer
        </h1>
        <p className="text-gray-600 mb-8">
          Optimizing room assignments for **Tour ID: {tourId}**. Total students to assign:{' '}
          <span className="font-bold">{students.length}</span>.
        </p>

        {/* --- Loading and Error States --- */}
        {loading && (
          <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg shadow-md mb-6">
            Loading student data for Tour ID: {tourId}...
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-100 text-red-800 rounded-lg shadow-md mb-6">
            Error: {error}
          </div>
        )}

        {students.length === 0 && !loading && !error && (
          <div className="p-4 bg-gray-100 text-gray-800 rounded-lg shadow-md mb-6">
            No students found for Tour ID: {tourId}.
          </div>
        )}

        {studentsReady && (
          <>
            {/* --- Room Configuration Input --- */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 mb-8">
              <h2 className="text-xl font-semibold text-blue-700 mb-4">
                1. Configure Available Rooms
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[5, 4, 3, 2].map((size) => (
                  <div key={size} className="flex flex-col">
                    <label className="text-sm font-medium text-black mb-1">
                      Rooms of Size {size}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={roomCounts[size as keyof typeof roomCounts]}
                      onChange={(e) => handleRoomCountChange(size, parseInt(e.target.value))}
                      className="p-3 border border-gray-300 text-black rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Total Available Spots:{' '}
                <span className="font-bold text-blue-600">{totalAvailableSpots}</span>
                {' / '}
                Total Students: <span className="font-bold text-gray-800">{students.length}</span>
              </p>
            </div>

            {/* --- Optimization Button --- */}
            <button
              onClick={runOptimization}
              disabled={optimizationDisabled}
              className={`w-full p-4 rounded-xl text-white font-bold text-lg transition duration-200 shadow-md ${
                optimizationDisabled
                  ? 'bg-red-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl'
              }`}
            >
              {optimizationDisabled
                ? 'Not Enough Spots or Students Not Loaded!'
                : 'Run Room Assignment Optimization'}
            </button>
          </>
        )}

        {/* --- Results Display --- */}
        {metrics && studentsReady && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">2. Optimization Results</h2>

            {/* Metrics Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500 mb-6">
              <h3 className="text-lg font-bold text-gray-700 mb-3">Satisfaction Scorecard</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs font-medium text-blue-500 uppercase">
                    Total Preferences Met
                  </p>
                  <p className="text-2xl font-extrabold text-blue-800">
                    {metrics.totalPreferencesSatisfied}
                  </p>
                  <p className="text-sm text-gray-500">
                    ({metrics.totalPreferencesSatisfied} out of {maxTotalPreferences} max)
                  </p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <p className="text-xs font-medium text-indigo-500 uppercase">
                    Mutual Preferences Met (Links)
                  </p>
                  <p className="text-2xl font-extrabold text-indigo-800">
                    {metrics.totalMutualPreferencesSatisfied}
                  </p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-xs font-medium text-red-500 uppercase">Unassigned Students</p>
                  <p className="text-2xl font-extrabold text-red-800">
                    {metrics.unassignedStudents}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-xs font-medium text-green-500 uppercase">Total Rooms Used</p>
                  <p className="text-2xl font-extrabold text-green-800">{metrics.totalRooms}</p>
                </div>
              </div>
            </div>

            {/* Assignments List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {metrics.rooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white p-5 rounded-xl shadow-md border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-lg font-bold text-gray-800">
                      Room {room.id} (Size {room.capacity})
                    </h4>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Cohesion: {room.satisfactionScore}
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {room.studentIds.map((id) => {
                      const student = studentMap.get(id)
                      // Check for a valid student object before proceeding
                      if (!student) return null

                      const satisfiedCount = student.preferences.filter((prefId) =>
                        room.studentIds.includes(prefId)
                      ).length
                      // Display the max preferences the student listed, not a hardcoded '3'
                      const maxStudentPrefs = student.preferences.length

                      return (
                        <li
                          key={id}
                          className="flex justify-between p-2 bg-gray-50 rounded-lg text-sm text-gray-700"
                        >
                          <span className="font-medium">{getStudentName(id)}</span>
                          <span className="text-blue-500">
                            {satisfiedCount} / {maxStudentPrefs} Prefs Met
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>

            {/* Unassigned Students */}
            {metrics.unassignedStudents > 0 && (
              <div className="mt-6 p-5 bg-red-100 rounded-xl shadow-md">
                <h4 className="text-lg font-bold text-red-800 mb-2">
                  Unassigned Students ({metrics.unassignedStudents})
                </h4>
                <p className="text-sm text-red-700">
                  {students
                    .filter((s) => !metrics.rooms.some((r) => r.studentIds.includes(s.id)))
                    .map((s) => s.name)
                    .join(', ')}
                </p>
              </div>
            )}
          </div>
        )}

        {/* --- Data Visualization (Context) --- */}
        {students.length > 0 && (
          <div className="mt-10 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">3. Fetched Student Data</h3>
            <div className="h-64 overflow-y-auto p-4 bg-gray-800 text-gray-200 rounded-lg scroll-hidden">
              <pre className="text-xs leading-relaxed">{JSON.stringify(students, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RoomAssignmentOptimizer
