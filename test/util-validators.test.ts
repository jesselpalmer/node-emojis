import { expect } from 'chai'
import {
  isValidEmoji,
  isValidEmojiName,
  hasVariationSelector,
  stripVariationSelectors
} from '../lib/utils/validators'

describe('validators utility', () => {
  describe('isValidEmoji function', () => {
    it('should validate single emojis', () => {
      expect(isValidEmoji('🔥')).to.be.true
      expect(isValidEmoji('😀')).to.be.true
      expect(isValidEmoji('👍')).to.be.true
    })

    it('should validate emojis with variation selectors', () => {
      expect(isValidEmoji('❤️')).to.be.true
      expect(isValidEmoji('☺️')).to.be.true
    })

    it('should validate emojis with skin tones', () => {
      expect(isValidEmoji('👋🏻')).to.be.true
      expect(isValidEmoji('👍🏿')).to.be.true
    })

    it('should validate complex emojis', () => {
      expect(isValidEmoji('👨‍👩‍👧‍👦')).to.be.true // Family
      expect(isValidEmoji('🏳️‍🌈')).to.be.true // Rainbow flag
    })

    it('should reject non-emoji strings', () => {
      expect(isValidEmoji('hello')).to.be.false
      expect(isValidEmoji('123')).to.be.false
      expect(isValidEmoji('abc')).to.be.false
    })

    it('should reject empty strings', () => {
      expect(isValidEmoji('')).to.be.false
    })

    it('should reject strings with emojis and text', () => {
      expect(isValidEmoji('hello 🔥')).to.be.false
      expect(isValidEmoji('🔥 fire')).to.be.false
    })
  })

  describe('isValidEmojiName function', () => {
    it('should validate proper emoji names', () => {
      expect(isValidEmojiName('fire')).to.be.true
      expect(isValidEmojiName('smiling_face')).to.be.true
      expect(isValidEmojiName('thumbs_up')).to.be.true
    })

    it('should validate names with numbers', () => {
      expect(isValidEmojiName('keycap_1')).to.be.true
      expect(isValidEmojiName('clock12')).to.be.true
    })

    it('should reject names with spaces', () => {
      expect(isValidEmojiName('smiling face')).to.be.false
      expect(isValidEmojiName('fire ')).to.be.false
    })

    it('should reject names with special characters', () => {
      expect(isValidEmojiName('fire!')).to.be.false
      expect(isValidEmojiName('cat@')).to.be.false
      expect(isValidEmojiName('pizza#')).to.be.false
    })

    it('should reject empty names', () => {
      expect(isValidEmojiName('')).to.be.false
    })

    it('should accept names with hyphens', () => {
      expect(isValidEmojiName('medium-light')).to.be.true
      expect(isValidEmojiName('face-with-tears')).to.be.true
    })
  })

  describe('hasVariationSelector function', () => {
    it('should detect variation selectors', () => {
      expect(hasVariationSelector('❤️')).to.be.true
      expect(hasVariationSelector('☺️')).to.be.true
      expect(hasVariationSelector('✌️')).to.be.true
    })

    it('should return false for emojis without variation selectors', () => {
      expect(hasVariationSelector('🔥')).to.be.false
      expect(hasVariationSelector('😀')).to.be.false
      expect(hasVariationSelector('🐈')).to.be.false
    })

    it('should handle complex emojis', () => {
      expect(hasVariationSelector('🏳️‍🌈')).to.be.true
      expect(hasVariationSelector('👨‍👩‍👧‍👦')).to.be.false
    })
  })

  describe('stripVariationSelectors function', () => {
    it('should remove variation selectors', () => {
      expect(stripVariationSelectors('❤️')).to.equal('❤')
      expect(stripVariationSelectors('☺️')).to.equal('☺')
      expect(stripVariationSelectors('✌️')).to.equal('✌')
    })

    it('should not modify emojis without variation selectors', () => {
      expect(stripVariationSelectors('🔥')).to.equal('🔥')
      expect(stripVariationSelectors('😀')).to.equal('😀')
    })

    it('should handle complex cases', () => {
      expect(stripVariationSelectors('🏳️‍🌈')).to.equal('🏳‍🌈')
      expect(stripVariationSelectors('multiple ❤️ hearts ☺️')).to.equal('multiple ❤ hearts ☺')
    })

    it('should handle empty strings', () => {
      expect(stripVariationSelectors('')).to.equal('')
    })
  })
})
