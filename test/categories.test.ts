import { expect } from 'chai'
import emojis from '../lib'

// Direct category imports
import animalEmojis from '../lib/categories/animals'
import foodEmojis from '../lib/categories/food'
import natureEmojis from '../lib/categories/nature'
import peopleEmojis from '../lib/categories/people'
import travelEmojis from '../lib/categories/travel'

describe('categories', () => {
  describe('via main export', () => {
    it('should have categories property', () => {
      expect(emojis).to.have.property('categories')
      expect(emojis.categories).to.be.an('object')
    })

    it('should have all category properties', () => {
      expect(emojis.categories).to.have.property('animals')
      expect(emojis.categories).to.have.property('food')
      expect(emojis.categories).to.have.property('nature')
      expect(emojis.categories).to.have.property('people')
      expect(emojis.categories).to.have.property('travel')
    })

    it('should contain correct emojis in each category', () => {
      expect(emojis.categories.animals.cat).to.equal('🐈')
      expect(emojis.categories.food.pizza).to.equal('🍕')
      expect(emojis.categories.nature.fire).to.equal('🔥')
      expect(emojis.categories.people.smile).to.equal('😄')
      expect(emojis.categories.travel.mount_fuji).to.equal('🗻')
    })
  })

  describe('direct category imports', () => {
    it('should import animal emojis directly', () => {
      expect(animalEmojis).to.be.an('object')
      expect(animalEmojis.cat).to.equal('🐈')
      expect(animalEmojis.dog).to.equal('🐕')
    })

    it('should import food emojis directly', () => {
      expect(foodEmojis).to.be.an('object')
      expect(foodEmojis.pizza).to.equal('🍕')
      expect(foodEmojis.burger).to.equal('🍔')
    })

    it('should import nature emojis directly', () => {
      expect(natureEmojis).to.be.an('object')
      expect(natureEmojis.fire).to.equal('🔥')
      expect(natureEmojis.lit).to.equal('🔥')
    })

    it('should import people emojis directly', () => {
      expect(peopleEmojis).to.be.an('object')
      expect(peopleEmojis.smile).to.equal('😄')
      expect(peopleEmojis.heart).to.equal('❤️')
    })

    it('should import travel emojis directly', () => {
      expect(travelEmojis).to.be.an('object')
      expect(travelEmojis.mount_fuji).to.equal('🗻')
      expect(travelEmojis.snow_capped_mountain).to.equal('🗻')
    })
  })

  describe('category isolation', () => {
    it('should not contain emojis from other categories', () => {
      // Animals should not have food emojis
      expect(animalEmojis.pizza).to.equal(undefined)

      // Food should not have nature emojis
      expect(foodEmojis.fire).to.equal(undefined)

      // Nature should not have people emojis
      expect(natureEmojis.smile).to.equal(undefined)

      // People should not have travel emojis
      expect(peopleEmojis.mount_fuji).to.equal(undefined)

      // Travel should not have animal emojis
      expect(travelEmojis.cat).to.equal(undefined)
    })
  })
})
