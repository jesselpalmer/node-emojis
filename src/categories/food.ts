// Backward compatibility export for food category
import categoriesData from '../data/categories.json'
import emojiData from '../data/emojis.json'

// Create an object with just food emojis
const foodEmojis: Record<string, string> = {}
const foodNames = categoriesData.food || []

foodNames.forEach((name: string) => {
  if (emojiData[name as keyof typeof emojiData]) {
    foodEmojis[name] = emojiData[name as keyof typeof emojiData]
  }
})

export = foodEmojis