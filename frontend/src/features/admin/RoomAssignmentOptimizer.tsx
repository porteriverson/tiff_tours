import React, { useState, useMemo, useEffect } from 'react'
import { supabase } from '../../services/supabaseClient'
// ----------------------------------------

// --- Interfaces and Types ---

interface Student {
  id: string // CHANGED from number to string
  name: string
  preferences: string[] // Remains string[] (IDs of preferred roommates)
}

interface RoomConfig {
  size: 2 | 3 | 4 | 5
  count: number
}

interface Room {
  id: number
  capacity: number
  studentIds: string[] // Already a string array
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
 * NOTE: Converts all fetched IDs (which are typically numbers in the DB but treated as strings for consistency) to strings.
 */
const fetchStudents = async (tourId: string): Promise<Student[]> => {
  // TourId is assumed to be a string here since it's passed as a prop, but if your DB stores it as a number, you might need a conversion.
  // For safety, let's treat it as a number if that's what the DB expects, or keep it as a string if that's the prop type.
  // Assuming 'tourId' prop is a string that can be used directly.

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

  // Convert student IDs to strings immediately
  const studentIds = studentData.map((s) => String(s.id))

  // 2. Fetch all preferences for these students
  const { data: preferenceData, error: preferenceError } = await supabase
    .from('student_preferences') // Replace with your actual preferences table name
    .select('student_id, preferred_student_id')
    .in('student_id', studentIds) // Uses string IDs for the 'in' clause

  if (preferenceError) {
    console.error('Error fetching preferences:', preferenceError)
    throw preferenceError
  }

  // 3. Map preferences to the student objects
  // Keys are string IDs, values are string ID arrays
  const studentPreferences = new Map<string, string[]>()
  preferenceData?.forEach((pref) => {
    // Ensure all IDs are strings before use
    const studentId = String(pref.student_id)
    const preferredId = String(pref.preferred_student_id)

    const currentPrefs = studentPreferences.get(studentId) || []
    // Ensure only valid, fetched student IDs are added as preferences
    if (studentIds.includes(preferredId)) {
      currentPrefs.push(preferredId)
      studentPreferences.set(studentId, currentPrefs)
    }
  })

  // 4. Create final Student objects with string IDs
  const students: Student[] = studentData.map((s) => {
    const studentId = String(s.id)
    return {
      id: studentId, // Set student ID as string
      name: s.name,
      // The preferences array is already correctly set to string[]
      preferences: studentPreferences.get(studentId) || [],
    }
  })

  return students
}

// --- Optimization Logic (Refactored for string IDs) ---

/**
 * Calculates a weighted pairwise score between two students.
 */
const calculatePairwiseScore = (s1: Student, s2: Student): number => {
  // s1.id and s2.id are now strings
  const s1WantsS2 = s1.preferences.includes(s2.id) ? 1 : 0
  const s2WantsS1 = s2.preferences.includes(s1.id) ? 1 : 0

  return s1WantsS2 + s2WantsS1
}

/**
 * Calculates the total cohesion score for a group of students.
 * ScoreMatrix now uses string IDs as keys.
 */
const calculateGroupCohesion = (
  studentIds: string[],
  // CHANGED: Keys are now string IDs
  scoreMatrix: Map<string, Map<string, number>>
): number => {
  let cohesionScore = 0
  for (let i = 0; i < studentIds.length; i++) {
    for (let j = i + 1; j < studentIds.length; j++) {
      const id1 = studentIds[i]
      const id2 = studentIds[j]
      // scoreMatrix access uses string IDs
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
  // CHANGED: Keys are now string IDs
  const scoreMatrix = new Map<string, Map<string, number>>()
  for (const s1 of students) {
    // CHANGED: Keys are now string IDs
    const s1Scores = new Map<string, number>()
    for (const s2 of students) {
      if (s1.id === s2.id) continue
      const score = calculatePairwiseScore(s1, s2)
      s1Scores.set(s2.id, score) // s2.id is a string
    }
    scoreMatrix.set(s1.id, s1Scores) // s1.id is a string
  }

  // 2. Setup initial state
  let availableRoomCounts = new Map(roomConfigs.map((c) => [c.size, c.count]))
  // CHANGED: Set of string IDs
  let unassignedIds = new Set(students.map((s) => s.id))
  const assignedRooms: Room[] = []
  let roomId = 1
  const sortedRoomSizes = roomConfigs.map((c) => c.size).sort((a, b) => b - a) as (2 | 3 | 4 | 5)[]

  // 3. Greedy Assignment Loop (Prioritize largest rooms first)
  for (const roomSize of sortedRoomSizes) {
    let remainingCount = availableRoomCounts.get(roomSize) || 0

    while (remainingCount > 0 && unassignedIds.size >= roomSize) {
      // Group elements are string IDs
      let bestRoom: { group: string[]; score: number } | null = null

      // Convert Set to Array for iteration (elements are string IDs)
      const currentUnassigned = Array.from(unassignedIds)

      // Iteratively search for the best room of the current size
      for (const seedId of currentUnassigned) {
        // seedId is a string
        // Find the best k-1 roommates for the seed (based on maximizing cohesion score)
        const candidates = currentUnassigned.filter((id) => id !== seedId)

        // Simple Heuristic: Choose k-1 students that have the highest pairwise score with the seed
        const bestRoommates = candidates
          .map((id) => ({ id, score: scoreMatrix.get(seedId)?.get(id) ?? 0 })) // scoreMatrix access uses string IDs
          .sort((a, b) => b.score - a.score)
          .slice(0, roomSize - 1)
          .map((c) => c.id)

        const currentGroup = [seedId, ...bestRoommates] // All elements are string IDs
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
          studentIds: bestRoom.group, // string IDs
          satisfactionScore: bestRoom.score,
        })

        // Remove assigned students from the unassigned pool
        bestRoom.group.forEach((id) => unassignedIds.delete(id)) // id is a string
        remainingCount--
        availableRoomCounts.set(roomSize, remainingCount)
      } else {
        break
      }
    }
  }

  // 4. Calculate Final Metrics
  let totalPreferencesSatisfied = 0
  let totalMutualPreferencesSatisfied = 0
  // CHANGED: Map key is a string ID
  const allStudents = new Map<string, Student>(students.map((s) => [s.id, s]))

  // Create a map to quickly check which room a student is in
  // CHANGED: Map key is a string ID
  const studentToRoomMap = new Map<string, number>() // studentId (string) -> roomId (number)
  for (const room of assignedRooms) {
    room.studentIds.forEach((id) => studentToRoomMap.set(id, room.id)) // id is a string
  }

  for (const student of students) {
    // student.id is a string
    const studentRoomId = studentToRoomMap.get(student.id)
    if (!studentRoomId) continue // Unassigned

    const room = assignedRooms.find((r) => r.id === studentRoomId)
    if (!room) continue

    for (const prefId of student.preferences) {
      // prefId is a string
      // Check if the preferred student is in the same room
      if (room.studentIds.includes(prefId)) {
        totalPreferencesSatisfied++

        // Check for mutual satisfaction
        const preferredStudent = allStudents.get(prefId)
        if (preferredStudent && preferredStudent.preferences.includes(student.id)) {
          // Ensures we only count the mutual link once (string comparison)
          if (student.id < prefId) {
            totalMutualPreferencesSatisfied++
          }
        }
      }
    }
  }

  return {
    totalStudents: students.length,
    totalRooms: assignedRooms.length,
    unassignedStudents: unassignedIds.size,
    totalPreferencesSatisfied: totalPreferencesSatisfied,
    totalMutualPreferencesSatisfied: totalMutualPreferencesSatisfied,
    rooms: assignedRooms,
  }
}

// --- React Component (Refactored for string IDs) ---

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

  // Helper to map student IDs (string) to names
  // CHANGED: Map key is a string ID
  const studentMap = useMemo(
    () => new Map<string, Student>(students.map((s) => [s.id, s])),
    [students]
  )
  // CHANGED: id parameter is a string
  const getStudentName = (id: string): string => studentMap.get(id)?.name ?? `ID ${id}`

  // Data Fetching Effect
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      try {
        // tourId is already a string
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
  }, [tourId]) // Re-run if tourId changes

  const totalAvailableSpots = useMemo(() => {
    return Object.entries(roomCounts).reduce((total, [size, count]) => {
      return total + parseInt(size) * count
    }, 0)
  }, [roomCounts])

  const maxTotalPreferences = useMemo(() => {
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
                      // id is a string
                      const student = studentMap.get(id)
                      // Check for a valid student object before proceeding
                      if (!student) return null

                      // student.preferences are string IDs, room.studentIds are string IDs
                      const satisfiedCount = student.preferences.filter((prefId) =>
                        room.studentIds.includes(prefId)
                      ).length
                      const maxStudentPrefs = student.preferences.length

                      return (
                        <li
                          key={id} // key is a string
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
                    // s.id is a string, r.studentIds are string[]
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
