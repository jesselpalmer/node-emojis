// Backward compatibility export for animals category
import categoriesData from '../data/categories.json'
import emojiData from '../data/emojis.json'

// Create an object with just animal emojis
const animalEmojis: Record<string, string> = {}
const animalNames = categoriesData.animals || []

animalNames.forEach((name: string) => {
  if (emojiData[name as keyof typeof emojiData]) {
    animalEmojis[name] = emojiData[name as keyof typeof emojiData]
  }
})

export = animalEmojis