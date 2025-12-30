import { projects, sanitizeInput } from './Superbase.js'

let currentPage = 0
const pageSize = 10
let loading = false
let searchQuery = ''

const div = document.getElementById('boardsList')

// 検索入力
const searchInput = document.createElement('input')
searchInput.placeholder = '板検索'
searchInput.style.width = '200px'
searchInput.addEventListener('keyup', ()=>{
  searchQuery = searchInput.value.trim()
  loadBoards(true)
})
document.body.insertBefore(searchInput, div)

// 板取得
async function loadBoards(reset=false){
  if(loading) return
  loading = true
  if(reset) currentPage = 0
  if(reset) div.innerHTML = ''

  const from = currentPage * pageSize
  const to = from + pageSize - 1

  let allBoards = []
  for(let supabase of projects){
    let query = supabase.from('boards').select('*').order('id',{ascending:true}).range(from,to)
    if(searchQuery) query = query.ilike('name', `%${searchQuery}%`)
    const { data: boards } = await query
    allBoards = allBoards.concat(boards)
  }

  allBoards.forEach(board=>{
    const bdiv = document.createElement('div')
    bdiv.textContent = sanitizeInput(board.name)
    bdiv.style.cursor = 'pointer'
    bdiv.onclick = () => window.location = `threads.html?boardId=${board.id}&boardName=${encodeURIComponent(board.name)}`
    div.appendChild(bdiv)
  })
  currentPage++
  loading = false
}

// 無限スクロール
window.addEventListener('scroll', ()=>{
  if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 50){
    loadBoards()
  }
})

window.onload = loadBoards
