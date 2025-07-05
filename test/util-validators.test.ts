import { expect } from 'chai'
import {
  isValidEmoji,
  isValidEmojiName,
  hasVariationSelector,
  stripVariationSelectors,
  isValidSkinTone,
  sanitizeEmojiName
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

  describe('isValidSkinTone function', () => {
    it('should validate standard skin tone identifiers', () => {
      expect(isValidSkinTone('light')).to.be.true
      expect(isValidSkinTone('medium-light')).to.be.true
      expect(isValidSkinTone('medium')).to.be.true
      expect(isValidSkinTone('medium-dark')).to.be.true
      expect(isValidSkinTone('dark')).to.be.true
    })

    it('should validate numeric skin tone aliases', () => {
      expect(isValidSkinTone('1')).to.be.true
      expect(isValidSkinTone('2')).to.be.true
      expect(isValidSkinTone('3')).to.be.true
      expect(isValidSkinTone('4')).to.be.true
      expect(isValidSkinTone('5')).to.be.true
    })

    it('should reject invalid skin tone identifiers', () => {
      expect(isValidSkinTone('0')).to.be.false
      expect(isValidSkinTone('6')).to.be.false
      expect(isValidSkinTone('light-medium')).to.be.false
      expect(isValidSkinTone('very-dark')).to.be.false
      expect(isValidSkinTone('invalid')).to.be.false
      expect(isValidSkinTone('')).to.be.false
    })

    it('should be case-sensitive', () => {
      expect(isValidSkinTone('Light')).to.be.false
      expect(isValidSkinTone('DARK')).to.be.false
    })
  })

  describe('sanitizeEmojiName function', () => {
    it('should replace spaces with underscores', () => {
      expect(sanitizeEmojiName('smiling face')).to.equal('smiling_face')
      expect(sanitizeEmojiName('face with tears')).to.equal('face_with_tears')
    })

    it('should replace special characters with underscores', () => {
      expect(sanitizeEmojiName('fire!')).to.equal('fire_')
      expect(sanitizeEmojiName('cat@dog')).to.equal('cat_dog')
      expect(sanitizeEmojiName('pizza#1')).to.equal('pizza_1')
    })

    it('should handle multiple consecutive invalid characters', () => {
      expect(sanitizeEmojiName('hello   world')).to.equal('hello___world')
      expect(sanitizeEmojiName('test!!!name')).to.equal('test___name')
    })

    it('should handle leading and trailing invalid characters', () => {
      expect(sanitizeEmojiName(' fire ')).to.equal('_fire_')
      expect(sanitizeEmojiName('!emoji!')).to.equal('_emoji_')
      expect(sanitizeEmojiName('###test###')).to.equal('___test___')
    })

    it('should preserve valid characters', () => {
      expect(sanitizeEmojiName('valid_name_123')).to.equal('valid_name_123')
      expect(sanitizeEmojiName('camelCase')).to.equal('camelCase')
      expect(sanitizeEmojiName('kebab-case')).to.equal('kebab-case')
    })

    it('should handle empty strings', () => {
      expect(sanitizeEmojiName('')).to.equal('')
    })

    it('should handle strings with only invalid characters', () => {
      expect(sanitizeEmojiName('!!!')).to.equal('___')
      expect(sanitizeEmojiName('   ')).to.equal('___')
    })
  })
})
