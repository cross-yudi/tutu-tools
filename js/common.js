// 兔兔在线工具站 — 公共函数

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
    var h2 = document.querySelector('.tool-header h2');
    if (!h2) return;
    var btn = document.createElement('span');
    btn.className = 'like-btn' + (liked ? ' liked' : '');
    btn.innerHTML = (liked ? '❤️' : '🤍') + ' 点赞 Like <span class="like-count">' + likes + '</span>';
    btn.title = '点赞 Like';
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      if (liked) return;
      liked = true;
      likes++;
      localStorage.setItem(key, likes);
      localStorage.setItem('tutu_liked_' + pageId, '1');
      btn.className = 'like-btn liked';
      btn.innerHTML = '❤️ 点赞 Like <span class="like-count">' + likes + '</span>';
      showToast('感谢点赞！Thanks!');
    });
    h2.appendChild(btn);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderBtn);
  } else {
    renderBtn();
  }
})();

// 回到顶部按钮
(function(){
  var btn = document.createElement('button');
  btn.id = 'backTop'; btn.innerHTML = '⬆'; btn.title = '回到顶部 Back to top';
  btn.onclick = function(){ window.scrollTo({top:0,behavior:'smooth'}); };
  document.body.appendChild(btn);
  window.addEventListener('scroll', function(){
    btn.classList.toggle('show', window.scrollY > 300);
  });
})();

// 暗色模式
(function(){
  var saved = localStorage.getItem('tutu_dark');
  if (saved === '1') document.body.classList.add('dark');

  var hdr = document.querySelector('.header-inner');
  var nav = hdr ? hdr.querySelector('nav') : null;
  if (nav) {
    var wrap = document.createElement('span');
    wrap.style.cssText = 'display:inline-flex;align-items:center;gap:6px;';
    nav.parentNode.insertBefore(wrap, nav);
    wrap.appendChild(nav);
    var toggle = document.createElement('button');
    toggle.id = 'darkToggle';
    toggle.innerHTML = document.body.classList.contains('dark') ? '☀️' : '🌙';
    toggle.title = '暗色/亮色模式 Dark/Light';
    toggle.onclick = function(){
      var isDark = document.body.classList.toggle('dark');
      localStorage.setItem('tutu_dark', isDark ? '1' : '0');
      toggle.innerHTML = isDark ? '☀️' : '🌙';
    };
    wrap.appendChild(toggle);
  }
})();

// 工具使用说明
(function(){
  var guides = {
    'case-converter':'大小写转换在线工具，支持英文大写、小写、首字母大写、大小写反转等模式。输入文本即可一键转换，适用于标题格式化、代码命名、文本处理等场景。<br>Online case converter — supports UPPERCASE, lowercase, Title Case, and tOGGLE cASE. Paste text and convert instantly.',
    'word-counter':'在线字数统计工具，实时统计字符数、单词数、中文字数、数字数量、行数及段落数。支持中英文混排文本，适用于文案写作、翻译校对等场景。<br>Online word counter — counts characters, words, Chinese characters, digits, lines and paragraphs in real time.',
    'password-gen':'在线随机密码生成器，可自定义密码长度，选择包含大写字母、小写字母、数字和特殊字符。使用浏览器安全随机数生成，适用于账号注册、安全设置等场景。<br>Secure password generator with customizable length and character types. Uses cryptographic random number generation.',
    'base64':'在线 Base64 编码解码工具，完美支持中文等 Unicode 字符。常用于数据传输、图片编码、API调试等场景。输入文本即可一键编码或解码。<br>Online Base64 encoder/decoder with full Unicode (Chinese) support. Useful for data transfer, image encoding, and API debugging.',
    'url-encode':'在线 URL 编码解码工具，支持 URL Encode 与 URL Decode 双向转换。适用于网址参数处理、API调用、爬虫开发等场景。<br>Online URL encoder/decoder. URL Encode & Decode for web development, API calls, and data processing.',
    'timestamp':'Unix 时间戳在线转换工具，支持秒级和毫秒级时间戳与日期时间双向转换，实时显示当前时间戳。适用于程序开发、数据分析等场景。<br>Unix timestamp converter — convert between timestamps (seconds/milliseconds) and readable dates. Shows live current timestamp.',
    'json-formatter':'JSON 在线格式化校验工具，支持 JSON 美化、压缩、语法校验及高亮显示。适用于 API 调试、配置文件查看、数据清洗等场景。<br>JSON formatter & validator — beautify, minify, validate and syntax-highlight JSON data. Ideal for API debugging and data inspection.',
    'color-tool':'在线颜色转换工具，支持 HEX、RGB、HSL 颜色格式互转，内置取色器和实时预览。适用于网页设计、UI开发、配色方案等场景。<br>Color converter — convert between HEX, RGB & HSL formats with a color picker and live preview. Perfect for web design and UI development.',
    'markdown-preview':'在线 Markdown 实时预览编辑器，支持标题、列表、代码块、引用、表格等常用语法。适用于写作文档、README、博客文章等场景。<br>Live Markdown editor with instant preview. Supports headings, lists, code blocks, quotes, and tables.',
    'html-formatter':'在线 HTML 代码格式化工具，支持 HTML 美化和压缩。适用于前端开发、网页调试、代码整理等场景。<br>Online HTML formatter — beautify & minify HTML code. Perfect for web developers.',
    'js-formatter':'在线 JavaScript 代码格式化工具，支持 JS 美化和压缩。适用于代码审查、学习研究、项目开发等场景。<br>JavaScript beautifier & minifier for clean, readable code.',
    'sql-formatter':'在线 SQL 语句格式化工具，支持 SQL 美化与压缩。适用于数据库管理、SQL优化、代码审查等场景。<br>SQL formatter — beautify & minify SQL queries for better readability.',
    'css-formatter':'在线 CSS 代码格式化工具，支持 CSS 美化与压缩。适用于前端开发、样式调试、代码规范等场景。<br>CSS beautifier & minifier — format your stylesheets instantly.',
    'regex-tester':'在线正则表达式测试工具，输入正则和测试文本，实时高亮匹配结果。适用于编程调试、文本处理、数据提取等场景。<br>Online regex tester — test regular expressions with real-time match highlighting.',
    'crontab-calc':'Crontab 定时任务执行时间计算器，输入 Cron 表达式即可查看后续执行时间。适用于Linux运维、定时任务配置等场景。<br>Crontab expression calculator — see when your cron jobs will run next.',
    'naming-converter':'编程命名风格在线转换工具，支持驼峰命名、蛇形命名、短横线命名等风格互转。适用于代码规范统一、变量命名等场景。<br>Naming convention converter — convert between camelCase, snake_case, kebab-case and more.',
    'json-editor':'JSON 在线编辑器，支持树形结构可视化和编辑。适用于数据分析、API调试、配置文件管理等场景。<br>Visual JSON editor with tree view for easy data manipulation.',
    'json-to-typescript':'JSON 转 TypeScript 类型定义工具，粘贴 JSON 数据自动生成 TS interface。适用于前端开发、API类型定义等场景。<br>Convert JSON to TypeScript interface/type definitions automatically.',
    'number-base':'在线进制转换器，支持二进制、八进制、十进制、十六进制互转。适用于计算机科学学习、编程开发、数字逻辑等场景。<br>Number base converter — binary, octal, decimal, hexadecimal in one click.',
    'fullwidth-halfwidth':'全角半角字符在线转换工具，支持一键互转。适用于中英文混排排版、代码清理、格式统一等场景。<br>Fullwidth/halfwidth character converter — switch between Chinese and ASCII width formats.',
    'morse-code':'摩斯电码在线编码解码工具，支持英文字母、数字、标点符号的摩斯电码互转，汉字自动转拼音后编码。适用于密码学学习、趣味通信等场景。<br>Morse code encoder/decoder — supports letters, numbers, punctuation. Chinese characters auto-convert to pinyin first.',
    'qrcode-gen':'在线二维码生成器，输入文本或网址一键生成 QR 码，支持下载保存为 PNG 图片。适用于网址分享、营销推广等场景。<br>QR code generator — create QR codes from text or URLs, download as PNG image.',
    'qrcode-decode':'在线二维码解码器，上传二维码图片即可解析其中内容。支持拍照和本地上传。<br>QR code decoder — upload a QR image to decode its content instantly.',
    'rmb-upper':'人民币大写金额在线转换工具，将数字金额转为中文大写，适用于财务报销、合同填写、支票开具等场景。<br>Convert numbers to Chinese RMB uppercase format — ideal for financial documents and checks.',
    'guid-generator':'在线 GUID/UUID 生成器，支持标准、大写、无连字符等多种格式，可批量生成多个唯一标识符。适用于数据库ID、API Key生成等场景。<br>GUID/UUID generator with multiple output formats. Generate unique identifiers in bulk.',
    'random-number-generator':'在线随机数生成器，可指定随机数范围和生成数量。<br>Random number generator with customizable range and quantity.',
    'gomoku':'经典五子棋人机对战游戏，你先手黑棋，AI后手白棋。点击棋盘落子，15×15棋盘，先连成五子者获胜。<br>Classic Gomoku vs AI — you play black, AI plays white. Be the first to get five in a row on a 15×15 board.',
    'minesweeper':'经典扫雷游戏，左键点击翻开格子，右键标记地雷。9×9网格，10颗雷。数字表示周围地雷数量。<br>Classic Minesweeper — left click to reveal, right click to flag mines. 9×9 grid with 10 mines.',
    'sudoku-game':'经典数独游戏，点击空白格再从下方数字键盘选择填入 1-9。每行、每列、每个3×3宫内数字不能重复。共6套谜题。<br>Classic Sudoku puzzle — click a cell and pick a number. Fill every row, column and 3×3 box with digits 1-9.',
    'game-2048':'2048数字合并益智游戏。使用方向键（或滑动/拖拽）移动方块，相同数字合并翻倍。目标：合成2048！<br>2048 number puzzle — use arrow keys or swipe to merge tiles. Reach the 2048 tile to win!',
    'snake-game':'贪吃蛇经典游戏，方向键控制蛇的移动方向。吃食物得分并加速，地图更大且支持穿墙。碰自己游戏结束。<br>Classic Snake — eat food to grow and speed up. Larger map with wrap-around walls.',
    'breakout':'打砖块经典游戏，鼠标或手指移动底部挡板反弹小球。消灭所有砖块即可过关。<br>Classic Breakout — move paddle with mouse to bounce ball and destroy all bricks.',
    'rps-challenge':'猜拳连胜挑战游戏，点击石头、剪刀或布出拳。电脑随机出拳，连胜纪录会保存。看你能连赢多少局！<br>Rock Paper Scissors streak challenge — pick your move and see how many you can win in a row!',
    'schulte-grid':'舒尔特方格注意力训练，按 1 到 25 的顺序依次点击数字。用时越短说明注意力越集中。<br>Schulte grid focus training — click numbers 1 through 25 in order as fast as you can.',
    'typing-test':'在线英文打字速度测试，随机显示一段范文，计时统计你的 WPM（每分钟单词数）和准确率。<br>Typing speed test — type a random passage and measure your WPM and accuracy.',
    'memory-card':'记忆翻牌配对游戏，翻开卡片记住位置，找出所有配对。考验你的记忆力！<br>Memory card matching game — flip cards and find all matching pairs.',
    'puzzle-15':'15数字滑动拼图游戏，点击空白格旁边的数字移动。目标是将数字按1-15顺序排列。<br>15-puzzle sliding game — rearrange the numbered tiles into order.',
    'cps-test':'鼠标连点速度测试，在指定时间内快速点击，统计你的每秒点击数(CPS)和总点击数。<br>CPS test — click as fast as you can and measure your clicks per second.',
    'guess-number':'猜数字小游戏，电脑随机生成一个1-100的数字，你每次猜测后获得提示（偏高或偏低），直到猜中！<br>Guess the number game — the computer picks a number from 1-100. Use the hints to find it!',
    'tetris':'经典俄罗斯方块游戏，方向键移动和旋转方块，填满整行消除得分。<br>Classic Tetris — move and rotate falling blocks to complete rows.',
    'airplane-war':'飞机大战射击游戏，鼠标移动你的战机，自动向敌机开火。消灭敌机得分，注意躲开敌机！<br>Airplane shooting game — move with mouse to dodge and auto-shoot enemies.',
    'piano':'在线钢琴，用电脑键盘弹奏乐曲。两排八度白键对应 Z-M和Q-U键，黑键对应上方数字键。<br>Play piano with your keyboard — two octaves mapped to Z-M and Q-U keys.',
    'fruit-catch':'接水果休闲游戏，鼠标或手指移动篮子接住掉落的水果。漏掉水果游戏结束。<br>Catch falling fruits with your basket — don\'t let any fruit hit the ground!',
    'pong':'经典乒乓球 Pong 对战 AI，鼠标上下移动你的球拍。每次击球都会加速，看你能得几分！<br>Classic Pong vs AI — move your paddle up/down with mouse. Ball speeds up with every hit!',
    'color-challenge':'颜色辨别挑战游戏，在多块相似色块中找出颜色不同的那一块。测试你的色觉敏感度！<br>Color discrimination challenge — spot the different colored block among similar ones.',
    'check-date-upper':'银行支票日期大写转换器，将日期转为中文大写格式，用于填写银行支票。<br>Convert dates to Chinese formal format for bank cheques.',
    'contract-calc':'合同款项计算器，根据合同总金额和付款比例，自动计算预付款、进度款、质保金等各项金额。<br>Contract payment breakdown calculator.',
    'currency-exchange':'实时货币汇率换算工具，支持人民币、美元、欧元、日元等全球主要货币。数据来自免费汇率 API。<br>Live currency exchange converter supporting major world currencies.',
    'loan-calc':'贷款计算器，支持等额本息和等额本金两种还款方式。输入贷款金额、利率和期限即可计算月供。<br>Loan & mortgage calculator with equal installment and principal methods.',
    'bank-code-lookup':'银行联行号/SWIFT代码查询工具，涵盖国内主要银行及微信支付、支付宝。用于跨行转账时查找银行代码。<br>Chinese bank SWIFT codes lookup for interbank transfers.',
    'workday-calc':'工作日计算器，计算两个日期之间的工作日天数（排除周末和中国法定节假日）。<br>Count business days between two dates, excluding weekends and Chinese holidays.',
    'date-calc':'在线日期计算器，支持计算两个日期的相差天数、日期加减天数，以及今日信息速查。<br>Date calculator — compute date differences, add/subtract days, and view today\'s info.',
    'lunar-calendar':'农历公历在线转换器，支持农历与公历日期的双向查询。<br>Chinese lunar calendar to Gregorian calendar converter.',
    'world-time':'全球主要城市当前时间速查，显示各城市与北京的时差。<br>Check current time in major cities worldwide, with Beijing time difference.',
    'holiday-schedule':'2026年中国法定节假日及调休安排速查表。<br>2026 Chinese public holiday schedule at a glance.',
    'expiry-calc':'保质期计算器，根据生产日期和保质期限，自动计算到期日期。<br>Shelf life & expiry date calculator.',
    'retirement-calc':'退休年龄计算器，根据最新延迟退休政策，帮你推算退休日期。<br>Calculate your retirement date based on the latest delayed retirement policy.',
    'stopwatch':'在线毫秒级秒表计时器，支持计次(Lap)功能。适用于运动计时、测试计时等场景。<br>Online stopwatch with millisecond precision and lap timing.',
    'random-date':'随机日期时间生成器，在指定日期范围内批量生成随机日期（可含时间）。<br>Generate random dates (and times) within a custom range.',
    'timestamp-batch':'时间戳批量转换工具，支持多行时间戳与日期时间互转，一次处理多条数据。<br>Batch timestamp converter — convert multiple timestamps or dates at once.',
    'special-symbols':'特殊符号大全，包含数学符号、货币符号、箭头、希腊字母等，点击即可复制。<br>Special symbols collection — math, currency, arrows, Greek letters. Click to copy.',
    'emoji-list':'Emoji 表情大全，按分类浏览和搜索 emoji 表情，点击即可复制到剪贴板。<br>Emoji collection — browse by category, click to copy any emoji.',
    'fancy-text':'花体英文转换器，将普通英文文字转换为多种 Unicode 花体艺术风格，可直接复制到社交平台使用。<br>Convert plain English to fancy Unicode text styles for social media and messaging.',
    'text-workflow':'文本处理工作流工具，可串联多个文本处理步骤（如去重、排序、替换等）一键执行。<br>Chain multiple text operations into a single workflow.',
    'text-add-numbering':'给文本每行增加序号或项目符号，支持自定义起始数字和格式。<br>Add line numbers or bullet points to your text.',
    'duplicate-checker':'内容重复率检测工具，对比两段文本的相似度，计算重复比例。<br>Compare two texts and calculate their similarity percentage.',
    'text-format-corrector':'中英文排版自动纠正工具，自动在中英文、数字之间添加合适空格，让排版更美观。<br>Auto-format Chinese-English mixed text with proper spacing.',
    'word-frequency':'词频在线统计工具，分析文本中每个单词或汉字的出现频率，支持排序和可视化。<br>Analyze word/character frequency in any text with sorting and bar chart display.',
    'bmi-calc':'BMI 体质指数在线计算器，输入身高和体重计算 BMI 值，评估体重是否在健康范围内。<br>Calculate your Body Mass Index and check if you are in a healthy weight range.',
    'random-quotes':'随机语录生成器，包含毒鸡汤、励志名言、经典台词和古诗词四大类，点击即可随机翻牌。<br>Random quote generator — funny, inspiring, classic movie lines and Chinese poetry.',
    'english-amount':'数字金额转英文大写工具，用于财务英文单据填写。<br>Convert numbers to English words for financial documents.',
    'tax-calculator':'中国个人所得税在线计算器，按最新个税起征点（5000元）和七级累进税率表精准计算税后收入。<br>Calculate Chinese personal income tax with the latest tax brackets and deductions.',
    'hash-tool':'在线 MD5、SHA-1、SHA-256、SHA-512 哈希值计算器。输入文本即可生成对应的哈希值。<br>Generate MD5, SHA-1, SHA-256, SHA-512 hashes from any text.',
    'id-card':'中国身份证号码在线校验工具，可校验身份证号码有效性，并提取出生日期、性别等信息。<br>Validate Chinese ID card numbers and extract birth date, gender and location info.',
    'barcode-gen':'在线条形码生成器，支持多种常见条形码格式。<br>Generate barcodes in common formats instantly.',
    'isbn-barcode':'ISBN 图书条形码生成工具，输入ISBN号自动生成条形码图片。<br>Generate ISBN barcode images from ISBN numbers.',
    'image-compress':'在线图片压缩工具，支持上传图片后调整压缩质量，减小文件体积，方便分享和存储。<br>Compress images online — adjust quality to reduce file size.',
    'brain-teasers':'脑筋急转弯大全，点击显示答案，再点换下一题。500+道趣味谜题等你来挑战！<br>500+ brain teasers and riddles — click to reveal the answer!',
    'random-idioms':'随机学成语工具，随机展示一个成语及释义，点击可换下一个。<br>Learn a random Chinese idiom with its meaning — great for daily study.',
    'length-converter':'在线长度单位换算器，支持米、千米、厘米、英寸、英尺、英里、海里等单位。<br>Length converter — m, km, cm, in, ft, mi, nmi and more.',
    'area-converter':'在线面积单位换算器，支持平方米、亩、公顷、英亩、平方英尺等单位。<br>Area converter — m², mu, ha, acre, ft² and more.',
    'weight-converter':'在线重量单位换算器，支持千克、斤、磅、盎司、吨等单位。<br>Weight converter — kg, jin, lb, oz, t and more.',
    'volume-converter':'在线体积单位换算器，支持立方米、升、毫升、加仑等单位。<br>Volume converter — m³, L, mL, gal and more.',
    'density-converter':'在线密度单位换算器，支持 kg/m³、g/cm³、lb/ft³ 等单位。<br>Density converter — kg/m³, g/cm³, lb/ft³ and more.',
    'temp-converter':'在线温度单位换算器，支持摄氏度(°C)、华氏度(°F)、开尔文(K)三种温度单位互转。<br>Temperature converter — convert between Celsius, Fahrenheit and Kelvin.',
    'pressure-converter':'在线压力单位换算器，支持帕斯卡(Pa)、巴(Bar)、大气压(atm)、PSI等单位。<br>Pressure converter — Pa, Bar, atm, PSI and more.',
    'byte-converter':'在线数据存储单位换算器，支持 Byte、KB、MB、GB、TB 等常用单位。<br>Data storage converter — Byte, KB, MB, GB, TB and more.',
    'time-converter':'在线时间单位换算器，支持秒、分钟、小时、天、周、月、年等单位。<br>Time unit converter — seconds, minutes, hours, days, weeks, months, years.',
    'university-lookup':'全国普通高等学校信息查询，包含院校标识码、主管部门、所在地、办学层次。支持985/211/双一流筛选。<br>Chinese university lookup with school code, administration, location and education level.',
    'world-capitals':'世界各国首都速查表，包含首都名称、人口、面积和官方语言信息。支持搜索筛选。<br>World capitals reference with population, area and language info. Searchable.',
    'country-codes':'世界国家地区代码速查，包含 ISO Alpha-2、Alpha-3 代码和域名后缀。<br>Country codes lookup — ISO Alpha-2, Alpha-3 and top-level domain suffixes.',
    'chinese-calendar':'老黄历与二十四节气在线查询，提供2026年全年节气日期表和每日宜忌参考。<br>Chinese traditional calendar with 2026 solar terms.',
    'simplified-traditional':'中文简繁体在线转换工具，支持简体中文与繁体中文互相转换。<br>Convert between Simplified and Traditional Chinese.',
    'aes-encrypt':'在线 AES 对称加密解密工具，支持 CBC 模式。适用于数据加密保护。<br>AES encryption/decryption tool with CBC mode for secure data protection.',
    'ascii-converter':'ASCII 编码在线转换工具，支持字符与 ASCII 码值的互转。<br>Convert between characters and their ASCII code values.',
    'blood-type':'子女血型遗传查询工具，根据父母血型推测子女可能血型。<br>Blood type inheritance calculator — predict possible blood types of children.',
    'common-phone-numbers':'常用电话号码速查表，包含报警、医疗急救、快递公司、银行客服等常用电话号码。<br>Emergency and utility phone numbers directory.',
    'area-code-lookup':'中国各城市电话区号及邮政编码在线查询。<br>Chinese city telephone area codes and postal codes lookup.',
    'country-phone-codes':'各国国际电话区号及时差查询，按国家/地区列出国际拨号代码。<br>International dialing codes and time difference lookup by country.',
    'reaction-test':'反应速度在线测试，点击变色后测你的反应时间（毫秒级）。<br>Reaction time test — measure how fast you can respond to a color change.',
    'text-to-html':'纯文本转 HTML 在线工具，自动处理换行符和特殊字符转义。<br>Convert plain text to HTML with automatic line break and entity escaping.',
    'date-format':'英文日期格式在线转换，支持 ISO、美式、英式等多种日期格式。<br>Convert dates between ISO, US, UK and other formats.',
    'image-base64':'在线图片转 Base64 编码工具，上传图片即可得到 Base64 字符串，可拖拽上传。<br>Convert images to Base64 encoded strings — supports drag and drop upload.',
    'text-dedup':'在线文本去重排序工具，支持按行去重、正向/反向排序、随机打乱等多种操作。<br>Deduplicate, sort, reverse and shuffle text lines online.',
    'text-replace':'在线文本查找替换工具，支持普通模式和正则表达式模式。<br>Find and replace text with optional regex support.',
    'list-calc':'在线数字列表计算器，支持求和、平均数、最大值、最小值、中位数等统计。<br>Calculate sum, average, max, min and median from a list of numbers.',
    'service-tax-calc':'个人劳务报酬所得税在线计算器，按最新劳务报酬税率表计算应缴税额。<br>Calculate personal service income tax with the latest tax brackets.',
    'tax-rate-calc':'税金税率在线计算器，支持增值税含税/不含税价格计算。<br>VAT and tax rate calculator — calculate price with or without tax.',
    'world-currency':'世界各国和地区的货币名称、符号、代码速查表。<br>World currencies reference — names, symbols and ISO codes for all countries.'
  };

  function addUsageGuide(){
    var main = document.querySelector('.main');
    if (!main) return;
    var path = location.pathname.replace(/.*\/tools\//,'').replace(/\/index\.html$/,'').replace(/\/$/,'');
    var guide = guides[path];
    if (!guide) return;
    var section = document.createElement('div');
    section.className = 'usage-guide';
    section.innerHTML = '<h3>📖 使用说明 <span style="font-size:.75rem;color:var(--text-en);">How to Use</span></h3><p>'+guide+'</p>';
    main.appendChild(section);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addUsageGuide);
  } else { addUsageGuide(); }
})();
