import { mapImgUrl } from '@/lib/db/notion/mapImage'

describe('mapImgUrl', () => {
  test.each([
    'https://prod-files-secure.s3.us-west-2.amazonaws.com/image.png',
    'https://example.com/image.png?width=640',
    '/images/page-cover/solid_beige.png',
    'attachment:image.png'
  ])('keeps the original image URL: %s', imageUrl => {
    expect(mapImgUrl(imageUrl, { id: 'block-id' })).toBe(imageUrl)
  })

  test.each([null, undefined, ''])(
    'returns null for an empty image URL',
    imageUrl => {
      expect(mapImgUrl(imageUrl)).toBeNull()
    }
  )
})
