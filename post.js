<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>レス一覧</title>
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<header>
  <h1 id="threadName">スレッド</h1>
  <a href="threads.html">スレッド一覧へ戻る</a>
</header>
<main>
  <section>
    <h2>レス一覧</h2>
    <div id="postsList"></div>
  </section>
  <section id="newPostSection">
    <textarea id="newPostContent" placeholder="本文"></textarea><br>
    <input type="text" id="newPostName" placeholder="名前（任意）"><br>
    <input type="file" id="newPostImage"><br>
    <button id="submitPostBtn">投稿</button>
  </section>
</main>
<script type="module" src="js/Superbase.js"></script>
<script type="module" src="js/posts.js"></script>
</body>
</html>
