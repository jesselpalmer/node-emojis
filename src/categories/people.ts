// Backward compatibility export for people category
import categoriesData from '../data/categories.json'
import emojiData from '../data/emojis.json'

// Create an object with just people emojis
const peopleEmojis: Record<string, string> = {}
const peopleNames = categoriesData.people || []

peopleNames.forEach((name: string) => {
  if (emojiData[name as keyof typeof emojiData]) {
    peopleEmojis[name] = emojiData[name as keyof typeof emojiData]
  }
})

export = peopleEmojis