// 兔兔工具站 — 公共函数

// Toast 提示
function showToast(msg) {
  var t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(function () { t.classList.remove('show'); }, 1800);
}

// 复制文本到剪贴板
function copyText(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(function () {
      showToast('已复制到剪贴板');
    }).catch(function () {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  var ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); showToast('已复制到剪贴板'); }
  catch (e) { showToast('复制失败，请手动选择'); }
  document.body.removeChild(ta);
}

// 清空输入
function clearInput(id) {
  var el = document.getElementById(id);
  if (el) { el.value = ''; el.focus(); }
}

// 点赞功能
(function() {
  var pageId = location.pathname.replace(/\/index\.html$/, '').replace(/^\//, '').replace(/\//g, '-') || 'home';
  var key = 'tutu_likes_' + pageId;
  var likes = parseInt(localStorage.getItem(key) || '0');
  var liked = localStorage.getItem('tutu_liked_' + pageId) === '1';

  function renderBtn() {
    var container = document.querySelector('.tool-header');
    if (!container) return;
    var btn = document.createElement('button');
    btn.className = 'like-btn' + (liked ? ' liked' : '');
    btn.innerHTML = (liked ? '❤️ ' : '🤍 ') + '<span class="like-count">' + likes + '</span>';
    btn.title = '点赞 Like';
    btn.addEventListener('click', function() {
      if (liked) return;
      liked = true;
      likes++;
      localStorage.setItem(key, likes);
      localStorage.setItem('tutu_liked_' + pageId, '1');
      btn.className = 'like-btn liked';
      btn.innerHTML = '❤️ <span class="like-count">' + likes + '</span>';
      showToast('感谢点赞！Thanks!');
    });
    container.appendChild(btn);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderBtn);
  } else {
    renderBtn();
  }
})();
