import { boardToProject, sanitizeInput } from './Superbase.js'
const urlParams=new URLSearchParams(window.location.search)
const boardId=Number(urlParams.get('boardId'))
const boardName=sanitizeInput(urlParams.get('boardName'))
document.getElementById('boardName').textContent=boardName
const supabase=boardToProject(boardId)

let currentPage=0, pageSize=10, loading=false, searchQuery=''

async function loadThreads(reset=false){
  if(loading) return; loading=true
  if(reset) currentPage=0; if(reset) document.getElementById('threadsList').innerHTML=''
  const from=currentPage*pageSize, to=from+pageSize-1
  let query=supabase.from('threads').select('*').eq('board_id',boardId).order('id',{ascending:false}).range(from,to)
  if(searchQuery) query=query.ilike('title',`%${searchQuery}%`)
  const {data: threads}=await query
  threads.forEach(thread=>{
    const tdiv=document.createElement('div')
    tdiv.innerHTML=`[${thread.id}] ${sanitizeInput(thread.title)}`
    tdiv.style.cursor='pointer'
    tdiv.onclick=()=>window.location=`posts.html?boardId=${boardId}&threadId=${thread.id}&threadName=${encodeURIComponent(thread.title)}`
    document.getElementById('threadsList').appendChild(tdiv)
  })
  currentPage++; loading=false
}

// 検索
const searchInput=document.createElement('input')
searchInput.placeholder='スレッド検索'; searchInput.style.width='200px'
searchInput.addEventListener('keyup',()=>{searchQuery=searchInput.value.trim(); loadThreads(true)})
document.body.insertBefore(searchInput, document.getElementById('threadsList'))

// 無限スクロール
window.addEventListener('scroll',()=>{if(window.innerHeight+window.scrollY>=document.body.offsetHeight-50){loadThreads()}})

// 新規スレッド作成
document.getElementById('createThreadBtn').addEventListener('click',()=>{document.getElementById('newThreadSection').style.display='block'})
document.getElementById('cancelThreadBtn').addEventListener('click',()=>{document.getElementById('newThreadSection').style.display='none'})
document.getElementById('submitThreadBtn').addEventListener('click',async()=>{
  const title=sanitizeInput(document.getElementById('newThreadTitle').value)
  const content=sanitizeInput(document.getElementById('newThreadContent').value)
  const name=sanitizeInput(document.getElementById('newThreadName').value||'名無し')
  if(!title||!content) return alert('タイトルと本文は必須です')
  const {data: thread}=await supabase.from('threads').insert([{board_id:boardId,title}]).select().single()
  await supabase.from('posts').insert([{thread_id:thread.id, board_id:boardId, content, name}])
  document.getElementById('newThreadTitle').value=''; document.getElementById('newThreadContent').value=''; document.getElementById('newThreadName').value=''; document.getElementById('newThreadSection').style.display='none'
  loadThreads()
})

window.onload=loadThreads
