// RoomAssignment.tsx
import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, type DropResult } from 'react-beautiful-dnd'
import { v4 as uuid } from 'uuid'

export interface Student {
  id: string
  name: string
  sex: 'male' | 'female'
  preferences?: string[] // list of other student IDs they'd like to room with
}

export interface RoomConfig {
  capacity: number
  count: number
}

interface Room {
  id: string
  capacity: number
  occupants: Student[]
  sex: 'male' | 'female'
}

interface RoomAssignmentProps {
  students: Student[]
  roomConfig: RoomConfig[]
}

const RoomAssignment: React.FC<RoomAssignmentProps> = ({ students, roomConfig }) => {
  const [rooms, setRooms] = useState<Room[]>([])
  const [unassigned, setUnassigned] = useState<Student[]>([])

  // on mount or whenever inputs change, compute initial layout
  useEffect(() => {
    const { initialRooms, leftovers } = assignRooms(students, roomConfig)
    setRooms(initialRooms)
    setUnassigned(leftovers)
  }, [students, roomConfig])

  function assignRooms(
    allStudents: Student[],
    configs: RoomConfig[]
  ): { initialRooms: Room[]; leftovers: Student[] } {
    // separate by sex
    const pools: Record<'male' | 'female', Student[]> = {
      male: allStudents.filter((s) => s.sex === 'male'),
      female: allStudents.filter((s) => s.sex === 'female'),
    }

    // expand and sort room capacities descending (fill big rooms first)
    const capacities = configs.flatMap((c) => Array(c.count).fill(c.capacity)).sort((a, b) => b - a)

    const initialRooms: Room[] = []

    capacities.forEach((cap) => {
      // pick which sex to fill this room with
      let sex: 'male' | 'female' = pools.male.length >= pools.female.length ? 'male' : 'female'
      // ensure at least 2 available; if not, try the other sex
      if (pools[sex].length < 2) {
        const other: 'male' | 'female' = sex === 'male' ? 'female' : 'male'
        if (pools[other].length >= 2) sex = other
        else return // neither pool can fill a new room
      }

      const pool = pools[sex]
      // pick a primary student
      const primary = pool.shift()!
      const group: Student[] = [primary]

      // honor one‐sided preferences if possible
      if (primary.preferences) {
        primary.preferences.forEach((prefId) => {
          if (group.length < cap) {
            const idx = pool.findIndex((s) => s.id === prefId)
            if (idx > -1) group.push(pool.splice(idx, 1)[0])
          }
        })
      }
      // fill with next available same‐sex students
      while (group.length < cap && pool.length > 0) {
        group.push(pool.shift()!)
      }
      // only keep rooms of size ≥2
      if (group.length >= 2) {
        initialRooms.push({
          id: uuid(),
          capacity: cap,
          occupants: group,
          sex,
        })
      } else {
        // couldn't fill without solo, return them to pool
        pool.unshift(...group)
      }
    })

    // anything left over goes into “unassigned”
    const leftovers = [...pools.male, ...pools.female]
    return { initialRooms, leftovers }
  }

  // handle drag & drop
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result
    if (!destination) return

    const srcId = source.droppableId
    const destId = destination.droppableId

    // helper to find & remove a student from rooms/unassigned
    let moved: Student | null = null
    if (srcId === 'unassigned') {
      const newUn = Array.from(unassigned)
      ;[moved] = newUn.splice(source.index, 1)
      setUnassigned(newUn)
    } else {
      const idx = rooms.findIndex((r) => r.id === srcId)
      if (idx > -1) {
        const newRooms = Array.from(rooms)
        const srcRoom = newRooms[idx]
        const occs = Array.from(srcRoom.occupants)
        ;[moved] = occs.splice(source.index, 1)
        newRooms[idx] = { ...srcRoom, occupants: occs }
        setRooms(newRooms)
      }
    }
    if (!moved) return

    // now insert into destination
    if (destId === 'unassigned') {
      const newUn = Array.from(unassigned)
      newUn.splice(destination.index, 0, moved)
      setUnassigned(newUn)
    } else {
      const idx = rooms.findIndex((r) => r.id === destId)
      if (idx > -1) {
        const newRooms = Array.from(rooms)
        const dstRoom = newRooms[idx]
        const occs = Array.from(dstRoom.occupants)
        occs.splice(destination.index, 0, moved)
        newRooms[idx] = { ...dstRoom, occupants: occs }
        setRooms(newRooms)
      }
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {rooms.map((room) => (
          <Droppable droppableId={room.id} key={room.id}>
            {(prov) => (
              <div
                ref={prov.innerRef}
                {...prov.droppableProps}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: 4,
                  padding: 8,
                  width: 180,
                  minHeight: 100,
                }}
              >
                <strong>
                  {room.sex.charAt(0).toUpperCase() + room.sex.slice(1)} Room (
                  {room.occupants.length}/{room.capacity})
                </strong>
                {room.occupants.map((stu, i) => (
                  <Draggable key={stu.id} draggableId={stu.id} index={i}>
                    {(p) => (
                      <div
                        ref={p.innerRef}
                        {...p.draggableProps}
                        {...p.dragHandleProps}
                        style={{
                          padding: 4,
                          margin: '4px 0',
                          background: '#f0f0f0',
                          borderRadius: 2,
                          ...p.draggableProps.style,
                        }}
                      >
                        {stu.name}
                      </div>
                    )}
                  </Draggable>
                ))}
                {prov.placeholder}
              </div>
            )}
          </Droppable>
        ))}

        {/* Unassigned Pool */}
        <Droppable droppableId="unassigned">
          {(prov) => (
            <div
              ref={prov.innerRef}
              {...prov.droppableProps}
              style={{
                border: '2px dashed #aaa',
                borderRadius: 4,
                padding: 8,
                width: 200,
                minHeight: 100,
              }}
            >
              <strong>Unassigned</strong>
              {unassigned.map((stu, i) => (
                <Draggable key={stu.id} draggableId={stu.id} index={i}>
                  {(p) => (
                    <div
                      ref={p.innerRef}
                      {...p.draggableProps}
                      {...p.dragHandleProps}
                      style={{
                        padding: 4,
                        margin: '4px 0',
                        background: '#fee',
                        borderRadius: 2,
                        ...p.draggableProps.style,
                      }}
                    >
                      {stu.name}
                    </div>
                  )}
                </Draggable>
              ))}
              {prov.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  )
}

export default RoomAssignment
