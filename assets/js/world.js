// world.js — mounts the Living Knot hero (built from the private moss-hero repo into /hero/).
// The still image is the first paint and the fallback; the canvas fades in on its first frame.
const html = document.documentElement
const canvas = document.querySelector('.world-canvas')
const panel = document.getElementById('intro')
const world = document.querySelector('.world')

// the site bar appears once the hero has scrolled away
if (world && 'IntersectionObserver' in window) {
  new IntersectionObserver(([e]) => html.classList.toggle('past-world', !e.isIntersecting), { rootMargin: '-80px 0px 0px 0px' }).observe(world)
}

const params = new URLSearchParams(location.search)
if (canvas && !params.has('still')) {
  import('/hero/hero.js').then(({ mountHero }) => mountHero({
    canvas,
    panel,
    scene: params.get('hero') === 'ribbon' ? 'living-ribbon' : 'living-knot',
    onReady: () => html.classList.add('world-live'),
    onFail: () => html.classList.remove('world-live'),
  })).catch(() => html.classList.remove('world-live'))
}
