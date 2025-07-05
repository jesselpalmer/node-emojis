import { expect } from 'chai'
import emojis from '../lib'

describe('skin tone support', () => {
  it('should have skin tone functions', () => {
    expect(emojis).to.have.property('applySkinTone')
    expect(emojis).to.have.property('supportsSkinTone')
    expect(emojis).to.have.property('getAllSkinToneVariations')
    expect(emojis).to.have.property('removeSkinTone')
    expect(emojis).to.have.property('skinTones')
    expect(emojis).to.have.property('skinToneModifiers')
  })

  describe('applySkinTone', () => {
    it('should apply skin tone modifiers correctly', () => {
      const waveEmoji = emojis.wave || emojis.waving_hand

      // Test all skin tone modifiers
      expect(emojis.applySkinTone(waveEmoji, 'light')).to.equal('👋🏻')
      expect(emojis.applySkinTone(waveEmoji, 'medium-light')).to.equal('👋🏼')
      expect(emojis.applySkinTone(waveEmoji, 'medium')).to.equal('👋🏽')
      expect(emojis.applySkinTone(waveEmoji, 'medium-dark')).to.equal('👋🏾')
      expect(emojis.applySkinTone(waveEmoji, 'dark')).to.equal('👋🏿')
    })

    it('should accept numeric skin tone aliases', () => {
      const waveEmoji = emojis.wave || emojis.waving_hand

      expect(emojis.applySkinTone(waveEmoji, '1')).to.equal('👋🏻')
      expect(emojis.applySkinTone(waveEmoji, '2')).to.equal('👋🏼')
      expect(emojis.applySkinTone(waveEmoji, '3')).to.equal('👋🏽')
      expect(emojis.applySkinTone(waveEmoji, '4')).to.equal('👋🏾')
      expect(emojis.applySkinTone(waveEmoji, '5')).to.equal('👋🏿')
    })

    it('should throw error for invalid skin tone', () => {
      const waveEmoji = emojis.wave || emojis.waving_hand

      expect(() => emojis.applySkinTone(waveEmoji, 'invalid')).to.throw('Invalid skin tone')
    })

    it('should handle emojis with variation selectors', () => {
      // Test with an emoji that might have variation selectors
      const emoji = '✋️' // Hand with variation selector
      const result = emojis.applySkinTone(emoji, 'medium')
      expect(result).to.equal('✋🏽')
    })
  })

  describe('supportsSkinTone', () => {
    it('should correctly identify skin tone capable emojis', () => {
      // These should support skin tones
      expect(emojis.supportsSkinTone('wave')).to.equal(true)
      expect(emojis.supportsSkinTone('thumbs_up')).to.equal(true)
      expect(emojis.supportsSkinTone('muscle')).to.equal(true)
      expect(emojis.supportsSkinTone('baby')).to.equal(true)
      expect(emojis.supportsSkinTone('man')).to.equal(true)
      expect(emojis.supportsSkinTone('woman')).to.equal(true)
    })

    it('should correctly identify non-skin tone capable emojis', () => {
      // These should NOT support skin tones
      expect(emojis.supportsSkinTone('fire')).to.equal(false)
      expect(emojis.supportsSkinTone('pizza')).to.equal(false)
      expect(emojis.supportsSkinTone('smile')).to.equal(false)
      expect(emojis.supportsSkinTone('heart')).to.equal(false)
      expect(emojis.supportsSkinTone('dog')).to.equal(false)
    })

    it('should handle aliases correctly', () => {
      // Test that aliases are recognized
      expect(emojis.supportsSkinTone('waving_hand')).to.equal(true)
      expect(emojis.supportsSkinTone('thumbsup')).to.equal(true)
      expect(emojis.supportsSkinTone('+1')).to.equal(true)
    })
  })

  describe('getAllSkinToneVariations', () => {
    it('should return all skin tone variations', () => {
      const waveEmoji = emojis.wave || emojis.waving_hand
      const variations = emojis.getAllSkinToneVariations(waveEmoji)

      expect(variations).to.be.an('object')
      expect(variations).to.have.property('default', waveEmoji)
      expect(variations).to.have.property('light', '👋🏻')
      expect(variations).to.have.property('medium-light', '👋🏼')
      expect(variations).to.have.property('medium', '👋🏽')
      expect(variations).to.have.property('medium-dark', '👋🏾')
      expect(variations).to.have.property('dark', '👋🏿')
    })

    it('should work with different emojis', () => {
      const thumbsUp = emojis.thumbs_up || emojis.thumbsup || emojis['+1']
      const variations = emojis.getAllSkinToneVariations(thumbsUp)

      expect(variations.default).to.equal(thumbsUp)
      expect(variations.light).to.equal('👍🏻')
      expect(variations.dark).to.equal('👍🏿')
    })
  })

  describe('removeSkinTone', () => {
    it('should remove skin tone modifiers', () => {
      expect(emojis.removeSkinTone('👋🏻')).to.equal('👋')
      expect(emojis.removeSkinTone('👋🏼')).to.equal('👋')
      expect(emojis.removeSkinTone('👋🏽')).to.equal('👋')
      expect(emojis.removeSkinTone('👋🏾')).to.equal('👋')
      expect(emojis.removeSkinTone('👋🏿')).to.equal('👋')
    })

    it('should handle emojis without skin tones', () => {
      expect(emojis.removeSkinTone('👋')).to.equal('👋')
      expect(emojis.removeSkinTone('🔥')).to.equal('🔥')
      expect(emojis.removeSkinTone('🍕')).to.equal('🍕')
    })

    it('should handle multiple skin tone modifiers', () => {
      // Some emojis like handshake can have multiple skin tones
      const handshakeWithTones = '🤝🏻🏿'
      expect(emojis.removeSkinTone(handshakeWithTones)).to.equal('🤝')
    })
  })

  describe('skin tone constants', () => {
    it('should have correct skin tone modifiers', () => {
      expect(emojis.skinToneModifiers).to.be.an('object')
      expect(emojis.skinToneModifiers.light).to.equal('\u{1F3FB}')
      expect(emojis.skinToneModifiers['medium-light']).to.equal('\u{1F3FC}')
      expect(emojis.skinToneModifiers.medium).to.equal('\u{1F3FD}')
      expect(emojis.skinToneModifiers['medium-dark']).to.equal('\u{1F3FE}')
      expect(emojis.skinToneModifiers.dark).to.equal('\u{1F3FF}')
    })

    it('should have correct skin tone aliases', () => {
      expect(emojis.skinTones).to.be.an('object')
      expect(emojis.skinTones['1']).to.equal('\u{1F3FB}')
      expect(emojis.skinTones['2']).to.equal('\u{1F3FC}')
      expect(emojis.skinTones['3']).to.equal('\u{1F3FD}')
      expect(emojis.skinTones['4']).to.equal('\u{1F3FE}')
      expect(emojis.skinTones['5']).to.equal('\u{1F3FF}')

      // Should also include named versions
      expect(emojis.skinTones.light).to.equal('\u{1F3FB}')
      expect(emojis.skinTones.dark).to.equal('\u{1F3FF}')
    })
  })

  describe('integration with emoji lookup', () => {
    it('should be able to apply skin tones to looked up emojis', () => {
      // Get an emoji and apply skin tone
      const waveEmoji = emojis.wave || emojis.waving_hand
      const darkWave = emojis.applySkinTone(waveEmoji, 'dark')

      expect(darkWave).to.equal('👋🏿')
    })

    it('should work with search results', () => {
      // Search for an emoji that supports skin tones
      const results = emojis.searchByKeyword('wave')
      const waveResult = results.find(r => r.name === 'wave' || r.name === 'waving_hand')

      expect(waveResult).to.exist
      const withSkinTone = emojis.applySkinTone(waveResult!.emoji, 'medium')
      expect(withSkinTone).to.equal('👋🏽')
    })
  })
})
