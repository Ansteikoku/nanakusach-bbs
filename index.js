import { projects, boardToProject, sanitizeInput } from './Superbase.js'

async function loadPopularBoards(){
  const div = document.getElementById('popularBoards')
  div.innerHTML = ''
  for(let supabase of projects){
    const { data: boards } = await supabase.from('boards').select('*')
    boards.forEach(board=>{
      const card = document.createElement('div')
      card.textContent = sanitizeInput(board.name)
      card.onclick = () => window.location = `threads.html?boardId=${board.id}&boardName=${encodeURIComponent(board.name)}`
      div.appendChild(card)
    })
  }
}

async function loadPopularThreads(){
  const div = document.getElementById('popularThreads')
  div.innerHTML = ''
  let allThreads = []
  for(let supabase of projects){
    const { data: threads } = await supabase.from('threads').select('*')
    for(let thread of threads){
      const { data: posts } = await supabase.from('posts').select('id').eq('thread_id', thread.id)
      thread.popularity = posts.length
    }
    allThreads = allThreads.concat(threads)
  }
  allThreads.sort((a,b) => b.popularity - a.popularity)
  allThreads.slice(0,10).forEach(thread=>{
    const tdiv = document.createElement('div')
    tdiv.innerHTML = `[${thread.id}] ${sanitizeInput(thread.title)} (${thread.popularity}レス)`
    tdiv.onclick = () => window.location = `posts.html?boardId=${thread.board_id}&threadId=${thread.id}&threadName=${encodeURIComponent(thread.title)}`
    div.appendChild(tdiv)
  })
}

async function loadLatestPosts(){
  const div = document.getElementById('latestPosts')
  div.innerHTML = ''
  let allPosts = []
  for(let supabase of projects){
    const { data: posts } = await supabase.from('posts').select('*').order('id',{ascending:false}).limit(10)
    allPosts = allPosts.concat(posts)
  }
  allPosts.sort((a,b)=>b.id-a.id)
  allPosts.forEach(post=>{
    const pdiv = document.createElement('div')
    pdiv.innerHTML = `${sanitizeInput(post.name||'名無し')}: ${sanitizeInput(post.content)}`
    pdiv.style.cursor = 'pointer'
    pdiv.onclick = ()=> window.location=`posts.html?boardId=${post.board_id}&threadId=${post.thread_id}&threadName=人気スレッド`
    div.appendChild(pdiv)
  })
}

function setupRealtime(){
  for(let supabase of projects){
    supabase.from('posts').on('INSERT',()=>loadLatestPosts()).subscribe()
    supabase.from('threads').on('INSERT',()=>loadPopularThreads()).subscribe()
  }
}

window.onload = ()=>{
  loadPopularBoards()
  loadPopularThreads()
  loadLatestPosts()
  setupRealtime()
}
