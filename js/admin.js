import { adminSupabase, sanitizeInput } from './Superbase.js'

// ------------------ ログイン ------------------
if(document.getElementById('loginBtn')){
  document.getElementById('loginBtn').addEventListener('click', async ()=>{
    const email = document.getElementById('adminEmail').value
    const password = document.getElementById('adminPassword').value
    const { data, error } = await adminSupabase.auth.signInWithPassword({email,password})
    if(error) return alert('ログイン失敗: '+error.message)
    window.location.href='admin.html'
  })
}

// ------------------ ログアウト ------------------
if(document.getElementById('logoutBtn')){
  document.getElementById('logoutBtn').addEventListener('click', async ()=>{
    await adminSupabase.auth.signOut()
    window.location.href='admin_login.html'
  })
}

// ------------------ スレ・レス・ログ管理 ------------------
async function loadAdminData(){
  // スレッド管理
  const { data: threads } = await adminSupabase.from('threads').select('*').order('id',{ascending:false})
  const tDiv = document.getElementById('threadsAdminList')
  tDiv.innerHTML = ''
  threads.forEach(thread=>{
    const div = document.createElement('div')
    div.innerHTML = `ID: ${thread.id} | ${sanitizeInput(thread.title)} <button data-id="${thread.id}" class="delThreadBtn">削除</button>`
    tDiv.appendChild(div)
  })

  // レス管理
  const { data: posts } = await adminSupabase.from('posts').select('*').order('id',{ascending:false})
  const pDiv = document.getElementById('postsAdminList')
  pDiv.innerHTML = ''
  posts.forEach(post=>{
    const div = document.createElement('div')
    div.innerHTML = `ID: ${post.id} | ${sanitizeInput(post.name||'名無し')}: ${sanitizeInput(post.content)} <button data-id="${post.id}" class="delPostBtn">削除</button>`
    pDiv.appendChild(div)
  })

  // 操作ログ
  const { data: logs } = await adminSupabase.from('admin_logs').select('*').order('created_at',{ascending:false})
  const lDiv = document.getElementById('adminLogsList')
  lDiv.innerHTML = ''
  logs.forEach(log=>{
    const div = document.createElement('div')
    div.textContent = `${log.created_at} | ${log.admin_email} | ${log.action} | ${log.target_type}:${log.target_id}`
    lDiv.appendChild(div)
  })

  // 削除ボタン
  document.querySelectorAll('.delThreadBtn').forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      const id = Number(btn.dataset.id)
      await adminSupabase.from('threads').delete().eq('id',id)
      await adminSupabase.from('admin_logs').insert([{admin_email:adminSupabase.auth.getUser().data.user.email, action:'スレッド削除', target_type:'thread', target_id:id}])
      loadAdminData()
    })
  })
  document.querySelectorAll('.delPostBtn').forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      const id = Number(btn.dataset.id)
      await adminSupabase.from('posts').delete().eq('id',id)
      await adminSupabase.from('admin_logs').insert([{admin_email:adminSupabase.auth.getUser().data.user.email, action:'レス削除', target_type:'post', target_id:id}])
      loadAdminData()
    })
  })
}

if(document.getElementById('threadsAdminList')){
  loadAdminData()
}
