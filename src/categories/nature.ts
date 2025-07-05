// Backward compatibility export for nature category
import categoriesData from '../data/categories.json'
import emojiData from '../data/emojis.json'

// Create an object with just nature emojis
const natureEmojis: Record<string, string> = {}
const natureNames = categoriesData.nature || []

natureNames.forEach((name: string) => {
  if (emojiData[name as keyof typeof emojiData]) {
    natureEmojis[name] = emojiData[name as keyof typeof emojiData]
  }
})

export = natureEmojis