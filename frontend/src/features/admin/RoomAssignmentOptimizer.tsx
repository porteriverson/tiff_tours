import React, { useState, useMemo, useEffect } from 'react'
import { supabase } from '../../services/supabaseClient'

// --- Interfaces and Types ---

interface Student {
  id: string
  name: string
  gender: string
  preferences: string[]
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
  gender: string
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
  tourId: string
}

// --- Data Fetching Logic ---

const fetchStudents = async (tourId: string): Promise<Student[]> => {
  const { data: studentData, error: studentError } = await supabase
    .from('booked_travelers')
    .select(
      'id, student_name, student_gender, room_preference_1, room_preference_2, room_preference_3'
    )
    .eq('tour_id', tourId)
    .not('student_name', 'is', null)

  if (studentError) {
    console.error('Error fetching students:', studentError)
    throw studentError
  }

  if (!studentData || studentData.length === 0) {
    return []
  }

  const studentIdToName = new Map(studentData.map((s) => [String(s.id), s.student_name]))

  const students: Student[] = studentData.map((s) => {
    const studentId = String(s.id)
    const preferences: string[] = []

    // Map preference names to IDs
    const prefNames = [s.room_preference_1, s.room_preference_2, s.room_preference_3].filter(
      Boolean
    )

    for (const prefName of prefNames) {
      for (const [id, name] of studentIdToName.entries()) {
        if (name === prefName && id !== studentId) {
          preferences.push(id)
          break
        }
      }
    }

    return {
      id: studentId,
      name: s.student_name,
      gender: s.student_gender?.toLowerCase() || 'unknown',
      preferences: preferences,
    }
  })

  return students
}

// --- Optimization Logic ---

const calculatePairwiseScore = (s1: Student, s2: Student): number => {
  const s1WantsS2 = s1.preferences.includes(s2.id) ? 1 : 0
  const s2WantsS1 = s2.preferences.includes(s1.id) ? 1 : 0
  return s1WantsS2 + s2WantsS1
}

const calculateGroupCohesion = (
  studentIds: string[],
  scoreMatrix: Map<string, Map<string, number>>
): number => {
  let cohesionScore = 0
  for (let i = 0; i < studentIds.length; i++) {
    for (let j = i + 1; j < studentIds.length; j++) {
      const id1 = studentIds[i]
      const id2 = studentIds[j]
      cohesionScore += scoreMatrix.get(id1)?.get(id2) ?? 0
    }
  }
  return cohesionScore
}

const calculateAssignment = (
  roomConfigs: RoomConfig[],
  students: Student[],
  gender: string
): Metrics => {
  const genderStudents = students.filter((s) => s.gender === gender)

  const scoreMatrix = new Map<string, Map<string, number>>()
  for (const s1 of genderStudents) {
    const s1Scores = new Map<string, number>()
    for (const s2 of genderStudents) {
      if (s1.id === s2.id) continue
      const score = calculatePairwiseScore(s1, s2)
      s1Scores.set(s2.id, score)
    }
    scoreMatrix.set(s1.id, s1Scores)
  }

  const availableRoomCounts = new Map(roomConfigs.map((c) => [c.size, c.count]))
  const unassignedIds = new Set(genderStudents.map((s) => s.id))
  const assignedRooms: Room[] = []
  let roomId = 1
  const sortedRoomSizes = roomConfigs.map((c) => c.size).sort((a, b) => b - a) as (2 | 3 | 4 | 5)[]

  for (const roomSize of sortedRoomSizes) {
    let remainingCount = availableRoomCounts.get(roomSize) || 0

    while (remainingCount > 0 && unassignedIds.size >= roomSize) {
      let bestRoom: { group: string[]; score: number } | null = null
      const currentUnassigned = Array.from(unassignedIds)

      for (const seedId of currentUnassigned) {
        const candidates = currentUnassigned.filter((id) => id !== seedId)
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

      if (bestRoom) {
        assignedRooms.push({
          id: roomId++,
          capacity: roomSize,
          studentIds: bestRoom.group,
          satisfactionScore: bestRoom.score,
          gender: gender,
        })

        bestRoom.group.forEach((id) => unassignedIds.delete(id))
        remainingCount--
        availableRoomCounts.set(roomSize, remainingCount)
      } else {
        break
      }
    }
  }

  let totalPreferencesSatisfied = 0
  let totalMutualPreferencesSatisfied = 0
  const allStudents = new Map<string, Student>(genderStudents.map((s) => [s.id, s]))
  const studentToRoomMap = new Map<string, number>()

  for (const room of assignedRooms) {
    room.studentIds.forEach((id) => studentToRoomMap.set(id, room.id))
  }

  for (const student of genderStudents) {
    const studentRoomId = studentToRoomMap.get(student.id)
    if (!studentRoomId) continue

    const room = assignedRooms.find((r) => r.id === studentRoomId)
    if (!room) continue

    for (const prefId of student.preferences) {
      if (room.studentIds.includes(prefId)) {
        totalPreferencesSatisfied++

        const preferredStudent = allStudents.get(prefId)
        if (preferredStudent && preferredStudent.preferences.includes(student.id)) {
          if (student.id < prefId) {
            totalMutualPreferencesSatisfied++
          }
        }
      }
    }
  }

  return {
    totalStudents: genderStudents.length,
    totalRooms: assignedRooms.length,
    unassignedStudents: unassignedIds.size,
    totalPreferencesSatisfied: totalPreferencesSatisfied,
    totalMutualPreferencesSatisfied: totalMutualPreferencesSatisfied,
    rooms: assignedRooms,
  }
}

// --- React Component ---

const RoomAssignmentOptimizer: React.FC<RoomAssignmentOptimizerProps> = ({ tourId }) => {
  const [maleRoomCounts, setMaleRoomCounts] = useState<{ [key: number]: number }>({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
  })
  const [femaleRoomCounts, setFemaleRoomCounts] = useState<{ [key: number]: number }>({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
  })
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [maleMetrics, setMaleMetrics] = useState<Metrics | null>(null)
  const [femaleMetrics, setFemaleMetrics] = useState<Metrics | null>(null)
  const [draggedStudent, setDraggedStudent] = useState<{
    id: string
    fromRoom: number | null
    gender: string
  } | null>(null)

  const studentMap = useMemo(
    () => new Map<string, Student>(students.map((s) => [s.id, s])),
    [students]
  )

  const getStudentName = (id: string): string => studentMap.get(id)?.name ?? `ID ${id}`

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
  }, [tourId])

  const maleStudents = useMemo(() => students.filter((s) => s.gender === 'male'), [students])
  const femaleStudents = useMemo(() => students.filter((s) => s.gender === 'female'), [students])

  const handleRoomCountChange = (gender: string, size: number, count: number) => {
    const setter = gender === 'male' ? setMaleRoomCounts : setFemaleRoomCounts
    setter((prev) => ({
      ...prev,
      [size]: Math.max(0, count),
    }))
  }

  const runOptimization = () => {
    if (students.length === 0) return

    const maleConfigs: RoomConfig[] = Object.entries(maleRoomCounts)
      .filter(([, count]) => count > 0)
      .map(([size, count]) => ({
        size: parseInt(size) as 2 | 3 | 4 | 5,
        count: count,
      }))

    const femaleConfigs: RoomConfig[] = Object.entries(femaleRoomCounts)
      .filter(([, count]) => count > 0)
      .map(([size, count]) => ({
        size: parseInt(size) as 2 | 3 | 4 | 5,
        count: count,
      }))

    const maleResult = calculateAssignment(maleConfigs, students, 'male')
    const femaleResult = calculateAssignment(femaleConfigs, students, 'female')

    setMaleMetrics(maleResult)
    setFemaleMetrics(femaleResult)
  }

  const handleDragStart = (studentId: string, roomId: number | null, gender: string) => {
    setDraggedStudent({ id: studentId, fromRoom: roomId, gender })
  }

  const handleDrop = (targetRoomId: number, gender: string) => {
    if (!draggedStudent || draggedStudent.gender !== gender) return

    const metrics = gender === 'male' ? maleMetrics : femaleMetrics
    const setMetrics = gender === 'male' ? setMaleMetrics : setFemaleMetrics

    if (!metrics) return

    const updatedRooms = metrics.rooms.map((room) => {
      if (room.id === draggedStudent.fromRoom) {
        return {
          ...room,
          studentIds: room.studentIds.filter((id) => id !== draggedStudent.id),
        }
      }
      if (room.id === targetRoomId) {
        if (
          room.studentIds.length < room.capacity &&
          !room.studentIds.includes(draggedStudent.id)
        ) {
          return {
            ...room,
            studentIds: [...room.studentIds, draggedStudent.id],
          }
        }
      }
      return room
    })

    const unassignedCount =
      metrics.totalStudents - updatedRooms.reduce((sum, r) => sum + r.studentIds.length, 0)

    setMetrics({
      ...metrics,
      rooms: updatedRooms,
      unassignedStudents: unassignedCount,
    })

    setDraggedStudent(null)
  }

  const removeFromRoom = (studentId: string, roomId: number, gender: string) => {
    const metrics = gender === 'male' ? maleMetrics : femaleMetrics
    const setMetrics = gender === 'male' ? setMaleMetrics : setFemaleMetrics

    if (!metrics) return

    const updatedRooms = metrics.rooms.map((room) => {
      if (room.id === roomId) {
        return {
          ...room,
          studentIds: room.studentIds.filter((id) => id !== studentId),
        }
      }
      return room
    })

    const unassignedCount =
      metrics.totalStudents - updatedRooms.reduce((sum, r) => sum + r.studentIds.length, 0)

    setMetrics({
      ...metrics,
      rooms: updatedRooms,
      unassignedStudents: unassignedCount,
    })
  }

  const studentsReady = !loading && students.length > 0

  const renderGenderSection = (
    gender: string,
    metrics: Metrics | null,
    roomCounts: { [key: number]: number },
    genderStudents: Student[]
  ) => {
    const totalSpots = Object.entries(roomCounts).reduce(
      (total, [size, count]) => total + parseInt(size) * count,
      0
    )

    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-4 capitalize">{gender} Students</h2>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 mb-6">
          <h3 className="text-lg font-semibold text-blue-700 mb-4">Configure Rooms</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[5, 4, 3, 2].map((size) => (
              <div key={size} className="flex flex-col">
                <label className="text-sm font-medium text-black mb-1">Size {size} Rooms</label>
                <input
                  type="number"
                  min="0"
                  value={roomCounts[size]}
                  onChange={(e) => handleRoomCountChange(gender, size, parseInt(e.target.value))}
                  className="p-3 border border-gray-300 text-black rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Total Spots: <span className="font-bold text-blue-600">{totalSpots}</span>
            {' / '}
            {gender} Students:{' '}
            <span className="font-bold text-gray-800">{genderStudents.length}</span>
          </p>
        </div>

        {metrics && (
          <div>
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500 mb-6">
              <h3 className="text-lg font-bold text-gray-700 mb-3">Satisfaction Scorecard</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs font-medium text-blue-500 uppercase">Preferences Met</p>
                  <p className="text-2xl font-extrabold text-blue-800">
                    {metrics.totalPreferencesSatisfied}
                  </p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <p className="text-xs font-medium text-indigo-500 uppercase">
                    Mutual Preferences
                  </p>
                  <p className="text-2xl font-extrabold text-indigo-800">
                    {metrics.totalMutualPreferencesSatisfied}
                  </p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-xs font-medium text-red-500 uppercase">Unassigned</p>
                  <p className="text-2xl font-extrabold text-red-800">
                    {metrics.unassignedStudents}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-xs font-medium text-green-500 uppercase">Rooms Used</p>
                  <p className="text-2xl font-extrabold text-green-800">{metrics.totalRooms}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {metrics.rooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white p-5 rounded-xl shadow-md border-2 border-gray-200"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(room.id, gender)}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-lg font-bold text-gray-800">
                      Room {room.id} ({room.studentIds.length}/{room.capacity})
                    </h4>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Cohesion: {room.satisfactionScore}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {room.studentIds.map((id) => {
                      const student = studentMap.get(id)
                      if (!student) return null

                      const satisfiedCount = student.preferences.filter((prefId) =>
                        room.studentIds.includes(prefId)
                      ).length

                      return (
                        <li
                          key={id}
                          draggable
                          onDragStart={() => handleDragStart(id, room.id, gender)}
                          className="flex justify-between items-center p-2 bg-gray-50 rounded-lg text-sm text-gray-700 cursor-move hover:bg-gray-100"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{getStudentName(id)}</span>
                            <span
                              className={`px-2 py-0.5 text-xs font-semibold rounded ${
                                satisfiedCount === 3
                                  ? 'bg-green-200 text-green-800'
                                  : satisfiedCount === 2
                                    ? 'bg-blue-200 text-blue-800'
                                    : satisfiedCount === 1
                                      ? 'bg-yellow-200 text-yellow-800'
                                      : 'bg-gray-200 text-gray-800'
                              }`}
                            >
                              {satisfiedCount}/3
                            </span>
                          </div>
                          <button
                            onClick={() => removeFromRoom(id, room.id, gender)}
                            className="text-red-500 hover:text-red-700 text-xs font-bold"
                          >
                            Remove
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>

            {metrics.unassignedStudents > 0 && (
              <div className="mt-6 p-5 bg-red-100 rounded-xl shadow-md">
                <h4 className="text-lg font-bold text-red-800 mb-2">
                  Unassigned Students ({metrics.unassignedStudents})
                </h4>
                <div className="space-y-2">
                  {genderStudents
                    .filter((s) => !metrics.rooms.some((r) => r.studentIds.includes(s.id)))
                    .map((s) => (
                      <div
                        key={s.id}
                        draggable
                        onDragStart={() => handleDragStart(s.id, null, gender)}
                        className="inline-block mr-2 p-2 bg-white rounded-lg text-sm cursor-move hover:bg-gray-50"
                      >
                        {s.name}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-50 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-2">Room Assignment Optimizer</h1>
        <p className="text-gray-600 mb-8">
          Optimizing room assignments for Tour ID: {tourId}. Total students: {students.length} (
          {maleStudents.length} male, {femaleStudents.length} female)
        </p>

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
            <button
              onClick={runOptimization}
              className="w-full p-4 rounded-xl text-white font-bold text-lg transition duration-200 shadow-md bg-blue-600 hover:bg-blue-700 hover:shadow-xl mb-8"
            >
              Run Room Assignment Optimization
            </button>

            {renderGenderSection('male', maleMetrics, maleRoomCounts, maleStudents)}
            {renderGenderSection('female', femaleMetrics, femaleRoomCounts, femaleStudents)}
          </>
        )}
      </div>
    </div>
  )
}

export default RoomAssignmentOptimizer
