const sample = {
  resume:
    "大三学生，信息管理与信息系统专业。熟悉 AI 工具使用，参与过校园 AI 助手、课程资料自动整理、社团活动报名系统等项目。希望寻找 AI 产品、AI 应用开发、游戏策划或创意技术相关实习。",
  projects:
    "1. 使用 Cursor 和 Claude 设计 AI Agent 工作流，自动拆解用户任务并生成执行清单。\n2. 基于 Python 完成简历关键词分析脚本，输出岗位匹配度和缺失关键词。\n3. 负责校园活动小程序需求分析、原型设计和用户访谈，提升报名转化率。",
  skills: "Python, Cursor, Claude, Prompt Engineering, 产品原型, 用户访谈, AI应用开发",
  interests: "AI产品经理, AI应用开发, 游戏策划, 创意技术, 自动化工具"
};

const jobs = [
  {
    title: "AI 产品经理实习生",
    source: "Boss 直聘模拟库",
    city: "上海",
    tags: ["Agent", "Prompt Engineering", "用户研究", "PRD"],
    desc: "参与 AI Agent 产品需求分析、提示词策略设计、竞品研究与功能验收。",
    advantage: "你的 Agent 工作流、用户访谈和原型经历与岗位高度契合。",
    risk: "需要进一步呈现 PRD、数据指标和真实用户反馈闭环。",
    gaps: ["RAG", "PRD指标", "A/B测试"]
  },
  {
    title: "AI 应用开发实习生",
    source: "实习僧模拟库",
    city: "杭州",
    tags: ["Python", "FastAPI", "LangGraph", "Docker"],
    desc: "搭建 AI 应用后端服务，接入大模型 API，开发自动化工作流和评测脚本。",
    advantage: "Python 与 AI 应用开发经历能支撑快速上手原型开发。",
    risk: "云部署、后端工程化和 LangGraph 经历相对不足。",
    gaps: ["Docker", "FastAPI", "LangGraph"]
  },
  {
    title: "游戏系统策划实习生",
    source: "智联招聘模拟库",
    city: "广州",
    tags: ["玩法拆解", "数值设计", "用户洞察", "创意表达"],
    desc: "负责玩法模块调研、系统规则设计、玩家反馈整理与版本迭代建议。",
    advantage: "创意技术兴趣和用户洞察能力可以迁移到玩法策划。",
    risk: "需要补充游戏拆解文档、数值模型和作品集案例。",
    gaps: ["数值设计", "游戏拆解", "作品集"]
  },
  {
    title: "数据分析实习生",
    source: "Boss 直聘模拟库",
    city: "北京",
    tags: ["SQL", "Python", "BI", "业务分析"],
    desc: "支持业务数据看板、用户行为分析和指标归因，输出分析报告。",
    advantage: "Python 基础可复用，适合从工具脚本转向数据分析。",
    risk: "当前经历更偏 AI 产品与创意应用，SQL 和 BI 项目证据不足。",
    gaps: ["SQL", "Tableau", "业务指标"]
  }
];

const importedJobsKey = "offerCatcherImportedJobs";

const storageKey = "offerCatcherProfile";
const selectedJobKey = "offerCatcherSelectedJob";
const analysisKey = "offerCatcherAnalysisReady";
const $ = (id) => document.getElementById(id);

function getPage() {
  return document.body.dataset.page || "start";
}

function getSelectedJobIndex() {
  return Number(localStorage.getItem(selectedJobKey) || "0");
}

function setSelectedJobIndex(index) {
  localStorage.setItem(selectedJobKey, String(index));
}

function getSavedInputs() {
  return JSON.parse(localStorage.getItem(storageKey) || "null") || sample;
}

function getImportedJobs() {
  return JSON.parse(localStorage.getItem(importedJobsKey) || "null") || [];
}

function setImportedJobs(items) {
  localStorage.setItem(importedJobsKey, JSON.stringify(items));
}

function getInputs() {
  return {
    resume: $("resumeInput")?.value || getSavedInputs().resume,
    projects: $("projectInput")?.value || getSavedInputs().projects,
    skills: $("skillInput")?.value || getSavedInputs().skills,
    interests: $("interestInput")?.value || getSavedInputs().interests
  };
}

function saveInputs() {
  localStorage.setItem(storageKey, JSON.stringify(getInputs()));
}

function appendResumeText(text) {
  const resumeInput = $("resumeInput");
  const current = resumeInput.value.trim();
  resumeInput.value = current ? `${current}\n\n${text}` : text;
  saveInputs();
}

function loadInputs() {
  const saved = getSavedInputs();
  if ($("resumeInput")) $("resumeInput").value = saved.resume;
  if ($("projectInput")) $("projectInput").value = saved.projects;
  if ($("skillInput")) $("skillInput").value = saved.skills;
  if ($("interestInput")) $("interestInput").value = saved.interests;
}

function includesAny(text, words) {
  const lower = text.toLowerCase();
  return words.some((word) => lower.includes(word.toLowerCase()));
}

function profileText() {
  const input = getSavedInputs();
  return `${input.resume} ${input.projects} ${input.skills} ${input.interests}`;
}

function scoreStudent() {
  const text = profileText();
  return {
    "产品思维": 72 + (includesAny(text, ["用户", "产品", "PRD", "原型", "访谈"]) ? 13 : 0),
    "技术能力": 66 + (includesAny(text, ["Python", "FastAPI", "Cursor", "Claude", "Agent"]) ? 12 : 0),
    "沟通能力": 64 + (includesAny(text, ["访谈", "社团", "协作", "汇报", "活动"]) ? 8 : 0),
    "创造力": 76 + (includesAny(text, ["游戏", "创意", "AI", "自动化", "策划"]) ? 16 : 0)
  };
}

function calcJobScore(job) {
  const text = profileText().toLowerCase();
  const hits = job.tags.filter((tag) => text.includes(tag.toLowerCase())).length;
  const interestBoost = text.includes(job.title.slice(0, 4).toLowerCase()) ? 6 : 0;
  return Math.min(96, 72 + hits * 5 + interestBoost);
}

function sortedJobs() {
  const jobSource = [...getImportedJobs(), ...jobs];
  const filtered = $("highMatchOnly")?.checked
    ? jobSource.filter((job) => calcJobScore(job) >= 85)
    : jobSource;

  return filtered
    .map((job, index) => ({ ...job, index, score: calcJobScore(job) }))
    .sort((a, b) => b.score - a.score);
}

function renderHeroScore() {
  const top = sortedJobs()[0];
  if ($("topScore")) $("topScore").textContent = `${top.score}%`;
}

function renderProfile() {
  const scores = scoreStudent();
  $("abilityGrid").innerHTML = Object.entries(scores)
    .map(([name, value]) => `
      <article class="score-card">
        <span class="small-label">${name}</span>
        <strong>${value}</strong>
        <p>${name === "创造力" ? "适合探索型、跨学科岗位" : "可作为求职叙事支点"}</p>
        <div class="bar"><span style="width:${value}%"></span></div>
      </article>
    `)
    .join("");

  $("fitList").innerHTML = ["AI产品经理", "AI应用开发", "游戏策划", "创意技术方向"]
    .map((item) => `<li>${item}</li>`)
    .join("");
  $("avoidList").innerHTML = ["财务核算", "纯销售", "行政事务岗"]
    .map((item) => `<li>${item}</li>`)
    .join("");
}

function renderJobs() {
  if ($("importStatus")) {
    const imported = getImportedJobs().length;
    $("importStatus").textContent = imported
      ? `已导入 ${imported} 条来自 Boss Helper 的岗位数据，当前结果会优先按你的画像排序。`
      : "当前使用内置岗位库。你可以导入 Boss Helper 导出的岗位数据进行筛选。";
  }

  $("jobList").innerHTML = sortedJobs()
    .map((job) => `
      <article class="job-card ${job.index === getSelectedJobIndex() ? "selected" : ""}" data-job="${job.index}">
        <div>
          <h3>${job.title}</h3>
          <div class="job-meta">
            <span class="tag">${job.source}</span>
            <span class="tag">${job.city}</span>
          </div>
          <p>${job.desc}</p>
          <div class="tag-row">${job.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
          <div class="job-notes">
            <p class="note"><strong>优势</strong><br>${job.advantage}</p>
            <p class="note"><strong>风险</strong><br>${job.risk}</p>
          </div>
        </div>
        <div class="match-score">${job.score}%</div>
      </article>
    `)
    .join("");

  document.querySelectorAll(".job-card").forEach((card) => {
    card.addEventListener("click", () => {
      setSelectedJobIndex(Number(card.dataset.job));
      window.location.href = "./resume.html";
    });
  });
}

function selectedJob() {
  return jobs[getSelectedJobIndex()] || jobs[0];
}

function renderResumeAdvice() {
  const job = selectedJob();
  const risk = calcJobScore(job) > 88 ? "低" : "中";
  $("atsRisk").textContent = risk;
  if ($("atsRiskHero")) $("atsRiskHero").textContent = risk;
  $("missingKeywords").textContent = job.gaps.join("、");
  $("beforeText").textContent = "熟悉AI工具使用";
  $("afterText").textContent =
    `基于 Claude、Cursor 构建 ${job.tags[0]} 工作流，实现任务拆解、自动化处理与结果复盘，并沉淀可复用提示词模板。`;
  $("hrView").textContent =
    `候选人与「${job.title}」方向相关性较强，但项目经历还需要补充成果指标、职责边界和业务影响。建议把“做过什么”改成“解决了什么问题、用了什么方法、产生什么结果”。`;
}

function renderRoadmap() {
  const job = selectedJob();
  $("gapStrip").innerHTML = job.gaps
    .map((gap) => `<div class="gap-item"><strong>${gap}</strong><span>目标岗位关键缺口</span></div>`)
    .join("");
  $("timeline").innerHTML = [
    ["第1周", `复盘目标岗位 JD，围绕 ${job.gaps[0]} 补齐基础概念，并改写 2 条简历经历。`],
    ["第2-4周", `完成一个可展示的小项目：围绕 ${job.tags[0]} 做端到端 Demo，记录指标和截图。`],
    ["第5-8周", `补齐 ${job.gaps.slice(1).join("、")}，形成作品集页面，开始每周 10 个精准投递。`]
  ]
    .map(([time, text]) => `<article class="timeline-step"><strong>${time}</strong><p>${text}</p></article>`)
    .join("");
}

function bindStartPage() {
  loadInputs();
  ["resumeInput", "projectInput", "skillInput", "interestInput"].forEach((id) => {
    $(id).addEventListener("input", saveInputs);
  });

  bindUpload();

  $("loadSample").addEventListener("click", () => {
    localStorage.setItem(storageKey, JSON.stringify(sample));
    loadInputs();
  });

  $("analyzeBtn").addEventListener("click", () => {
    saveInputs();
    setSelectedJobIndex(sortedJobs()[0].index);
    localStorage.removeItem(analysisKey);
    window.location.href = "./loading.html";
  });
}

function normalizeJobRecord(record) {
  if (!record || typeof record !== "object") return null;
  const title = record.title || record.jobName || record.position || record.name;
  if (!title) return null;
  const skills = Array.isArray(record.skills)
    ? record.skills
    : String(record.skills || record.requirements || record.tags || "")
        .split(/[,，/|;]/)
        .map((item) => item.trim())
        .filter(Boolean);
  const description = record.description || record.desc || record.summary || "";
  const source = record.source || record.company || "Boss Helper 导入";
  const city = record.city || record.location || "未标注";
  return {
    title,
    source,
    city,
    tags: skills.slice(0, 4),
    desc: description || `${title} · ${source}`,
    advantage: record.advantage || "该岗位已从 Boss Helper 导入，可继续按学生画像筛选。",
    risk: record.risk || "请检查岗位描述是否完整，必要时补齐工作内容和技能要求。",
    gaps: skills.slice(0, 3).length ? skills.slice(0, 3) : ["关键词补全", "岗位说明", "职责边界"]
  };
}

function parseImportedJobs(raw) {
  const text = String(raw || "").trim();
  if (!text) return [];

  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed.map(normalizeJobRecord).filter(Boolean);
    if (parsed && typeof parsed === "object") return [normalizeJobRecord(parsed)].filter(Boolean);
  } catch {}

  const lines = text.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  if (lines.length > 1 && lines.every((line) => line.includes(","))) {
    const [headerLine, ...dataLines] = lines;
    const headers = headerLine.split(",").map((item) => item.trim().toLowerCase());
    return dataLines
      .map((line) => {
        const values = line.split(",").map((item) => item.trim());
        const record = {};
        headers.forEach((header, index) => {
          record[header] = values[index] || "";
        });
        return normalizeJobRecord(record);
      })
      .filter(Boolean);
  }

  return lines
    .map((line) => {
      const [title, source, city, ...rest] = line.split(/\s{2,}|\t/);
      return normalizeJobRecord({
        title,
        source,
        city,
        description: rest.join(" "),
        skills: rest.join(" ")
      });
    })
    .filter(Boolean);
}

function bindJobsIntegration() {
  const input = $("jobImportInput");
  const fileInput = $("jobFileInput");
  const importBtn = $("importJobsBtn");
  const sampleBtn = $("importSampleBtn");
  const clearBtn = $("clearImportedJobsBtn");
  const highMatchOnly = $("highMatchOnly");

  const renderFromInput = () => {
    const imported = parseImportedJobs(input.value);
    setImportedJobs(imported);
    renderJobs();
  };

  if (sampleBtn) {
    sampleBtn.addEventListener("click", () => {
      input.value = JSON.stringify(
        [
          {
            title: "Boss Helper 精选 - AI 产品经理",
            company: "Boss Helper",
            city: "上海",
            skills: "Agent, Prompt Engineering, 用户研究, PRD",
            description: "从 Boss Helper 导出的精选岗位，适合产品和 AI 方向学生。",
            source: "Boss Helper"
          },
          {
            title: "Boss Helper 精选 - AI 应用开发",
            company: "Boss Helper",
            city: "杭州",
            skills: "Python, FastAPI, Docker, LangGraph",
            description: "偏工程实现与自动化工作流，适合 AI 应用开发方向。",
            source: "Boss Helper"
          }
        ],
        null,
        2
      );
    });
  }

  if (importBtn) importBtn.addEventListener("click", renderFromInput);
  if (clearBtn) clearBtn.addEventListener("click", () => {
    input.value = "";
    setImportedJobs([]);
    renderJobs();
  });
  if (highMatchOnly) highMatchOnly.addEventListener("change", renderJobs);
  if (input) input.addEventListener("input", () => {
    if (!input.value.trim()) {
      setImportedJobs([]);
      renderJobs();
    }
  });

  if (fileInput) {
    fileInput.addEventListener("change", async () => {
      const file = fileInput.files?.[0];
      if (!file) return;
      const text = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => resolve("");
        reader.readAsText(file);
      });
      input.value = text;
      renderFromInput();
    });
  }
}

function fileKind(file) {
  const name = file.name.toLowerCase();
  if (file.type.startsWith("image/") || /\.(png|jpe?g|webp)$/.test(name)) return "image";
  if (file.type === "application/pdf" || name.endsWith(".pdf")) return "pdf";
  if (/\.(doc|docx)$/.test(name)) return "word";
  if (file.type.startsWith("text/") || name.endsWith(".txt")) return "text";
  return "unknown";
}

function formatFileSize(size) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function fileSummary(file, kind) {
  const typeMap = {
    image: "图片简历",
    pdf: "PDF 简历",
    word: "Word 简历",
    text: "文本简历",
    unknown: "简历文件"
  };
  return `【上传解析】${typeMap[kind]}：${file.name}（${formatFileSize(file.size)}）。AI 已读取文件结构，识别为候选人的简历材料，可用于后续职业画像、岗位匹配与简历优化。`;
}

async function readTextFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => resolve("");
    reader.readAsText(file);
  });
}

async function imagePreview(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

async function renderUploadedFiles(files) {
  const validFiles = Array.from(files).filter((file) => fileKind(file) !== "unknown");
  if (!validFiles.length) return;

  const fileResults = $("fileResults");
  fileResults.innerHTML = "";

  const summaries = [];
  for (const file of validFiles) {
    const kind = fileKind(file);
    let extracted = fileSummary(file, kind);
    if (kind === "text") {
      const text = (await readTextFile(file)).trim();
      if (text) extracted = `【文本简历】${file.name}\n${text.slice(0, 1200)}`;
    }

    const preview = kind === "image" ? await imagePreview(file) : "";
    const card = document.createElement("article");
    card.className = "file-card";
    card.innerHTML = `
      ${preview ? `<img src="${preview}" alt="${file.name} 预览" />` : `<div class="file-icon">${kind.toUpperCase()}</div>`}
      <div>
        <h3>${file.name}</h3>
        <p>${formatFileSize(file.size)} · ${kind === "pdf" ? "PDF" : kind === "word" ? "Word" : kind === "image" ? "图片" : "文本"}</p>
        <span>已加入求职分析材料</span>
      </div>
    `;
    fileResults.appendChild(card);
    summaries.push(extracted);
  }

  appendResumeText(summaries.join("\n\n"));
}

function bindUpload() {
  const zone = $("uploadZone");
  const fileInput = $("resumeFiles");
  const folderInput = $("resumeFolder");

  $("pickFilesBtn").addEventListener("click", () => fileInput.click());
  $("pickFolderBtn").addEventListener("click", () => folderInput.click());
  fileInput.addEventListener("change", () => renderUploadedFiles(fileInput.files));
  folderInput.addEventListener("change", () => renderUploadedFiles(folderInput.files));

  ["dragenter", "dragover"].forEach((eventName) => {
    zone.addEventListener(eventName, (event) => {
      event.preventDefault();
      zone.classList.add("dragging");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    zone.addEventListener(eventName, (event) => {
      event.preventDefault();
      zone.classList.remove("dragging");
    });
  });

  zone.addEventListener("drop", (event) => {
    renderUploadedFiles(event.dataTransfer.files);
  });
}

function bindLoadingPage() {
  const progress = $("loadingProgress");
  const startedAt = Date.now();
  const duration = 3200;
  const timer = setInterval(() => {
    const percent = Math.min(100, Math.round(((Date.now() - startedAt) / duration) * 100));
    progress.style.width = `${percent}%`;
    if (percent >= 100) {
      clearInterval(timer);
      localStorage.setItem(analysisKey, "ready");
      window.location.href = "./profile.html";
    }
  }, 120);
}

function renderResultPage() {
  renderHeroScore();
  const page = getPage();
  if (page === "profile") renderProfile();
  if (page === "jobs") renderJobs();
  if (page === "resume") renderResumeAdvice();
  if (page === "roadmap") renderRoadmap();
}

const page = getPage();
if (page === "start") bindStartPage();
if (page === "loading") bindLoadingPage();
if (page === "jobs") bindJobsIntegration();
if (["profile", "jobs", "resume", "roadmap"].includes(page)) renderResultPage();
