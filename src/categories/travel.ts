// Backward compatibility export for travel category
import categoriesData from '../data/categories.json'
import emojiData from '../data/emojis.json'

// Create an object with just travel emojis
const travelEmojis: Record<string, string> = {}
const travelNames = categoriesData.travel || []

travelNames.forEach((name: string) => {
  if (emojiData[name as keyof typeof emojiData]) {
    travelEmojis[name] = emojiData[name as keyof typeof emojiData]
  }
})

export = travelEmojis