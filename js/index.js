import { projects, sanitizeInput } from './Superbase.js'

const popularBoardsDiv = document.getElementById('popularBoards')
const popularThreadsDiv = document.getElementById('popularThreads')
const latestPostsDiv = document.getElementById('latestPosts')

// ------------------ 人気板取得 ------------------
async function loadPopularBoards(){
  popularBoardsDiv.innerHTML = ''
  for(const supabase of projects){
    const { data: boards } = await supabase.from('boards').select('*').limit(5).order('id',{ascending:false})
    boards.forEach(board=>{
      const div = document.createElement('div')
      div.textContent = sanitizeInput(board.name)
      div.style.cursor='pointer'
      div.onclick = ()=>window.location=`threads.html?boardId=${board.id}&boardName=${encodeURIComponent(board.name)}`
      popularBoardsDiv.appendChild(div)
    })
  }
}

// ------------------ 人気スレ取得 ------------------
async function loadPopularThreads(){
  popularThreadsDiv.innerHTML = ''
  for(const supabase of projects){
    const { data: threads } = await supabase.from('threads').select('*').limit(5).order('id',{ascending:false})
    threads.forEach(thread=>{
      const div = document.createElement('div')
      div.textContent = sanitizeInput(thread.title)
      div.style.cursor='pointer'
      div.onclick = ()=>window.location=`posts.html?boardId=${thread.board_id}&threadId=${thread.id}&threadName=${encodeURIComponent(thread.title)}`
      popularThreadsDiv.appendChild(div)
    })
  }
}

// ------------------ 最新投稿取得 ------------------
async function loadLatestPosts(){
  latestPostsDiv.innerHTML = ''
  for(const supabase of projects){
    const { data: posts } = await supabase.from('posts').select('*').limit(5).order('created_at',{ascending:false})
    posts.forEach(post=>{
      const div = document.createElement('div')
      div.innerHTML = `<b>${sanitizeInput(post.name||'名無し')}</b>: ${sanitizeInput(post.content)}`
      latestPostsDiv.appendChild(div)
    })
  }
}

// ------------------ 利用規約表示 ------------------
function loadTerms(){
  // 利用規約は index.html に固定HTMLなので不要
}

// ------------------ リアルタイム更新 ------------------
function setupRealtime(){
  for(const supabase of projects){
    supabase
      .from('threads')
      .on('INSERT', payload => loadPopularThreads())
      .subscribe()
    supabase
      .from('posts')
      .on('INSERT', payload => { loadLatestPosts(); loadPopularThreads(); })
      .subscribe()
  }
}

// ------------------ 初期読み込み ------------------
window.onload = ()=>{
  loadPopularBoards()
  loadPopularThreads()
  loadLatestPosts()
  setupRealtime()
  loadTerms()
}
