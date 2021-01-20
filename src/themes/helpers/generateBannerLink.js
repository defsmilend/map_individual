export default function generateBannerLink (slide) {
  let name = ''
  let query = null
  let isEventId = !!slide.event_id
  let isOfferId = !!slide.offer_id

  if (slide.link_type === 'web') {
    if (isEventId) {
      name = 'event'
      query = { id: slide.event_id }
    }
    if (isOfferId) {
      name = 'offer'
      query = { id: slide.offer_id }
    }
  } else if (slide.isActiveLink) {
    name = slide.link_type
  }

  return {
    name,
    query
  }
}
