import { expect } from 'chai'
import {
  applySkinTone,
  supportsSkinTone,
  getAllSkinToneVariations,
  removeSkinTone
} from '../lib/features/skin-tones'

describe('skin-tones feature module', () => {
  describe('applySkinTone function', () => {
    it('should apply skin tone to emoji', () => {
      const waveLight = applySkinTone('👋', 'light')
      expect(waveLight).to.equal('👋🏻')

      const waveDark = applySkinTone('👋', 'dark')
      expect(waveDark).to.equal('👋🏿')
    })

    it('should accept numeric tone aliases', () => {
      const wave1 = applySkinTone('👋', '1')
      expect(wave1).to.equal('👋🏻')

      const wave5 = applySkinTone('👋', '5')
      expect(wave5).to.equal('👋🏿')
    })

    it('should replace existing skin tone', () => {
      const waveLight = applySkinTone('👋🏿', 'light')
      expect(waveLight).to.equal('👋🏻')
    })

    it('should throw error for invalid tone', () => {
      expect(() => applySkinTone('👋', 'invalid' as any)).to.throw('Invalid skin tone')
      expect(() => applySkinTone('👋', '6' as any)).to.throw('Invalid skin tone')
    })
  })

  describe('supportsSkinTone function', () => {
    it('should return true for skin tone capable emojis', () => {
      expect(supportsSkinTone('wave')).to.be.true
      expect(supportsSkinTone('thumbs_up')).to.be.true
      expect(supportsSkinTone('ok_hand')).to.be.true
    })

    it('should return false for non-skin tone capable emojis', () => {
      expect(supportsSkinTone('fire')).to.be.false
      expect(supportsSkinTone('cat')).to.be.false
      expect(supportsSkinTone('pizza')).to.be.false
    })

    it('should work with emoji characters', () => {
      expect(supportsSkinTone('👋')).to.be.true
      expect(supportsSkinTone('🔥')).to.be.false
    })

    it('should handle aliases', () => {
      expect(supportsSkinTone('waving_hand')).to.be.true
      expect(supportsSkinTone('thumbsup')).to.be.true
    })
  })

  describe('getAllSkinToneVariations function', () => {
    it('should return all variations including default', () => {
      const variations = getAllSkinToneVariations('👋')

      expect(variations).to.be.an('object')
      expect(variations).to.have.property('default', '👋')
      expect(variations).to.have.property('light', '👋🏻')
      expect(variations).to.have.property('medium-light', '👋🏼')
      expect(variations).to.have.property('medium', '👋🏽')
      expect(variations).to.have.property('medium-dark', '👋🏾')
      expect(variations).to.have.property('dark', '👋🏿')
    })

    it('should work with emoji that already has skin tone', () => {
      const variations = getAllSkinToneVariations('👋🏻')

      expect(variations.default).to.equal('👋')
      expect(variations.light).to.equal('👋🏻')
      expect(variations.dark).to.equal('👋🏿')
    })
  })

  describe('removeSkinTone function', () => {
    it('should remove skin tone modifiers', () => {
      expect(removeSkinTone('👋🏻')).to.equal('👋')
      expect(removeSkinTone('👋🏿')).to.equal('👋')
    })

    it('should handle emoji without skin tone', () => {
      expect(removeSkinTone('👋')).to.equal('👋')
      expect(removeSkinTone('🔥')).to.equal('🔥')
    })

    it('should remove multiple skin tone modifiers', () => {
      // Some emojis can have multiple people with different skin tones
      const multiTone = '👨🏻‍🤝‍👨🏿'
      const result = removeSkinTone(multiTone)
      expect(result).to.not.include('🏻')
      expect(result).to.not.include('🏿')
    })
  })
})
