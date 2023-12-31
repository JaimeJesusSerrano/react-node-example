import exerciseRepository from '../repositories/Exercise'
import IApiExercise, { ExerciseToCreate as IApiExerciseToCreate } from '../../types/api/Exercise'

const MAX_EXERCISES_PER_USER = 10

export const create = async (data: IApiExerciseToCreate): Promise<boolean | null> => {
  try {
    if (await isNewExerciseValid(data)) {
      return exerciseRepository.create(data)
    }
    return false
  } catch (e) {
    return false
  }
}

export const getAll = async (): Promise<IApiExercise[]> => {
  try {
    const exercisesJoinUser = await exerciseRepository.getAllJoinUser()

    return exercisesJoinUser.map((exerciseJoinUser) => {
      const {name, created_at, ...exercise} = exerciseJoinUser
  
      return {
        ...exercise,
        created_at: new Date(created_at).toISOString(),
        user: {
          name,
        }
      }
    })
  } catch (e) {
    return []
  }
}

const isNewExerciseValid = async (data: IApiExerciseToCreate) => {
  const exercises = await exerciseRepository.getAll()

  const userExercises = exercises.map((exercise => exercise.user_id === data.user_id))
  if (userExercises.length >= MAX_EXERCISES_PER_USER) {
    return false
  }

  return true
}

export default { create, getAll }
