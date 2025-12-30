import { boardToProject, sanitizeInput } from './Superbase.js'

const urlParams = new URLSearchParams(window.location.search)
const boardId = Number(urlParams.get('boardId'))
const threadId = Number(urlParams.get('threadId'))
const threadName = sanitizeInput(urlParams.get('threadName'))
document.getElementById('threadName').textContent = threadName

const supabase = boardToProject(boardId)

let currentPage = 0
const pageSize = 10
let loading = false
let searchQuery = ''

async function loadPosts(reset=false){
  if(loading) return
  loading = true
  if(reset) currentPage = 0
  const div = document.getElementById('postsList')
  if(reset) div.innerHTML = ''

  const from = currentPage * pageSize
  const to = from + pageSize - 1

  let query = supabase.from('posts').select('*').eq('thread_id', threadId).order('id', { ascending:true }).range(from,to)
  if(searchQuery) query = query.or(`content.ilike.%${searchQuery}%,name.ilike.%${searchQuery}%`)
  const { data: posts } = await query

  posts.forEach(post=>{
    const pdiv = document.createElement('div')
    pdiv.style.borderBottom = '1px solid #ccc'
    pdiv.style.marginBottom = '5px'
    pdiv.innerHTML = `<b>${sanitizeInput(post.name||'名無し')}</b>: ${sanitizeInput(post.content)}`
    if(post.image_path){
      const img = document.createElement('img')
      img.src = `https://your-supabase-bucket.supabase.co/storage/v1/object/public/images/${encodeURIComponent(post.image_path)}`
      img.style.maxWidth = '200px'
      img.style.display = 'block'
      img.style.marginTop = '5px'
      pdiv.appendChild(img)
    }
    div.appendChild(pdiv)
  })
  currentPage++
  loading = false
}

// 無限スクロール
window.addEventListener('scroll', ()=>{
  if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 50){
    loadPosts()
  }
})

// 検索
const searchInput = document.createElement('input')
searchInput.placeholder = 'レス検索'
searchInput.style.width = '200px'
searchInput.addEventListener('keyup', ()=>{
  searchQuery = searchInput.value.trim()
  loadPosts(true)
})
document.body.insertBefore(searchInput, document.getElementById('postsList'))

// 画像付き投稿
document.getElementById('submitPostBtn').addEventListener('click', async ()=>{
  const content = sanitizeInput(document.getElementById('newPostContent').value)
  const name = sanitizeInput(document.getElementById('newPostName').value || '名無し')
  if(!content) return alert('本文は必須です')

  let image_path = null
  const fileInput = document.getElementById('newPostImage')
  if(fileInput.files.length > 0){
    const file = fileInput.files[0]
    const fileName = `${Date.now()}_${file.name}`
    const { data, error } = await supabase.storage.from('images').upload(fileName, file)
    if(error) return alert('画像アップロードに失敗しました')
    image_path = fileName
  }

  await supabase.from('posts').insert([{board_id:boardId, thread_id:threadId, content, name, image_path}])
  document.getElementById('newPostContent').value=''
  document.getElementById('newPostName').value=''
  fileInput.value = ''
  loadPosts(true)
})

window.onload = loadPosts
