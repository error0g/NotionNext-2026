import BLOG from '@/blog.config'
import { siteConfig } from '../../config'

/**
 * 图片映射
 *
 * @param {*} img Notion 返回的图片地址
 * @returns 原始图片地址，不做代理转换、压缩或参数拼接
 */
const mapImgUrl = img => {
  if (!img) {
    return null
  }

  // 图片地址必须保持 Notion 返回的原值，避免代理转换和查询参数改变资源地址。
  return img
}

/**
 * 压缩图片
 * 1. Notion图床可以通过指定url-query参数来压缩裁剪图片 例如 ?xx=xx&width=400
 * 2. UnPlash 图片可以通过api q=50 控制压缩质量 width=400 控制图片尺寸
 * @param {*} image
 */
const compressImage = (image, width, quality = 50, fmt = 'webp') => {
  if (!image || image.indexOf('http') !== 0) {
    return image
  }

  if (image.includes(".svg")) return image

  if (!width || width === 0) {
    width = siteConfig('IMAGE_COMPRESS_WIDTH')
  }


  let urlObj
  let params
  try {
    urlObj = new URL(image)
    params = new URLSearchParams(urlObj.search)
  } catch (err) {
    // 如果解析失败，尝试 decodeURIComponent 再解析
    try {
      const decoded = decodeURIComponent(image)
      urlObj = new URL(decoded)
      params = new URLSearchParams(urlObj.search)
    } catch (e) {
      console.error('compressImage: Invalid URL:', image, err)
      return image
    }
  }
  
  // Notion图床
  if (
    image.indexOf(BLOG.NOTION_HOST) === 0 &&
    image.indexOf('amazonaws.com') > 0
  ) {
    params.set('width', width)
    params.set('cache', 'v2')
    // 生成新的URL
    urlObj.search = params.toString()
    return urlObj.toString()
  } else if (image.indexOf('https://images.unsplash.com/') === 0) {
    // 压缩unsplash图片
    // 将q参数的值替换
    params.set('q', quality)
    // 尺寸
    params.set('width', width)
    // 格式
    params.set('fmt', fmt)
    params.set('fm', fmt)
    // 生成新的URL
    urlObj.search = params.toString()
    return urlObj.toString()
  } else if (image.indexOf('https://your_picture_bed') === 0) {
    // 此处还可以添加您的自定义图传的封面图压缩参数。
    // .e.g
    return 'do_somethin_here'
  }

  return image
}

export { compressImage, mapImgUrl }
