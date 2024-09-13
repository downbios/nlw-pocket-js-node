import { client, db } from '.'
import { goals, goalsCompletions } from './schema'
import dayjs from 'dayjs'

async function seed() {
  await db.delete(goalsCompletions)
  await db.delete(goals)

  const result = await db
    .insert(goals)
    .values([
      { title: 'Acordar cedo', desiredWeeklyFrequency: 5 },
      { title: 'Estudar', desiredWeeklyFrequency: 3 },
      { title: 'Lazer', desiredWeeklyFrequency: 1 },
    ])
    .returning()

  const startOfweek = dayjs().startOf('week')

  await db.insert(goalsCompletions).values([
    { goalId: result[0].id, createdAt: startOfweek.toDate() },
    { goalId: result[1].id, createdAt: startOfweek.add(1, 'day').toDate() },
  ])
}

seed().finally(() => {
  client.end()
})
